require("dotenv").load();

const path = require("path");
const { GAOOP, RequestBuilder, MetricFilterBuilder, DimensionFilterBuilder } = require("../index.js");

(async function() {
	var GoogleAnalytics = new GAOOP({
		keyFile: path.join(__dirname, "../key.json")
	});

	var request = new RequestBuilder();

	request
		.view(process.env.GA_VIEW_ID)
		.pageSize(10)
		.dimension("pagePath")
		.metric("pageviews")
		.orderDesc("pageviews");

	try {
		// Make the request and fetch data
		var data = await GoogleAnalytics.run(request);
		console.log(data);
		// ToDo  Pagination
	} catch (err) {
		console.error(err);
	}
})();