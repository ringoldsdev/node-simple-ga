
# SimpleGoogleAnalytics
A simple to use NodeJs package for the Google Analytics Reporting API

## Down to business
It should be much easier to retrieve data from the Google Analytics API and this package helps you achieve that. Focus on analyzing the data and let SimpleGA handle the rest.

Getting the top 10 links is as easy as this:

```JavaScript
const analytics = new SimpleGA("./key.json");

var request = (new Request())
	.view(12345678)
	.results(10)
	.dimension("pagePath")
	.metric("pageviews")
	.orderDesc("pageviews");
	
var data = await analytics.run(request);
```	

By default, data will be returned as an array of objects in the format below. For the top 10 list the result would look similar to this:

```JavaScript
[
	{
		dimensions: {
			pagePath: "/"
		},
		metrics: {
			pageviews: 123
		}
	},
	...
]
```
It's that simple!
## What it really is
SimpleGA is a package that helps you to create a [Reporting API v4 compliant](https://developers.google.com/analytics/devguides/reporting/core/v4/rest/v4/reports/batchGet) JSON request,  sending it to the Google Analytics API, parsing the response and, if possible and requested by the user, paginating additional requests.
## What it won't be
This package is not and will not be a data processing package. Data processing is left up to you - the developer, and no improvements beyond bugfixes of the basic data processing it already has must not be expected.

However, you can expect further improvements to the request creation part of the package and migrating the package to be compliant with the v5 of the Reporting API when the time comes.
## Installation
To use the package, run:
```JavaScript
npm i simple-ga
```
Before using the package, you must create and set up a [Service Account](https://developers.google.com/identity/protocols/OAuth2ServiceAccount). You can also watch a video tutorial on [how to set up a Service account](https://www.youtube.com/watch?v=r6cWB0xnOwE). While the title says it's a PHP tutorial, it doesn't really matter because you won't be using PHP anyway. Focus on the account creation and granting read access to the service account.
## Example #1
The following is a basic working example of the code that was showcased at the top of the page. It returns the top 10 pages of your website. 

```JavaScript
const { SimpleGA, Request, MetricFilter } = require("simple-ga");

(async function() {
	var analytics = new SimpleGA("./key.json");

	var request = (new Request())
		.view(12345678)
		.results(10)
		.dimension("pagePath")
		.metric("pageviews")
		.orderDesc("pageviews");

	request.metricFilter(pageviewsFilter);

	try {
		var data = await analytics.run(request);
		console.log(data);
	} catch (err) {
		console.error(err);
	}
})();
```
Please note that if you don't specify a date, only the last 7 days, excluding today, will be processed.

> If a date range is not provided, the default date range is (startDate: current date - 7 days, endDate: current date - 1 day).
> [Source](https://developers.google.com/analytics/devguides/reporting/core/v4/rest/v4/reports/batchGet#ReportRequest.FIELDS)