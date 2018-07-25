require("dotenv").load();

const path = require("path");
const { SimpleGA, Request, MetricFilter } = require("../index.js");

(async function() {
	var analytics = new SimpleGA(path.join(__dirname, "../key.json"));

	var request = new Request()
		.from(process.env.GA_VIEW_ID)
		.fetch("pagepath","pagetitle","pageviews")
		.where("pagepath").not().equals("/")
		.orderDesc("pageviews")
		.results(100)

	try {
		var data = await analytics.run(request);
		console.log(data);
	} catch (err) {
		console.error(err);
	}
})();
