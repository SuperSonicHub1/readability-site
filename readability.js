const createDOMPurify = require('dompurify')
const { JSDOM } = require("jsdom")
const { Readability, isProbablyReaderable } = require("@mozilla/readability")

const DOMPurify = createDOMPurify(new JSDOM('').window);

/**
 * @param {URL} url
 * @return {Document}
 */
async function getDocument(url) {
	return await JSDOM.fromURL(url).window.document
}

/**
 * @param {URL} url
 * @return {boolean}
 */
async function readerable(url) {
	try {
		const document = await getDocument(url)
	} catch (e) {
		return false
	}

	const readerable = isProbablyReaderable(document)
	return readerable
}

/**
 * @param {URL} url
 * @return {object}
 */
async function getReadabilityArticle(url) {
	try {
		const document = await getDocument(url)
	} catch (e) {
		return null
	}

	const reader = new Readability(document)
	const article = reader.parse()
	if (article)
		article.content = DOMPurify.sanitize(article.content)
	return article
}

module.exports = { getReadabilityArticle, readerable }
