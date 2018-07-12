require("dotenv").load();

const path = require("path");
const { SimpleGA, Request, MetricFilter } = require("../index.js");

(async function() {
	var analytics = new SimpleGA(path.join(__dirname, "../key.json"));

	var request = (new Request())
		.view(process.env.GA_VIEW_ID)
		.pageSize(10)
		.dimension("pagePath")
		.metric("pageviews")
		.orderDesc("pageviews");

	var pageviewsFilter = (new MetricFilter())
		.metric("pageviews")
		.lessThanEqualTo(1000)
		.inverse();

	request.metricFilter(pageviewsFilter);

	try {
		// Make the request and fetch data
		var data = await analytics.run(request);
		console.log(data);
	} catch (err) {
		console.error(err);
	}
})();
