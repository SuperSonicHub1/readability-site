const { JSDOM } = require("jsdom")
const { Readability, isProbablyReaderable } = require("@mozilla/readability")

/**
 * @param {URL} url
 */
async function getReadabilityArticle(url) {
	const { document } = (
		await JSDOM.fromURL(url)
	).window
	const reader = new Readability(document)
	const article = reader.parse()
	return article
}

module.exports = { getReadabilityArticle }
