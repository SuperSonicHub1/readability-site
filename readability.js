const createDOMPurify = require('dompurify')
const { JSDOM } = require("jsdom")
const { Readability, isProbablyReaderable } = require("@mozilla/readability")

const DOMPurify = createDOMPurify(new JSDOM('').window);

/**
 * @param {URL} url
 * @return {boolean}
 */
async function readerable(url) {
	const { document } = (
		await JSDOM.fromURL(url)
	).window

	const readerable = isProbablyReaderable(document)
	return readerable
}

/**
 * @param {URL} url
 */
async function getReadabilityArticle(url) {
	const { document } = (
		await JSDOM.fromURL(url)
	).window

	const reader = new Readability(document)
	const article = reader.parse()
	article.content = DOMPurify.sanitize(article.content)
	return article
}

module.exports = { getReadabilityArticle, readerable }
