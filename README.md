# readability.site

Use Mozilla's [Readability][readability] to, as [Drew DeVault][blog-post] put it, "uncrap" the web!

## Features
* Browse the web without intrusive styling, JavaScript, or ads.
* Get automatically redirected to compatible official text-only news sources.
* Generate a bookmarklet
* Be warned if Readability won't parse your webpage all that well
* Sanitized HTML output and a decently strong CSP
* Get Readability's output in HTML, plain text, or JSON 
  * `GET /path`
  * set format with `format=` (`html` OR `text` OR `json`)
  * use `redirect=off&ignore=on` if calling to readability.site from a non-browser user agent

## Install
```sh
npm install
npm start
```

The site should be then running on `http://localhost:8080`.

## Instances
| Owner                                             | Address                                          |
|---------------------------------------------------|--------------------------------------------------|
| Kyle Williams                                     | https://readability-site.supersonichub1.repl.co/ |
| ignaskiela @ irc://libera.chat/#sr.ht.watercooler | https://uncrap.agency/                           |

[readability]: https://github.com/mozilla/readability
[blog-post]: https://drewdevault.com/2021/09/23/Nitter-and-other-internet-reclamation-projects.html
