require("dotenv").load();

const path = require("path");
const { SimpleGoogleAnalytics, Request, MetricFilter } = require("../index.js");

(async function() {
	var analytics = new SimpleGoogleAnalytics(path.join(__dirname, "../key.json"));

	var request = (new Request())
		.view(process.env.GA_VIEW_ID)
		.results(10)
		.dimensions("pagePath","pageTitle")
		.metrics("pageviews", "users")
		.removeMetric("users")
		.removeDimension("pageTitle")
		// .metric("users")
		.orderDesc("pageviews")
		.orderAsc("users")
		.removeOrder("users");

	var filter = (new MetricFilter())
		.metric("pageviews")
		.lessThan(2500);

	request.metricFilter(filter);
	
	try {
		// Make the request and fetch data
		// console.log(request.make());
		// var data = await analytics.runRaw(request);
		var data = await analytics.run(request);
		console.log(data);
	} catch (err) {
		console.error(err);
	}
})();
