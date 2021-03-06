module.exports = async function(context, myTimer) {
	var timeStamp = new Date().toISOString()
	const { newsDbService } = require('nepaltoday-db-service')
	const { scrapeNewsLink } = require('./linkCrawler')
	const { getNewsContent } = require('./content-crawler')

	const ipAddress = require('ip').address()

	if (myTimer.IsPastDue) {
		context.log('JavaScript is running late!')
	}

	const getCategoryName = category => {
		if (category === 'news' || category === 'politics') {
			return 'news'
		} else {
			return category
		}
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
					const crawlTime = new Date()

					for (const category of categories) {
						context.log('Printing category', category)

						const categoryName = category.name
						const url = `${baseUrl}${category.path}`

						const { error, links } = await scrapeNewsLink(baseUrl, url)
						if (error) {
							context.log('Error occured getting news lnks ', error)
							continue
						}

						if (Array.isArray(links) && links.length > 0) {
							for (const link of links) {
								const content = await getNewsContent(`${link}`, logoLink, baseUrl, context)

								if (content && content.title && sourceId) {
									content.source = sourceId
									content.createdDate = crawlTime
									content.modifiedDate = crawlTime
									content.publishedDate = crawlTime
									content.isHeadline = true // TODO: check if h1 or h2
									content.hostIp = ipAddress
									content.category = getCategoryName(categoryName)
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
