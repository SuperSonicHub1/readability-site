const express = require("express")
const nunjucks = require("nunjucks")

const { getReadabilityArticle } = require("./readability.js")
const sites = require("./sites.js")

const port = 8080

const app = express()
app.use('/static', express.static('static'))
nunjucks.configure('views', {
	autoescape: true,
	express: app
})
app.set("view engine", "html")

app.get('/', (req, res) => res.render('index'))
app.get('/read', async (req, res) => {
	const { query } = req

	if (!("url" in query)) {
		res
			.status(400)
			.send("Buddy, you didn't supply me a URL!")
		return
	}

	let url
	try {
		url = new URL(query.url)
	} catch (e) {
		res
			.status(400)
			.send("Buddy, you gave me an invalid URL!")
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

	const article = await getReadabilityArticle(url)

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

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
