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

const makeKeyValueArray = function(keys, values) {
	return Object.assign.apply(
		{},
		keys.map((v, i) => ({
			[v]: values[i]
		}))
	);
};

GAOOP.prototype.runRaw = function(request, params = {}, currentPage = 1) {
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

				if(currentPage == 1) {
					headers = {
						dimensions: report.columnHeader.dimensions.map(function(entry) {
							return entry.substring(3);
						}),
						metrics: report.columnHeader.metricHeader.metricHeaderEntries.map(function(entry) {
							return entry.name.substring(3);
						})
					}
				}

				report.data.rows.forEach(function(entry) {
					entries.push({
						dimensions: entry.dimensions,
						metrics: entry.metrics[0].values
					});
				});

				// If page count is not specified, stop here
				if (!params.pages) {
					return resolve({headers, entries});
				}

				// If we're at the last page, stop
				if (currentPage === params.pages) {
					return resolve({headers, entries});
				}

				// If there are more pages, get the results
				if (report.nextPageToken) {
					request.setPageToken(report.nextPageToken);
					var requestedData = await that.runRaw(request, {
						pages: params.pages
					}, currentPage + 1);
					entries = entries.concat(requestedData.entries);
				}

				return resolve({headers, entries});
			}
		);
	});
};


GAOOP.prototype.run = async function(request, params = {}) {
	
	var result = await this.runRaw(request, params);

	if(params.rawResults) {
		return result;
	}

	var processedResult = [];

	result.entries.forEach(function(entry) {
		processedResult.push({
			dimensions: makeKeyValueArray(result.headers.dimensions, entry.dimensions),
			metrics: makeKeyValueArray(result.headers.dimensions, entry.metrics)				
		});
	});

	return processedResult;

};

// GAOOP.prototype.run = function(request, params = {}) {
// 	var that = this;
// 	var currentPage = params.currentPage ? params.currentPage : 1;

// 	return new Promise(async function(resolve, reject) {

// 		var data = [];

// 		var response = await makeRequest(that.client, that.analytics, request);
		
// 		var report = response.data.reports[0];

// 		report.data.rows.forEach(function(entry) {

// 			var metricColumnNames = report.columnHeader.metricHeader.metricHeaderEntries.map(function(entry) {
// 				return entry.name.substring(3);
// 			});

// 			var dimensionColumnNames = report.columnHeader.dimensions.map(function(entry) {
// 				return entry.substring(3);
// 			});

// 			data.push({
// 				dimensions: makeKeyValueArray(dimensionColumnNames, entry.dimensions),
// 				metrics: makeKeyValueArray(metricColumnNames, entry.metrics[0].values)
// 			});

// 		});

// 		if (!params.pages) {
// 			return resolve(data);
// 		}

// 		if (currentPage === params.pages) {
// 			return resolve(data);
// 		}

// 		if (report.nextPageToken) {
// 			request.setPageToken(report.nextPageToken);
// 			data = data.concat(
// 				await that.run(request, {
// 					pages: params.pages,
// 					currentPage: currentPage + 1
// 				})
// 			);
// 		}

// 		resolve(data);
// 	});
// };

module.exports = {
	GAOOP,
	RequestBuilder,
	DimensionFilterBuilder,
	MetricFilterBuilder
};
