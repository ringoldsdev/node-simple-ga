require("dotenv").load();

const path = require("path");
const { SimpleGoogleAnalytics, Request } = require("../index.js");

(async function() {
	var analytics = new SimpleGoogleAnalytics(path.join(__dirname, "../key.json"));

	var request = (new Request())
		.view(process.env.GA_VIEW_ID)
		.results(10)
		.dimensions(["pagePath","pageTitle"])
		.metrics("pageviews","users")
		.orderDesc("pageviews");

	try {
		// Make the request and fetch data
		var data = await analytics.run(request);
		console.log(data);
	} catch (err) {
		console.error(err);
	}
})();
