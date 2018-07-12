# SimpleGA
A simple to use NodeJs package for the Google Analytics Reporting API

## Down to business
It should be much easier to retrieve data from the Google Analytics API and this package helps you achieve that. Forget about paginating and writing regular expressions to filter data. Focus on analyzing the data, let SimpleGA handle the rest.

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
## Installation
```JavaScript
//ToDo
```
## Usage
```JavaScript
//ToDo
```
## Examples
```JavaScript
//ToDo
```
