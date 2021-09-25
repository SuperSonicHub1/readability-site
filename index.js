const express = require("express")
const nunjucks = require("nunjucks")

const { getReadabilityArticle, readerable } = require("./readability.js")
const sites = require("./sites.js")

// Feel free to change the domain name and port to suit your needs!
const port = 8080
const domainName = "readability-site.supersonichub1.repl.co"

const app = express()
app.use('/static', express.static('static'))
nunjucks.configure('views', {
	autoescape: true,
	express: app
})
app.set("view engine", "html")

// Set a CSP header on every response
app.use((req, res, next) => {
	res.append(
		'Content-Security-Policy',
		"default-src 'self'; img-src *; media-src *; script-src 'none'"
	)
	next()
})

/**
 * @param {object} res
 * @param {string} message
 * @param {number} [status=400]
 */
function error(res, message, status = 400) {
	res
		.status(status)
		.send(message)
}

app.get('/', (req, res) => res.render('index'))
app.get('/read', async (req, res) => {
	const { query } = req

	if (!("url" in query)) {
		error(res, "Buddy, you didn't supply me a URL!")
		return
	}

	let url
	try {
		url = new URL(query.url)
	} catch (e) {
		error(res, "Buddy, you gave me an invalid URL!")
		return
	}


	const format = query.format || "html"
	const redirect = (query.redirect || "on") === "on" ? true : false
	const ignore = (query.ignore || "off") === "on" ? true : false

	if (redirect && url.hostname in sites) {
		const redirectURL = sites[url.hostname](url)
		if (redirectURL) {
			res.redirect(redirectURL)
			return
		}
	}

	if (!ignore) {
		if (!(await readerable(url))) {
			const acceptURLSearchParams = new URLSearchParams({url, format, ignore: "on"})
			const path = "/read?" + acceptURLSearchParams

			res.render("warning", { path, url })
			return
		}
	}

	const article = await getReadabilityArticle(url)

	if (!article) {
		error(res, "Sorry, man; we weren't able to extract anything!", 500)
		return
	}

	switch (format) {
		case "html":
			res.render('read', { article, url })
			break
		case "text":
			res
				.type("text/plain")
				.send(article.textContent)
			break
		case "json":
			res.json(article)
			break
	}
})

app.get('/bookmarklet', async (req, res) => {
	const { query } = req
	const redirect = (query.redirect || "on")
	const ignore = (query.ignore || "off")

	const script = `(function (window) {
		const params = new URLSearchParams({
			"redirect": ${JSON.stringify(redirect)},
			"ignore": ${JSON.stringify(ignore)},
			"url": window.location.toString(),
		});
		const url = "https://" + ${JSON.stringify(domainName)} + "/read?" + params;
		window.location.assign(url);
	})(window)`

	const url = "javascript:" + script
	res.render('bookmarklet', { url })
})

app.listen(port, () => console.log(`readability.site listening at http://localhost:${port}`))
