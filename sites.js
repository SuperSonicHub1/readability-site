/**
 * The goal here is to create a redirection bank
 * not much unlike youtube-dl, which directs you to
 * official text-only or "lite" versions of webpages instead
 * of poorly churning the full versions through Readability.
 */

// https://greycoder.com/a-list-of-text-only-new-sites/
// https://sjmulder.nl/en/textonly.html
// https://duckduckgo.com/?q=text+only+news+sites&ia=web

/** 
 * @callback Redirect
 * @param {URL} url
 * @return {URL}
 */

/**@type {Object<string, Redirect>} */
const sites = {
	// https://www.cnn.com/
	// https://www.cnn.com/2021/09/23/us/gabby-petito-brian-laundrie-update-thursday/index.html

	// https://lite.cnn.com/en
	// https://lite.cnn.com/en/article/h_0eee0fcdf2364824e37ebee553494dd7
	"www.cnn.com": "lite.cnn.com",
	
	// https://www.npr.org/
	// https://www.npr.org/1040078971
	// https://www.npr.org/sections/coronavirus-live-updates/2021/09/23/1040078971/cdc-covid-19-pfizer-boosters-adults-guidance
	
	
	// https://text.npr.org/
	// https://text.npr.org/1040078971
	"www.npr.org": (url) => {
		const pathParts = url.pathname.split("/")
		let newURL

		// https://www.npr.org/1040078971
		if (pathParts.length === 2)
			newURL = new URL(url.pathname, "https://text.npr.org/")
		// https://www.npr.org/sections/coronavirus-live-updates/2021/09/23/1040078971/cdc-covid-19-pfizer-boosters-adults-guidance
		else
			newURL = new URL("/" + pathParts[6], "https://text.npr.org/")

		return newURL
	},

	// https://www.cbc.ca/news/canada/edmonton/record-icu-admissions-covid19-1.6186914
	// https://www.cbc.ca/lite/story/1.6186914

	// https://www.cbc.ca/news/canada
	// https://www.cbc.ca/lite/news/canada
	"www.cbc.ca": (url) => {
	}
}

module.exports = sites
