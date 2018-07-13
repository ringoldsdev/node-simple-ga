// https://developers.google.com/analytics/devguides/reporting/core/v4/rest/v4/reports/batchGet
// https://developers.google.com/analytics/devguides/reporting/core/dimsmets
const cloneDeep = require("clone-deep");

var Request = function() {
	this.request = {};
};

Request.prototype.reset = function() {
	this.request = {};
	return this;
};

Request.prototype.view = function(view) {
	this.request.viewId = `ga:${view}`;
	return this;
};

Request.prototype.hideTotals = function() {
	this.request.hideTotals = true;
	return this;
};

Request.prototype.hideValueRanges = function() {
	this.request.hideValueRanges = true;
	return this;
};

Request.prototype.pageSize = function(size) {
	if (size == null) {
		delete this.request.pageSize;
		return this;
	}
	this.request.pageSize = size;
	return this;
};

Request.prototype.results = function(count) {
	return this.pageSize(count);
}

Request.prototype.pageToken = function(token) {
	if (token == null) {
		delete this.request.pageToken;
		return this;
	}
	this.request.pageToken = token;
	return this;
};

Request.prototype.make = function() {
	return JSON.parse(JSON.stringify(this.request));
};

Request.prototype.fast = function() {
	this.request.samplingLevel = "SMALL";
	return this;
};

Request.prototype.precise = function() {
	this.request.samplingLevel = "LARGE";
	return this;
};

Request.prototype.dateRange = function(params) {
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

Request.prototype.dimension = function(dimension, histogramBuckets) {
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

Request.prototype.dimensions = function(...dimensions) {
	if(dimensions.length === 1 && Array.isArray(dimensions[0])) {
		dimensions = dimensions[0]
	}
	dimensions.forEach(
		function(obj) {
			this.dimension(obj);
		}.bind(this)
	);
	return this;
};

Request.prototype.clearDimensions = function() {
	delete this.request.dimensions;
	return this;
};

Request.prototype.metric = function(metric, type) {
	if (!this.request.metrics) {
		this.request.metrics = [];
	}
	this.request.metrics.push({
		expression: `ga:${metric}`,
		formattingType: type ? type : "INTEGER"
	});
	return this;
};

Request.prototype.metrics = function(...metrics) {
	if(metrics.length === 1 && Array.isArray(metrics[0])) {
		metrics = metrics[0]
	}
	metrics.forEach(
		function(obj) {
			this.metric(obj);
		}.bind(this)
	);
	return this;
};

Request.prototype.removeDimension = function(name) {
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

Request.prototype.removeDimensions = function(...dimensions) {
	if(dimensions.length === 1 && Array.isArray(dimensions[0])) {
		dimensions = dimensions[0]
	}
	dimensions.forEach(
		function(name) {
			this.removeDimension(name);
		}.bind(this)
	);
	return this;
};

Request.prototype.metricInt = function(metric) {
	return this.metric(metric, "INTEGER");
};

Request.prototype.metricFloat = function(metric) {
	return this.metric(metric, "FLOAT");
};

Request.prototype.metricCurrency = function(metric) {
	return this.metric(metric, "CURRENCY");
};

Request.prototype.metricPercent = function(metric) {
	return this.metric(metric, "PERCENT");
};

Request.prototype.metricTime = function(metric) {
	return this.metric(metric, "TIME");
};

Request.prototype.clearMetrics = function() {
	delete this.request.metrics;
	return this;
};

Request.prototype.removeMtric = function(name) {
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

Request.prototype.removeMetrics = function(metrics) {
	if(metrics.length === 1 && Array.isArray(metrics[0])) {
		metrics = metrics[0]
	}
	metrics.forEach(
		function(name) {
			this.removeMetric(name);
		}.bind(this)
	);
	return this;
};

Request.prototype.filtersExpression = function(expression) {
	if (expression == null) {
		delete this.request.filtersExpression;
		return this;
	}
	this.request.filtersExpression = expression;
	return this;
};

Request.prototype.orderBy = function(params) {
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

Request.prototype.orderAsc = function(name) {
	return this.orderBy({
		name: name,
		order: "ASCENDING"
	});
};

Request.prototype.orderDesc = function(name) {
	return this.orderBy({
		name: name
	});
};

Request.prototype.removeOrder = function(name) {
	this.request.orderBys = this.request.orderBys.filter(function(entry){
		return entry.fieldName !== `ga:${name}`;
	});

	return this;
};

Request.prototype.orderHistogram = function(name) {
	return this.orderBy({
		name: name,
		type: "HISTOGRAM_BUCKET"
	});
};

Request.prototype.metricOrFilters = function(filters) {
	return this.filters("metricFilterClauses", filters, "OR");
};

Request.prototype.metricFilters = function(filters, operator = "AND") {
	return this.filters("metricFilterClauses", filters);
};

Request.prototype.metricFilter = function(filter) {
	return this.filter("metricFilterClauses", filter);
};

Request.prototype.dimensionOrFilters = function(filters) {
	return this.filters("dimensionFilterClauses", filters, "OR");
};

Request.prototype.dimensionFilters = function(filters, operator = "AND") {
	return this.filters("dimensionFilterClauses", filters);
};

Request.prototype.dimensionFilter = function(filter) {
	return this.filter("dimensionFilterClauses", filter);
};

Request.prototype.filters = function(type, filters, operator = "AND") {
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

Request.prototype.filter = function(type, filter) {
	this.filters(type, [filter]);
	return this;
};

Request.prototype.clone = function(type, filter) {
	return cloneDeep(this);
};

module.exports = Request;
