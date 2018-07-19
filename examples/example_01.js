require("dotenv").load();

const path = require("path");
const { SimpleGA, Request, MetricFilter } = require("../index.js");

(async function() {
	var analytics = new SimpleGA(path.join(__dirname, "../key.json"));

	var request = new Request()
		.view(process.env.GA_VIEW_ID)
		.results(10)
		.dimensions("pagePath", "pageTitle")
		.metricDesc("pageviews")

	var filter = new MetricFilter().metric("pageviews").lessThan(2500);

	request.metricFilter(filter);

	request.clearMetricFilters();

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
