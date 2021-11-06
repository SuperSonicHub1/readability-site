const createDOMPurify = require('dompurify')
const { JSDOM } = require("jsdom")
const { Readability, isProbablyReaderable } = require("@mozilla/readability")

const DOMPurify = createDOMPurify(new JSDOM('').window)
const fragmentDocument = new JSDOM('').window.document

/**
 * @param {string} html
 * @returns {DocumentFragment}
 */
function fragmentFromString(html) {
    return fragmentDocument.createRange().createContextualFragment(html);
}

/**
 * @param {URL} url
 * @return {Document}
 */
async function getDocument(url) {
	return (await JSDOM.fromURL(url)).window.document
}

/**
 * @param {URL} url
 * @return {boolean}
 */
async function readerable(url) {
	let document
	try {
		document = await getDocument(url)
	} catch (e) {
		console.error(e)
		return false
	}

	const readerable = isProbablyReaderable(document)
	return readerable
}

/**
 * https://stackoverflow.com/a/4793630
 * @param {Node} referenceNode
 * @param {Node} newNode
 */
function insertAfter(referenceNode, newNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

/**
 * @param {string} html
 * @param {Record<string, string>} options
 * @returns {string}
 */
function addRedirectLinks(html, options) {
	const fragment = fragmentFromString(html)
	// Ignore fragment URLs
	for (const anchor of fragment.querySelectorAll("a:not([href^='#'])")) {
		const {href} = anchor
		const redirectedURLParams = new URLSearchParams({
			...options,
			format: "html",
			url: href
		})
		redirectHref = "/read?" + redirectedURLParams
		
		// Create a new anchor that doesn't redirect you
		const redirectAnchor = fragmentDocument.createElement("a")
		redirectAnchor.href = redirectHref
		redirectAnchor.textContent = '[redirect]'

		const superscript = fragmentDocument.createElement("sup")
		superscript.appendChild(redirectAnchor)
		insertAfter(anchor, superscript)
	}
	return fragment.querySelector("div.page").outerHTML
	
}

/**
 * @param {URL} url
 * @return {object}
 */
async function getReadabilityArticle(url, options) {
	let document
	try {
		document = await getDocument(url)
	} catch (e) {
		console.error(e)
		return null
	}

	const reader = new Readability(document)
	const article = reader.parse()
	if (article)
		article.content = addRedirectLinks(DOMPurify.sanitize(article.content), options)
	return article
}

module.exports = { getReadabilityArticle, readerable }
