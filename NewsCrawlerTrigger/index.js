module.exports = async function(context, myTimer) {
	var timeStamp = new Date().toISOString()
	const { newsDbService } = require('nepaltoday-db-service')
	const { scrapeNewsLink } = require('./linkCrawler')
	const { scrapeNewsContent } = require('./ContentCrawler')

	const ipAddress = require('ip').address()

	if (myTimer.IsPastDue) {
		context.log('JavaScript is running late!')
	}

	try {
		const sources = await newsDbService.getAllSources()
		if (sources) {
			for (const source of sources) {
				const sourceId = source._id
				const baseUrl = source.link
				const logoLink = source.logoLink
				const categories = source.category

				if (categories) {
					context.log('Printing categories', categories)
					context.log('Printing categories.length', categories.length)

					for (const category of categories) {
						context.log('Printing category', category)

						const categoryName = category.name
						const url = `${baseUrl}${category.path}`
						const { links } = await scrapeNewsLink(baseUrl, url)

						context.log('Printing links', links)

						if (Array.isArray(links) && links.length > 0) {
							for (const link of links) {
								const content = await scrapeNewsContent(`${link.url}`, logoLink)
								if (content && content.title && sourceId) {
									content.source = sourceId
									content.createdDate = new Date()
									content.modifiedDate = new Date()
									content.isHeadline = true // TODO: check if h1 or h2
									content.hostIp = ipAddress
									content.category = categoryName
									//   console.log("content", content);
									const savedArticle = await newsDbService.saveArticle(content)
									if (savedArticle) {
										context.log('article saved successfully!!!!')
									}
								}
							}
						}
					}
				}
			}
		}
	} catch (error) {
		context.log('error occured here', error)
	}

	context.log('JavaScript timer trigger function ran!', timeStamp)
}
