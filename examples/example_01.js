require("dotenv").load();

var moment = require('moment');

const path = require("path");
const { SimpleGA, Request } = require("../index.js");

(async function() {
	var analytics = new SimpleGA(path.join(__dirname, "../key.json"));

	var startOf = moment().startOf('day').unix();

	var request = new Request()
		.select("pagepath","pagetitle","pageviews","sessions","users")
		.dimension("dimension17")
		.from(process.env.GA_VIEW_ID)
		.where("pagepath").not().equals("/")
		.whereDimension("dimension17").greaterThan(startOf)
		.during("2018-07-23","2018-07-25")
		.orderDesc("pageviews")
		.unselect("pagepath","sessions","users")
		.results(20)

	try {
		var data = await analytics.run(request);
		console.log(data);
	} catch (err) {
		console.error(err);
	}
})();
