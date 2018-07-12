require("dotenv").load();

const path = require("path");
const { SimpleGA, Request } = require("../index.js");

(async function() {
	var analytics = new SimpleGA(path.join(__dirname, "../key.json"));

	var request = (new Request())
		.view(process.env.GA_VIEW_ID)
		.results(10)
		.dimension("pagePath")
		.metric("pageviews")
		.orderDesc("pageviews");

	try {
		// Make the request and fetch data
		var data = await analytics.run(request);
		console.log(data);
	} catch (err) {
		console.error(err);
	}
})();
