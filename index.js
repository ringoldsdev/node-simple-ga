const ClientFactory = require("./src/ClientFactory");
const RequestBuilder = require("./src/RequestBuilder");
const DimensionFilterBuilder = require("./src/DimensionFilterBuilder");
const MetricFilterBuilder = require("./src/MetricFilterBuilder");

const { google } = require("googleapis");
const cloneDeep = require("clone-deep");

const GAOOP = function(params) {
	this.client = null;

	if (params.key) {
		this.client = ClientFactory.createFromKey(params.key);
	}
	if (params.keyFile) {
		this.client = ClientFactory.createFromKeyFile(params.keyFile);
	}

	if (!this.client) {
		throw Error("Google Analytics client wasn't created!");
	}

	this.analytics = google.analyticsreporting("v4");
};

GAOOP.prototype.run = function(request, params = {}) {
	var that = this;
	var currentPage = params.currentPage ? params.currentPage : 1;
	return new Promise(function(resolve, reject) {
		var results = [];

		that.analytics.reports.batchGet(
			{
				auth: that.client,
				resource: {
					reportRequests: [request.make()]
				}
			},
			async function(err, response) {
				if (err) {
					return reject(err);
				}

				var report = response.data.reports[0];

				report.data.rows.forEach(function(entry) {
					results.push({
						dimensions: Object.assign.apply(
							{},
							report.columnHeader.dimensions.map((v, i) => ({
								[v.substring(3)]: entry.dimensions[i]
							}))
						),
						metrics: Object.assign.apply(
							{},
							report.columnHeader.metricHeader.metricHeaderEntries.map((v, i) => ({
								[v.name.substring(3)]: entry.metrics[0].values[i]
							}))
						)
					});
				});

				if (!params.pages) {
					return resolve(results);
				}

				if (currentPage === params.pages) {
					return resolve(results);
				}

				if (report.nextPageToken) {
					request.setPageToken(report.nextPageToken);
					results = results.concat(
						await that.run(request, {
							pages: params.pages,
							currentPage: currentPage + 1
						})
					);
				}

				resolve(results);
			}
		);
	});
};

module.exports = {
	GAOOP,
	RequestBuilder,
	DimensionFilterBuilder,
	MetricFilterBuilder
};
