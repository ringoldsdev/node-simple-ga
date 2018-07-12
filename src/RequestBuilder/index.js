// https://developers.google.com/analytics/devguides/reporting/core/v4/rest/v4/reports/batchGet
// https://developers.google.com/analytics/devguides/reporting/core/dimsmets
const cloneDeep = require("clone-deep");

var RequestBuilder = function() {
	this.request = {};
};

RequestBuilder.prototype.reset = function() {
	this.request = {};
	return this;
};

RequestBuilder.prototype.view = function(view) {
	this.request.viewId = `ga:${view}`;
	return this;
};

RequestBuilder.prototype.hideTotals = function() {
	this.request.hideTotals = true;
	return this;
};

RequestBuilder.prototype.hideValueRanges = function() {
	this.request.hideValueRanges = true;
	return this;
};

RequestBuilder.prototype.pageSize = function(size) {
	if (size == null) {
		delete this.request.pageSize;
		return this;
	}
	this.request.pageSize = size;
	return this;
};

RequestBuilder.prototype.pageToken = function(token) {
	if (token == null) {
		delete this.request.pageToken;
		return this;
	}
	this.request.pageToken = token;
	return this;
};

RequestBuilder.prototype.make = function() {
	return JSON.parse(JSON.stringify(this.request));
};

RequestBuilder.prototype.fastSampling = function() {
	this.request.samplingLevel = "SMALL";
	return this;
};

RequestBuilder.prototype.preciseSampling = function() {
	this.request.samplingLevel = "LARGE";
	return this;
};

RequestBuilder.prototype.dateRange = function(params) {
	var dateRange = {};
	if (params.from) {
		dateRange.startDate = params.from;
	}
	if (params.to) {
		dateRange.endDate = params.to;
	}
	if (!this.request.dateRanges) {
		this.request.dateRanges = [];
	}
	this.request.dateRanges.push(dateRange);
	return this;
};

RequestBuilder.prototype.dimension = function(dimension, histogramBuckets) {
	var obj = { name: `ga:${dimension}` };
	if (histogramBuckets) {
		obj.histogramBuckets = histogramBuckets.forEach(function(bucket) {
			return bucket.toString();
		});
	}
	if (!this.request.dimensions) {
		this.request.dimensions = [];
	}
	this.request.dimensions.push(obj);
	return this;
};

RequestBuilder.prototype.dimensions = function(dimensions) {
	dimensions.forEach(
		function(obj) {
			this.dimension(obj);
		}.bind(this)
	);
	return this;
};

RequestBuilder.prototype.clearDimensions = function() {
	delete this.request.dimensions;
	return this;
};

RequestBuilder.prototype.metric = function(metric, type) {
	if (!this.request.metrics) {
		this.request.metrics = [];
	}
	this.request.metrics.push({
		expression: `ga:${metric}`,
		formattingType: type ? type : "INTEGER"
	});
	return this;
};

RequestBuilder.prototype.metrics = function(metrics) {
	metrics.forEach(
		function(obj) {
			this.metric(obj);
		}.bind(this)
	);
	return this;
};

RequestBuilder.prototype.removeDimension = function(name) {
	if (!this.request.dimensions) {
		return this;
	}

	this.request.dimensions = this.request.dimensions.filter(function(dimension) {
		return dimension.name !== `ga:${name}`;
	});

	if (this.request.dimensions.length == 0) {
		this.clearDimensions();
	}

	return this;
};

RequestBuilder.prototype.removeDimensions = function(dimensions) {
	dimensions.forEach(
		function(name) {
			this.removeDimension(name);
		}.bind(this)
	);
	return this;
};

RequestBuilder.prototype.metricInt = function(metric) {
	return this.metric(metric, "INTEGER");
};

RequestBuilder.prototype.metricFloat = function(metric) {
	return this.metric(metric, "FLOAT");
};

RequestBuilder.prototype.metricCurrency = function(metric) {
	return this.metric(metric, "CURRENCY");
};

RequestBuilder.prototype.metricPercent = function(metric) {
	return this.metric(metric, "PERCENT");
};

RequestBuilder.prototype.metricTime = function(metric) {
	return this.metric(metric, "TIME");
};

RequestBuilder.prototype.clearMetrics = function() {
	delete this.request.metrics;
	return this;
};

RequestBuilder.prototype.removeeMtric = function(name) {
	if (!this.request.metrics) {
		return this;
	}
	this.request.metrics = this.request.metrics.filter(function(metric) {
		return metric.expression !== `ga:${name}`;
	});
	if (this.request.metrics.length == 0) {
		this.clearMetrics();
	}
	return this;
};

RequestBuilder.prototype.removeMetrics = function(metrics) {
	metrics.forEach(
		function(name) {
			this.removeMetric(name);
		}.bind(this)
	);
	return this;
};

RequestBuilder.prototype.filtersExpression = function(expression) {
	if (expression == null) {
		delete this.request.filtersExpression;
		return this;
	}
	this.request.filtersExpression = expression;
	return this;
};

RequestBuilder.prototype.orderBy = function(params) {
	if (!this.request.orderBys) {
		this.request.orderBys = [];
	}
	this.request.orderBys.push({
		fieldName: `ga:${params.name}`,
		orderType: params.type ? params.type : "VALUE",
		sortOrder: params.order ? params.order : "DESCENDING"
	});
	return this;
};

RequestBuilder.prototype.orderAsc = function(name) {
	return this.orderBy({
		name: name,
		order: "ASCENDING"
	});
};

RequestBuilder.prototype.orderDesc = function(name) {
	return this.orderBy({
		name: name
	});
};

RequestBuilder.prototype.orderHistogram = function(name) {
	return this.orderBy({
		name: name,
		type: "HISTOGRAM_BUCKET"
	});
};

RequestBuilder.prototype.metricOrFilters = function(filters) {
	return this.filters("metricFilterClauses", filters, "OR");
};

RequestBuilder.prototype.metricFilters = function(filters, operator = "AND") {
	return this.filters("metricFilterClauses", filters);
};

RequestBuilder.prototype.metricFilter = function(filter) {
	return this.filter("metricFilterClauses", filter);
};

RequestBuilder.prototype.dimensionOrFilters = function(filters) {
	return this.filters("dimensionFilterClauses", filters, "OR");
};

RequestBuilder.prototype.dimensionFilters = function(filters, operator = "AND") {
	return this.filters("dimensionFilterClauses", filters);
};

RequestBuilder.prototype.dimensionFilter = function(filter) {
	return this.filter("dimensionFilterClauses", filter);
};

RequestBuilder.prototype.filters = function(type, filters, operator = "AND") {
	if (!this.request[type]) {
		this.request[type] = [];
	}

	this.request[type].push({
		operator,
		filters: filters.map(function(filter) {
			return filter.make();
		})
	});

	return this;
};

RequestBuilder.prototype.filter = function(type, filter) {
	this.filters(type, [filter]);
	return this;
};

RequestBuilder.prototype.clone = function(type, filter) {
	return cloneDeep(this);
};

module.exports = RequestBuilder;
