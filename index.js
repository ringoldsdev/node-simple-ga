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

	this.requests = [];
};

GAOOP.prototype.clearRequests = function() {
	this.requests = [];
	return this;
};

GAOOP.prototype.addRequest = function(request) {
	this.requests.push(cloneDeep(request));
	return this;
};

GAOOP.prototype.run = function(params) {
	var that = this;
	return new Promise(function(resolve, reject) {
		var requests = [];

		that.requests.forEach(function(request) {
			requests.push(request.make());
		});

		that.analytics.reports.batchGet(
			{
				auth: that.client,
				resource: {
					reportRequests: requests
				}
			},
			function(err, response) {
				if (err) {
					return reject(err);
				}

				var reports = [];

				response.data.reports.forEach(function(report) {
					var reportData = [];

					var currentPage = 1;

					var totalPages = params.pages ? params.pages : 1;

					while (currentPage <= totalPages) {
						report.data.rows.forEach(function(entry) {
							reportData.push({
								dimensions: Object.assign.apply(
									{},
									report.columnHeader.dimensions.map((v, i) => ({
										[v.substring(3)]: entry.dimensions[i]
									}))
								),
								metrics: Object.assign.apply(
									{},
									report.columnHeader.metricHeader.metricHeaderEntries.map(
										(v, i) => ({
											[v.name.substring(3)]: entry.metrics[0].values[i]
										})
									)
								)
							});
						});
					}

					reports.push(reportData);

					console.log(report.nextPageToken);
				});

				if (reports.length == 1) {
					return resolve(reports[0]);
				}

				if (params.mergeReports) {
					reports = [].concat.apply([], reports);
				}

				resolve(reports);
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
