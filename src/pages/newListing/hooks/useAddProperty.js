import { useState } from 'react'

const useAddProperty = () => {
	const [loading, setLoading] = useState(false)

	const addNewProperty = async (values) => {
		setLoading(true)
		const finalValues = {
			listing: {
				listingType: values.listingType,
				availableDates: values.availableDates.map((range) => ({ startDate: range[0], endDate: range[1] })),
			},
			property: {
				description: values.description,
				...values.amenities,
				...Object.entries(values.size)?.reduce((sizes, entry) => {
					return {
						...sizes,
						[`${entry[0]}`]: parseInt(entry[1]),
					}
				}, {}),
				pictures: values.photos.map((photo) => photo.url),
			},
			location: {
				id: 1,
				coordinates: [37.7749, -122.4194],
				address: values.location.address,
				city: values.location.city,
			},
		}

		const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}propertyInfo/addProperty`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json;charset=utf-8' },
			body: JSON.stringify(finalValues),
		})
		console.log({ response })
		setLoading(false)
		return response
	}

	return [addNewProperty, loading]
}

export default useAddProperty
