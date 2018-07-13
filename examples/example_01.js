require("dotenv").load();

const path = require("path");
const { SimpleGoogleAnalytics, Request } = require("../index.js");

(async function() {
	var analytics = new SimpleGoogleAnalytics(path.join(__dirname, "../key.json"));

	var request = (new Request())
		.view(process.env.GA_VIEW_ID)
		.results(10)
		.dimensions("pagePath","pageTitle")
		.metric("pageviews")
		.metric("users")
		.orderDesc("pageviews")
		.orderAsc("users")
		.removeOrder("users");

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
