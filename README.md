# Simple Google Analytics client for NodeJs

It should be much easier to retrieve data from the Google Analytics API and this package helps you achieve that. Focus on analyzing the data let it handle the rest.

This is still very much work in progress so please check back.

**Note:** Recent v0.3.0 update removed the need to manually create filter objects. Please see the demo.

## Down to business


Getting the top 10 links is as simple as this:

```JavaScript
var analytics = new SimpleGA("./key.json");

var request = (new Request())
	.from(12345678)
	.fetch("pagepath","pageviews")
	.orderDesc("pageviews")
	.results(10);
	
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

## What it really is
**node-simple-ga** helps you create and make [Reporting API v4 compliant](https://developers.google.com/analytics/devguides/reporting/core/v4/rest/v4/reports/batchGet) JSON requests in a function-oriented manner, parse the response, and paginate additional requests if requested by the user. Further improvements will be focused on creating requests in a more robust and efficient way.
## What it won't be
This package is not and will not be a data processing package. Data processing is left up to you - the developer.
## Installation
To use the package, run:
```JavaScript
npm i node-simple-ga
```
Before using the package, you must create and set up a [Service Account](https://developers.google.com/identity/protocols/OAuth2ServiceAccount). You can also watch a video tutorial on [how to set up a Service account](https://www.youtube.com/watch?v=r6cWB0xnOwE). While the title says it's a PHP tutorial, it doesn't really matter because you won't be using PHP anyway. Focus on the account creation and granting read access to the service account.
## Usage
Typical usage for the script follows the following script:
1) Require node-simple-ga
2) Initialize the analytics package by providing a valid service account key (see Installation)
3) Create a request object
4) Add metrics and dimensions
6) Add filters
7) Specify the sort order
8) Run the request

Optionally:
1) Clone the request object
2) Make changes to the request object
3) Run the request

## Example
* Return all pages of two views XXXXXXXX and YYYYYYYY who don't have at least 100 pageviews,
* Show page urls, pageviews and users,
* Make sure page url doesn't contain /archive/,
* Load only those entries that came from the US,
* Sort results by the amount of users in a descending order
* Get only the top 100 results from XXXXXXXX
* For view YYYYYYYY also get the amount of sessions

```JavaScript
const {
	SimpleGA,
	Request
} = require("node-simple-ga");

(async function() {
	var analytics = new SimpleGA("./key.json");

	var request1 = new Request()
		.select("pagepath","pageviews","users")
		.from(XXXXXXXX)
		.where("pagepath").not().contains("/archive/")
		.where("country").is("US")
		.where("pageviews").lessThan(101)
		.results(100)
		.orderDesc("users");

	var request2 = request1.clone()
		.select("sessions")
		.from(YYYYYYYY)
		.everything();

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
Since it's not possible to use negative lookups in Google Analytics (e.g. urls that don't contain something), you must first look up all urls with the thing you want to avoid and then negate the operation (in this case with .not())

Please note that if you don't specify a date, only the last 7 days, excluding today, will be processed.

> If a date range is not provided, the default date range is (startDate: current date - 7 days, endDate: current date - 1 day).
> [Source](https://developers.google.com/analytics/devguides/reporting/core/v4/rest/v4/reports/batchGet#ReportRequest.FIELDS)

## Reference
When specifying a dimension or a metric, you don't have to add ga: at the beginning and you may enter it in a case insensitive manner; the system will fix it for you i.e. pagepath becomes ga:pagePath when querying Google Analytics.

Before processing data, you should know the difference between dimensions and metrics. [Read more about it here.](https://support.google.com/analytics/answer/1033861?hl=en)

### Request functions

**select(** *keys* **)**, **fetch(** *keys* **)**

Specify in a case-insensitive manner which dimensions and metrics you're going to need.  You can pass both, an array or a list of metrics. It's useful if you generate metrics dynamically. However, if you pass a custom key, such as a computed metric, it's up to you to ensure it's written correctly.

```Javascript
select("pagepath","sessions","users")
```
is the same as 
```Javascript
select(["pageviews","sessions","users"])
```

**from(** *view* **)**

Used to set the View you're going to process

**where(** *keys* **)**

Which key or keys  will be filtered. You can specify multiple keys so that the following filter will be applied to all keys. Note that if you specify multiple keys at the same time, an **OR** operation will be applied, meaning one of the filters must be true. 

where() is followed by either not() and/or one of the operator functions. All operator functions accept multiple values they are applied to all selected keys. For example, if you have specified 2 keys and 2 values in the operator, you'll end up having an OR filter with 4 conditions.

The only exception of the operator functions is the inList() function. All values that are passed in will be passed as an array of strings, since the goal of this function is to determine whether dimension value is in the list. It means that if you specify 2 keys and 3 values in the inList() operator, you'll end up with 2 inList() filters.

All operator functions are found in the section called **Operator functions**.

**orderDesc(** *name* **)**

Which metric or dimension will be sorted in a descending order.

**orderAsc(** *name* **)**

Which metric or dimension will be sorted in an ascending order.

**during(** *dateFrom, dateTo* **)**, **period(** *dateFrom, dateTo* **)**

What time frame should results be selected from.

*dateFrom and dateTo must be written in the YYYY-MM-DD format, meaning April 24, 2016 must be written as 2018-04-24.*

**results(** *count* **)**

How many results per page should be returned. If you don't specify the amount of results, everything will be returned.

**everything()**

Returns all results. Use on a cloned request that has an amount of results specified.

**clearFilters()**

Removes all filters.

**unselect(** *keys* **)**

Which keys will be removed from the selection.

**clone()**

Returns an identical copy of the request object.

## Operator functions

**not()**

Negates current filter
```Javascript
where("pagetitle","dimension10").not()...
```

**is(** *values* **)**, **equals(** *values* **)**

What must the key value be equal to.

**contains(** *values* **)**

What must the dimension value contain.

**beginsWith(** *values* **)**

What must the dimension value begin with.

**endsWith(** *values* **)**

What must the dimension value end with.

**inList(** *values* **)**

What must the dimension be equal to.
```Javascript
where("pagetitle","dimension10").inList("apple","orange")
```
*It means that pageTitle or dimension10 must be equal to either apple or orange.*

**greaterThan(** *values* **)**

What must the key value be greater than.

**lessThan(** *values* **)**

What must the key value be less than.

**matchesRegex(** *expressions* **)**

What regular expression must the dimension value be less than.

*Please note that Google Analytics allows the use of a limited amount of regular expressions. For example, it doesn't allow negative lookaheads, which is why the not() function must be used.*

## Pagination
Google Analytics API returns up to 10'000 results per request, which means there will be cases when you'll have to make additional requests to get more data. However, this also means you might not need all the data and it can be achieved in two ways: filtering or limiting the amount of pages.

To limit the amount of pages, for example 2 pages (up to 20'000 results, if the result count is not specified), the script will look something like this:

```Javascript
var analytics = new SimpleGA("keyLocation");

// Build the request object
var request = new Request()
	...

var data = await analytics.run(request,{pages: 2});
```

Please note that while it is possible to specify the amount of results and the amount of pages, it is not advised to do so, because you might end up hitting the API limits. For example, if you have specified that you need 10 results and that you need 3 pages, you will end up making 3 requests requesting 10 results per request, which means you will get only 30 results. It's not only significantly slower but it's also wasteful.

It's better to use either results() or specifying the amount of pages. 

## Author
Ringolds Leščinskis

Website: [www.lescinskis.com](https://www.lescinskis.com)

E-mail: ringolds@lescinskis.com