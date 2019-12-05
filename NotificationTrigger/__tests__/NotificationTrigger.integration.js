const NotificationTrigger = require('../index')

jest.setTimeout(20000)

describe('NotificationTrigger integration', () => {
	it('Integration test', async () => {
		await NotificationTrigger(console, {})
	})
})
