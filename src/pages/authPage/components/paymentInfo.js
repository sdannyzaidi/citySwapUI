import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import StripeForm from './stripeForm'
import { endpoints } from '../../../helpers/enums'
import { useEffect, useState } from 'react'
import { Loader } from '@components'
const stripePromise = await loadStripe('pk_test_51NhLmaB3YKmZw9uMJTH8E3HmStFcV5rb7VorrBCNeZliRMKiXLuFbTJQZ1z3HEP7NWgyipdru10yb6eXT4IMyQbY00vjulAgfp')

const PaymentInfo = ({ userId, clientSecret }) => {
	return (
		<div className='relative flex flex-col items-center justify-center space-y-4 pt-2 pb-8 px-4 sm:w-[550px] max-md:w-full rounded-xl '>
			{!clientSecret ? (
				<div className='flex flex-col justify-center items-center h-full'>
					<div className='my-auto align-middle'>
						<Loader />
					</div>
				</div>
			) : (
				<Elements stripe={stripePromise} options={{ clientSecret }}>
					<StripeForm userId={userId} />
				</Elements>
			)}
		</div>
	)
}

export default PaymentInfo
