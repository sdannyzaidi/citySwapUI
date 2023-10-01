export const endpoints = {
	'sublease-request': (id) => `request/sublease-request/${id}`,
	'swap-request': `request/swap-request`,
	'mark-request-status': (id) => `request/requests/${id}`,
	find: 'propertyInfo/find/',
	'user-properties': (id) => `propertyInfo/user/${id}`,
	'create-subscription': 'stripe/create-subscription',
	'cancel-subscription': 'stripe/cancel-subscription',
	'change-default-payment-method': 'stripe/change-default-payment-method',
	'confirm-transaction': 'stripe/confirm-transaction',
	'user-requests': (id) => `users/requests/${id}`,
	'generate-otp': 'users/generate-otp',
	'add-review': 'review/add-review',
	'update-property': (id) => `propertyInfo/updateProperty/${id}`,
	'delete-property': (id) => `propertyInfo/${id}`,
}
