require("dotenv").load();

const path = require("path");
const { SimpleGoogleAnalytics, Request, DimensionFilter } = require("../index.js");

(async function() {
	var analytics = new SimpleGoogleAnalytics(path.join(__dirname, "../key.json"));

	var request = (new Request())
		.view(process.env.GA_VIEW_ID)
		.pageSize(10)
		.dimension("pagePath")
		.metric("pageviews")
		.orderDesc("pageviews");

	
	var pagePathFilter = (new DimensionFilter())
		.dimension("pagePath")
		.contains("/posts/")
		.not();

	request.dimensionFilter(pagePathFilter);

	try {
		// Make the request and fetch data
		var data = await analytics.run(request);
		console.log(data);
	} catch (err) {
		console.error(err);
	}
})();
