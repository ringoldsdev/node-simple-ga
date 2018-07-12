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

const makeRequest = function(client, analytics, request) {
	return new Promise(function(resolve, reject) {
		analytics.reports.batchGet(
			{
				auth: client,
				resource: {
					reportRequests: [request.make()]
				}
			},
			function(err, response) {
				if (err) {
					return reject(err);
				}
				resolve(response);
			}
		);
	});
};

const makeKeyValueArray = function(keys, values) {
	return Object.assign.apply(
		{},
		keys.map((v, i) => ({
			[v]: values[i]
		}))
	);
};

GAOOP.prototype.run = function(request, params = {}) {
	var that = this;
	var currentPage = params.currentPage ? params.currentPage : 1;

	return new Promise(async function(resolve, reject) {

		var data = [];

		var response = await makeRequest(that.client, that.analytics, request);
		
		var report = response.data.reports[0];

		report.data.rows.forEach(function(entry) {

			var metricColumnNames = report.columnHeader.metricHeader.metricHeaderEntries.map(function(entry) {
				return entry.name.substring(3);
			});

			var dimensionColumnNames = report.columnHeader.dimensions.map(function(entry) {
				return entry.substring(3);
			});

			data.push({
				dimensions: makeKeyValueArray(dimensionColumnNames, entry.dimensions),
				metrics: makeKeyValueArray(metricColumnNames, entry.metrics[0].values)
			});

		});

		if (!params.pages) {
			return resolve(data);
		}

		if (currentPage === params.pages) {
			return resolve(data);
		}

		if (report.nextPageToken) {
			request.setPageToken(report.nextPageToken);
			data = data.concat(
				await that.run(request, {
					pages: params.pages,
					currentPage: currentPage + 1
				})
			);
		}

		resolve(data);
	});
};

module.exports = {
	GAOOP,
	RequestBuilder,
	DimensionFilterBuilder,
	MetricFilterBuilder
};
