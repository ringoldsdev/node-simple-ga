require("dotenv").load();

const path = require("path");
const { SimpleGA, Request } = require("../index.js");

(async function() {
	var analytics = new SimpleGA(path.join(__dirname, "../key.json"));

	var request1 = Request()
		.select("dimension12", "pageviews", "users")
		.from(process.env.GA_VIEW_ID)
		.during("2018-09-20", "2018-09-25")
		.orderDesc("pageviews")
		.limit(20);

	var request2 = Request()
		.select("dimension12", "entrances")
		.from(process.env.GA_VIEW_ID)
		.during("2018-09-20", "2018-09-25")
		.orderDesc("entrances")
		.limit(20);

	try {
		var r1 = analytics.run(request1, {
			rename: {
				dimension12: "title"
			}
		});
		var r2 = analytics.run(request2, {
			rename: {
				dimension12: "title"
			}
		});

		var [res1, res2] = await Promise.all([r1, r2]);

		console.log({ res1, res2 });
	} catch (err) {
		console.error(err);
	}
})();
