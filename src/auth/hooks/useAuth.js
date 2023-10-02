import { useRecoilValue, useSetRecoilState } from 'recoil'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'
import { notification } from 'antd'
import { AUTH_EVENTS } from '../helpers/enums'
import { auth, firebase } from '../firebase/config'

const useAuth = ({ reroute, userAtom, authSelector, alert, setAlert }) => {
	const userData = JSON.parse(localStorage.getItem('user'))
	const setUserAtom = useSetRecoilState(userAtom)
	const userAuth = useRecoilValue(authSelector())
	const [loading, setLoading] = useState(false)
	const [signupComplete, setSignupComplete] = useState(false)
	const [userEmail, setUserEmail] = useState('')
	const navigate = useNavigate()
	const { action } = useParams()
	const { pathname } = useLocation()

	useEffect(() => {
		if (!loading && userAuth) {
			if (userAuth?.user === 'no user') {
				setAlert({
					type: 'error',
					message: 'No user record for this email address.',
				})
				setLoading(false)
				localStorage.setItem('user', JSON.stringify(null))
			} else if (userAuth?.authorized === false) {
				setLoading(false)
				setUserAtom(null)
				localStorage.setItem('user', JSON.stringify(null))
			} else if (userAuth?.authorized === true && pathname.includes('auth') && action === 'login') {
				setLoading(false)
				console.log('userData', userData)
				if (userData?.paymentMethodId) {
					const redirectTo = sessionStorage.getItem('redirectTo')
					sessionStorage.setItem('redirectTo', JSON.stringify(null))
					navigate(redirectTo || reroute || '/', { replace: true })
				} else {
					setSignupComplete(true)
					setUserEmail(userData?.email)
					navigate('/auth/signup', { replace: true })
				}
			} else if (userData && !userData?.paymentMethodId && pathname.includes('auth') && action === 'signup') {
				setSignupComplete(true)
				setUserEmail(userData?.email)
			}
		} else if (userData && !userData?.paymentMethodId && pathname.includes('auth') && action === 'signup') {
			setSignupComplete(true)
			setUserEmail(userData?.email)
		}
	}, [userAuth, loading]) // eslint-disable-line

	const signInWithEmailAndPassword = async ({ email, password }) => {
		try {
			const userCredential = await auth.signInWithEmailAndPassword(email, password)
			if (userCredential) {
				const token = await auth.currentUser?.getIdToken()
				const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}users/email/${email}`, {
					method: 'GET',
					headers: { 'Content-Type': 'application/json;charset=utf-8' },
				})

				if (response.status === 200) {
					const user = await response.json()
					if (user) {
						localStorage.setItem('user', JSON.stringify({ ...user, id: user._id }))
						localStorage.setItem('token', JSON.stringify({ token }))
						setUserAtom(user)
					}
				}
			} else {
				setAlert({
					type: 'error',
					message: 'Email address or password is incorrect.',
				})
			}

			setLoading(false)
		} catch (err) {
			console.log({ err: err.code })

			if (err.code === 'auth/user-not-found') {
				setAlert({
					type: 'error',
					message: 'No user record for this email address.',
				})
			} else if (err.code === 'auth/wrong-password') {
				setAlert({
					type: 'error',
					message: 'Incorrect password entered. Please try again.',
				})
			}
			setLoading(false)
		}
	}

	const resetPassword = async ({ email }) => {
		await auth
			.sendPasswordResetEmail(email)
			.then(() => {
				setAlert({
					type: 'success',
					message: 'Password reset email sent successfully.',
				})
			})
			.catch((err) => console.log(err))
		setLoading(false)
		return 'success'
	}
	const signUp = async (values) => {
		console.log(values)
		try {
			const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}users/signUp`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json;charset=utf-8' },
				body: JSON.stringify({
					name: values.name,
					email: values.email,
					password: values.password,
					currentCity: values.currentCity,
					receiveEmails: values.receiveEmails,
					destinationCity: values.destinationCity,
					migratePermanently: values?.migratePermanently,
				}),
			})
			if (response.status === 200) {
				response.json().then(async (data) => {
					notification['success']({
						message: 'User created successfully',
						duration: 5,
						onClick: () => {
							notification.close()
						},
					})
					await signInWithEmailAndPassword({ email: values.email, password: values.password })
					setSignupComplete(true)
					setUserEmail(values.email)
					setLoading(false)
				})
			} else {
				setAlert({
					type: 'error',
					message: 'A user against this email is already registered.',
				})
				setLoading(false)
			}
		} catch (err) {
			if (err.code === 'auth/invalid-password') {
				setAlert({
					type: 'error',
					message: 'The password must be a string with at least 6 characters.',
				})
			}
			console.log(err)
			setLoading(false)
		}
	}
	const logout = () => {
		if (userAuth) {
			firebase.auth().signOut()
			setUserAtom(null)
			localStorage.setItem('user', JSON.stringify(null))
			localStorage.setItem('token', JSON.stringify(null))
			window.location.href = '/'
		}
	}

	const dispatch = useCallback((event) => {
		setLoading(true)
		try {
			switch (event.type) {
				case AUTH_EVENTS.LOGIN:
					signInWithEmailAndPassword(event.payload)
					break
				case AUTH_EVENTS.SIGNUP:
					signUp(event.payload)
					break
				case AUTH_EVENTS.LOGOUT:
					logout()
					break
				case AUTH_EVENTS.RESET_PASSWORD:
					resetPassword(event.payload)
					break
				default:
					break
			}
		} catch (err) {
			console.log(err)
		}
	})

	return [dispatch, loading, signupComplete, userEmail]
}

export default useAuth
