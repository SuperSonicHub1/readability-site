/**
 * The goal here is to create a redirection bank
 * not much unlike youtube-dl, which directs you to
 * official text-only or "lite" versions of webpages instead
 * of poorly churning the full versions through Readability.
 */

// https://greycoder.com/a-list-of-text-only-new-sites/
// https://sjmulder.nl/en/textonly.html
// https://www.poynter.org/tech-tools/2017/text-only-news-sites-are-slowly-making-a-comeback-heres-why/
// https://duckduckgo.com/?q=text+only+news+sites&ia=web

/** 
 * @callback Redirect
 * @param {URL} url
 * @return {URL}
 */

/**@type {Object<string, Redirect>} */
const sites = {
	
	"www.npr.org": (url) => {
		const base = "https://text.npr.org/"
		const pathParts = url.pathname.split("/")
		// https://www.npr.org/
		// https://text.npr.org/

		// https://www.npr.org/1040078971
		// https://text.npr.org/1040078971
		if (pathParts.length === 2) return new URL(url.pathname, base)
		// https://www.npr.org/sections/coronavirus-live-updates/2021/09/23/1040078971/cdc-covid-19-pfizer-boosters-adults-guidance
		// https://text.npr.org/1040078971
		else return new URL("/" + pathParts[5], base)
	},

	"www.cbc.ca": (url) => {
		const base = "https://www.cbc.ca/lite/"
		const idRegex = /\d\.\d{6,}/

		if (url.pathname.startsWith("/lite")) return url

		// https://www.cbc.ca/
		// https://www.cbc.ca/lite/trending-news
		if (url.pathname === "/") return new URL("./trending-news", base)

		const pathParts = url.pathname.split("/")
		if (pathParts[1] === "news") {
			const matches = idRegex.exec(url.pathname)

			// https://www.cbc.ca/news/politics/meng-wanzhou-us-court-1.6188093
			// https://www.cbc.ca/lite/story/1.6188093
			if (matches) return new URL(`./story/${matches[0]}`, base)

			// https://www.cbc.ca/news/canada/british-columbia
			// https://www.cbc.ca/lite/news/canada/british-columbia
			else return new URL("." + url.pathname, base)
		}
	}
}

module.exports = sites
