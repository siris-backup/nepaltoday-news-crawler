# CrawlerTrigger

A `TimerTrigger` function app that crawls news websites every 10 mintues.

## How to run locally without azure function
* `npm start`

## How to run locally with azure function
* In VScode Azure extension, open the function app and download remote settings. It should create `local.settings.json` file with all required settings (e.g. AzureWebJobsStorage)
* `func host start`
