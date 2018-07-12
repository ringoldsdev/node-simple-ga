require("dotenv").load();

const path = require("path");
const { GAOOP, RequestBuilder, MetricFilterBuilder, DimensionFilterBuilder } = require("../index.js");

(async function() {
	var GoogleAnalytics = new GAOOP({
		keyFile: path.join(__dirname, "../key.json")
	});

	// Create the request object
	var request = new RequestBuilder();
	request
		.setView(process.env.GA_VIEW_ID)
		.setPageSize(25)
		.addDate({ from: "7daysago", to: "today" })
		.addDimension("pagePath")
		.addDimension("pageTitle")
		.addMetrics(["pageviews", "uniquePageviews", "users"])
		.orderDesc("uniquePageviews")
		.orderDesc("users");

	// Dimension filters
	var pagePathFilter = new DimensionFilterBuilder();
	pagePathFilter.dimension("pagePath").beginsWith("/zinas/");

	request.addDimensionFilter(pagePathFilter);

	// Metric filters
	// var pageviewsFilter = new MetricFilterBuilder();
	// pageviewsFilter.metric("pageviews").lessThan(11);

	// var usersFilter = new MetricFilterBuilder();
	// usersFilter.metric("users").lessThan(4);

	// request.addMetricFilters([pageviewsFilter, usersFilter]);

	try {
		// Make the request and fetch data
		var data = await GoogleAnalytics.run(request);
		console.log(data);
		// ToDo - Pagination
	} catch (err) {
		console.error(err);
	}
})();
