const NewsCrawlerTrigger = require('../index')

jest.setTimeout(20000)

describe('NewsCrawlerTrigger integration', () => {
	it('Integration test', async () => {
		await NewsCrawlerTrigger(console, { IsPastDue: false })
	})
})
