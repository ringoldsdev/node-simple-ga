const Client = require("./src/Client");
const Request = require("./src/Request");
const DimensionFilter = require("./src/DimensionFilter");
const MetricFilter = require("./src/MetricFilter");
const ResultParser = require("./src/ResultParser");

const { google } = require("googleapis");
const cloneDeep = require("clone-deep");

const SimpleGoogleAnalytics = function(param) {
	this.client = null;

	if(typeof param === "string") {
		this.client = Client.createFromKeyFile(param);
	} else {
		if (param.key) {
			this.client = Client.createFromKey(param.key);
		}
		if (param.keyFile) {
			this.client = Client.createFromKeyFile(param.keyFile);
		}
	}


	if (!this.client) {
		throw Error("Google Analytics client wasn't created!");
	}

	this.analytics = google.analyticsreporting("v4");
};

SimpleGoogleAnalytics.prototype.runRaw = function(request, params = {}, currentPage = 1) {
	var that = this;
	return new Promise(function(resolve, reject) {
		var entries = [];
		var headers = null;

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

				if (currentPage == 1) {
					var metricColumnHeader = report.columnHeader.metricHeader.metricHeaderEntries.map(function(entry) {
						return entry.name;
					});

					headers = {
						dimensions: ResultParser.cleanKeys(report.columnHeader.dimensions),
						metrics: ResultParser.cleanKeys(metricColumnHeader)
					};
				}

				report.data.rows.forEach(function(entry) {
					entries.push({
						dimensions: entry.dimensions,
						metrics: entry.metrics[0].values
					});
				});

				// If page count is not specified, stop here
				if (!params.pages) {
					return resolve({ headers, entries });
				}

				// If we're at the last page, stop
				if (currentPage === params.pages) {
					return resolve({ headers, entries });
				}

				// If there are more pages, get the results
				if (report.nextPageToken) {
					request.setPageToken(report.nextPageToken);
					var requestedData = await that.runRaw(
						request,
						{
							pages: params.pages
						},
						currentPage + 1
					);
					entries = entries.concat(requestedData.entries);
				}

				return resolve({ headers, entries });
			}
		);
	});
};

SimpleGoogleAnalytics.prototype.run = async function(request, params = {}) {
	var result = await this.runRaw(request, params);

	if (params.rawResults) {
		return result;
	}

	var processedResult = [];

	result.entries.forEach(function(entry) {
		processedResult.push({
			dimensions: ResultParser.mergeKeyValueArrays(result.headers.dimensions, entry.dimensions),
			metrics: ResultParser.mergeKeyValueArrays(result.headers.metrics, entry.metrics)
		});
	});

	return processedResult;
};

module.exports = {
	SimpleGoogleAnalytics,
	Request,
	DimensionFilter,
	MetricFilter
};
