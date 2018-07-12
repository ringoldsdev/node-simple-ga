
# SimpleGA
A simple to use NodeJs package for the Google Analytics Reporting API.
This is still very much work in progress so please check back.

## Down to business
It should be much easier to retrieve data from the Google Analytics API and this package helps you achieve that. Focus on analyzing the data and let SimpleGA handle the rest.

Getting the top 10 links is as easy as this:

```JavaScript
const analytics = new SimpleGoogleAnalytics("./key.json");

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
npm i simple-google-analytics
```
Before using the package, you must create and set up a [Service Account](https://developers.google.com/identity/protocols/OAuth2ServiceAccount). You can also watch a video tutorial on [how to set up a Service account](https://www.youtube.com/watch?v=r6cWB0xnOwE). While the title says it's a PHP tutorial, it doesn't really matter because you won't be using PHP anyway. Focus on the account creation and granting read access to the service account.
## Usage
Typical usage for the script follows the following script:
1) Require simple-google-analytics
2) Initialize the analytics package by providing a valid service account key (see Installation)
3) Create a request object
4) Add criteria to the request object
5) Create dimension and metric filters
6) Append filters to the request
7) Run the request
8) Process data

Optionally:
1) Clone the request object
2) Make changes to the request object
3) Run the request

## Example #1
**Task**
* Return all pages of two views XXXXXXXX and YYYYYYYY who don't have at least 100 pageviews,
* Show page urls, pageviews and metrics,
* Make sure page url doesn't contain /archive/,
* Load only those entries that came from the US,
* Sort results by the amount of users in a descending order

```JavaScript
const {
	SimpleGoogleAnalytics,
	Request,
	MetricFilter,
	DimensionFilter
} = require("simple-google-analytics");

(async function() {
	var analytics = new SimpleGoogleAnalytics("./key.json");

	var request1 = (new Request())
		.view(XXXXXXXX)
		.results(10)
		.dimension("pagePath")
		.metrics(["pageviews","users"])
		.orderDesc("users");

	var pagePathFilter = (new DimensionFilter())
		.dimension("pagePath")
		.contains("/archive/")
		.not();
	
	var countryFilter = (new DimensionFilter())
		.dimension("country")
		.matches("US");

	request.dimensionFilters([pagePathFilter,countryFilter]);

	var pageviewsFilter = (new MetricFilter())
		.metric("pageviews")
		.lessThanEqualTo(100);

	request.metricFilter(pageviewsFilter);

	var request2 = request1.clone().view(YYYYYYYY);

	try {
		var {data1, data2} = await Promise.all([
			analytics.run(request1),
			analytics.run(request2)
		]);
	} catch (err) {
		console.error(err);
	}
})();
```
Since it's not possible to use negative lookups in Google Analytics (e.g. urls that don't contain something), you must first look up all urls with the thing you want to avoid and then negate the operation (in this case with .not(), but it's also possible with .inverse())

Please note that if you don't specify a date, only the last 7 days, excluding today, will be processed.

> If a date range is not provided, the default date range is (startDate: current date - 7 days, endDate: current date - 1 day).
> [Source](https://developers.google.com/analytics/devguides/reporting/core/v4/rest/v4/reports/batchGet#ReportRequest.FIELDS)

## Reference