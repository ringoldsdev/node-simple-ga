require("dotenv").load();

const path = require("path");
const { SimpleGA, Request } = require("../index.js");

(async function() {
	var analytics = new SimpleGA(path.join(__dirname, "../key.json"));

	var request = Request()
		.select("pagepath","pageviews","sessions","users")
		.from(process.env.GA_VIEW_ID)
		.during("2018-07-20","2018-07-25")
		.orderDesc("pageviews");

	try {
		console.log(request.make());
		var data = await analytics.run(request);
		// console.log(data);
	} catch (err) {
		console.error(err);
	}
})();
