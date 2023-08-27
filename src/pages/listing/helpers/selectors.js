import { listingsAtom } from '@atoms'
import { selectorFamily } from 'recoil'
import { checkRangeIncludes, checkRangeOverlap, findRangeOverlap } from '../../newListing/components/multiRangePicker'

export const swappableListingsSelector = selectorFamily({
	key: 'swappableListingsSelector',
	get:
		(props) =>
		({ get }) => {
			const { id, dateRange } = props
			const listings = get(listingByUserSelector({ id }))
			const filteredListings = listings.filter((listing) =>
				(listing.asscocitedListings || listing.associatedListings)
					?.find((obj) => obj.listingType === 'swap')
					?.availableDates?.some((range) => {
						// console.log({ searchRange: dateRange, range: [range.startDate, range.endDate], ans: checkRangeIncludes(dateRange, [range.startDate, range.endDate]) })
						return checkRangeIncludes(dateRange, [range.startDate, range.endDate])
					})
			)
			return filteredListings
		},
})
export const partialSwappableListingsSelector = selectorFamily({
	key: 'partialSwappableListingsSelector',
	get:
		(props) =>
		({ get }) => {
			const { id, dateRange } = props
			const listings = get(listingByUserSelector({ id }))
			const filteredListings = listings
				.filter((listing) =>
					(listing.asscocitedListings || listing.associatedListings)
						?.find((obj) => obj.listingType === 'swap')
						?.availableDates?.some(
							(range) =>
								!checkRangeIncludes(dateRange, [range.startDate, range.endDate]) &&
								(checkRangeOverlap(dateRange, [range.startDate, range.endDate]) || checkRangeOverlap([range.startDate, range.endDate], dateRange))
						)
				)
				?.map((listing) => ({
					...listing,
					...findRangeOverlap(dateRange, (listing.asscocitedListings || listing.associatedListings)?.find((obj) => obj.listingType === 'swap')?.availableDates),
				}))
			return filteredListings
		},
})
export const suggestedListingsSelector = selectorFamily({
	key: 'suggestedListingsSelector',
	get:
		(props) =>
		({ get }) => {
			const { id, dateRange, location } = props
			const listings = get(listingsNotByUserSelector({ id }))
			const filteredListings = listings.filter(
				(listing) =>
					listing.location?.country === location?.country &&
					listing.location?.city === location?.city &&
					(listing.asscocitedListings || listing.associatedListings)
						?.find((obj) => obj.listingType === 'sublease')
						?.availableDates?.some((range) => checkRangeOverlap(dateRange, [range.startDate, range.endDate]))
			)
			return filteredListings
		},
})
export const listingByIdSelector = selectorFamily({
	key: 'listingByIdSelector',
	get:
		(props) =>
		({ get }) => {
			const { id } = props
			const listings = get(listingsAtom)
			console.log({ listings })
			const listing = listings?.find((listing) => listing.property._id === id)
			return listing
		},
})
export const searchPropertiesSelector = selectorFamily({
	key: 'searchPropertiesSelector',
	get:
		(props) =>
		({ get }) => {
			const { id, dateRange, location, type } = props
			const listings = get(listingsNotByUserSelector({ id }))
			const filteredListings = listings.filter(
				(listing) =>
					listing.location?.country === location?.country &&
					listing.location?.city === location?.city &&
					(listing.asscocitedListings || listing.associatedListings)
						?.find((obj) => obj.listingType === type)
						?.availableDates?.some((range) => checkRangeOverlap(dateRange, [range.startDate, range.endDate]))
			)
			return filteredListings
		},
})
export const listingsNotByUserSelector = selectorFamily({
	key: 'listingsNotByUserSelector',
	get:
		(props) =>
		({ get }) => {
			const { id } = props
			const listings = get(listingsAtom)
			const filteredListings = listings?.filter((listing) => !(listing.user?._id === id || listing.property?.user === id))
			return filteredListings || []
		},
})
export const listingByUserSelector = selectorFamily({
	key: 'listingByUserSelector',
	get:
		(props) =>
		({ get }) => {
			const { id } = props
			const listings = get(listingsAtom)
			const filteredListings = listings?.filter((listing) => listing.user?._id === id || listing.property?.user === id)
			return filteredListings || []
		},
})
