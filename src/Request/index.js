// https://developers.google.com/analytics/devguides/reporting/core/v4/rest/v4/reports/batchGet
// https://developers.google.com/analytics/devguides/reporting/core/dimsmets

var ObjectBuilder = require("../ObjectBuilder");
var ApiHelper = require("../ApiHelper");
var DimensionFilter = require("../DimensionFilter");
var MetricFilter = require("../MetricFilter");
var moment = require("moment");

var metricFilterList = [];
var dimensionFilterList = [];
var notFilter = false;

var Request = function() {};

Request.prototype = Object.create(new ObjectBuilder());

const makeDimensionObject = function(name) {
	return { name };
};

const makeHistogramObject = function(name, histogramBuckets = null) {
	var obj = makeDimensionObject(name);
	if (histogramBuckets) {
		obj.histogramBuckets = histogramBuckets;
	}
	return obj;
};

const makeMetricObject = function(name, type = "INTEGER") {
	return {
		expression: name,
		formattingType: type ? type : "INTEGER"
	};
};

const makeFiltersObject = function(filters, operator = "OR") {
	return {
		operator,
		filters: filters.map(function(filter) {
			return filter.make();
		})
	};
};

Request.prototype.from = function(viewId) {
	return this.view(viewId);
}

Request.prototype.view = function(viewId) {
	viewId = ApiHelper.generateApiName(viewId);
	return this.set("viewId", viewId);
};

Request.prototype.pageSize = function(size) {
	return this.set("pageSize", size);
};

Request.prototype.get = function(count) {
	return this.results(count);
}

Request.prototype.results = function(count) {
	return this.pageSize(count);
};

Request.prototype.everything = function() {
	return this.pageSize(null);
};

Request.prototype.pageToken = function(token) {
	return this.set("pageToken", token);
};

Request.prototype.removePageToken = function(token) {
	return this.pageToken(null);
};

Request.prototype.offset = function(value) {
	return this.pageToken(value);
};

Request.prototype.removeOffset = function(value) {
	return this.pageToken(null);
};

Request.prototype.sample = function(size) {
	return this.set("samplingLevel", size.toUpperCase());
};

Request.prototype.fast = function() {
	return this.sample("SMALL");
};

Request.prototype.precise = function() {
	return this.sample("LARGE");
};

// Date functions

Request.prototype.today = function() {
	var now = moment().format("YYYY-MM-DD");
	return this.set("dateRanges", [{
		startDate: now,
		endDate: now
	}]);
}

Request.prototype.yesterday = function() {
	var now = moment().format("YYYY-MM-DD").subtract(1,"day");
	return this.set("dateRanges", [{
		startDate: now,
		endDate: now
	}]);
}

Request.prototype.thisWeek = function() {
	var startDate = moment().startOf('isoWeek').format("YYYY-MM-DD");
	var endDate = moment().format("YYYY-MM-DD");
	return this.set("dateRanges", [{
		startDate,
		endDate
	}]);
}

Request.prototype.lastWeek = function() {
	var weekStart = moment().startOf('isoWeek');
	var startDate = moment(weekStart).subtract(7,"days").format("YYYY-MM-DD");
	var endDate = moment(weekStart).subtract(1,"day").format("YYYY-MM-DD");
	return this.set("dateRanges", [{
		startDate,
		endDate
	}]);
}

Request.prototype.period = function(from, to) {
	return this.set("dateRanges", [{
		startDate: from,
		endDate: to
	}]);
};

Request.prototype.during = function(from, to) {
	return this.period(from,to);
}

Request.prototype.periods = function(...params) {
	// clear previous dates
	this.set("dateRanges",[]);
	params.forEach(function(param){
		if(Array.isArray(param) && param.length == 2) {
			this.period(param[0],param[1]);
			return;
		}
		this.period(param);
	});
	return this;
};

Request.prototype.dimension = function(dimension) {
	dimension = ApiHelper.generateApiName(dimension);
	dimension = makeDimensionObject(dimension);
	return this.append("dimensions", dimension);
};

Request.prototype.histogram = function(dimension, histogramBuckets = null) {
	histogramBuckets = histogramBuckets.forEach(function(bucket) {
		return bucket.toString();
	});
	dimension = ApiHelper.generateApiName(dimension);
	dimension = makeHistogramObject(dimension, histogramBuckets);
	return this.set("dimensions", [dimension]);
};

Request.prototype.dimensions = function(...values) {
	values = this.getValues(values);
	values = values.map(ApiHelper.generateApiName);
	values = values.map(makeDimensionObject);
	return this.append("dimensions", values);
};

Request.prototype.fetch = function(...values) {
	values = this.getValues(values);

	values = ApiHelper.sortMetricsDimensions(values);

	if(values.metrics.length > 0) {
		this.metrics(values.metrics);
	}

	if(values.dimensions.length > 0) {
		this.dimensions(values.dimensions);
	}

	return this;
};

Request.prototype.select = function(...values) {
	return this.fetch(values);
}

Request.prototype.clearDimensions = function() {
	return this.clear("dimensions");
};

Request.prototype.removeDimension = function(name) {
	name = ApiHelper.generateApiName(name);
	return this.remove("dimensions", "name", name);
};

Request.prototype.removeDimensions = function(...values) {
	var that = this;
	values = this.getValues(values);
	values.forEach(function(value){
		that.removeDimension(value)
	})
	return this;
};

Request.prototype.unselect = function(...keys) {
	keys = this.getValues(keys);

	keys = ApiHelper.sortMetricsDimensions(keys);

	if(keys.metrics.length > 0) {
		this.removeMetrics(keys.metrics);
	}

	if(keys.dimensions.length > 0) {
		this.removeDimensions(keys.dimensions);
	}

	return this;	
}

Request.prototype.metric = function(name) {
	name = ApiHelper.generateApiName(name);
	return this.append("metrics", makeMetricObject(name));
};

Request.prototype.metricDesc = function(name) {
	return this.metric(name).orderDesc(name);
};

Request.prototype.metricAsc = function(name) {
	return this.metric(name).orderAsc(name);
};

Request.prototype.dimensionDesc = function(name) {
	return this.dimension(name).orderDesc(name);
};

Request.prototype.dimensionAsc = function(name) {
	return this.dimension(name).orderAsc(name);
};

Request.prototype.metrics = function(...values) {
	values = this.getValues(values);
	values = values.map(ApiHelper.generateApiName);
	values = values.map(makeMetricObject);
	return this.append("metrics", values);
};

Request.prototype.metricInt = function(name) {
	return this.metric(name, "INTEGER");
};

Request.prototype.nameFloat = function(name) {
	return this.metric(name, "FLOAT");
};

Request.prototype.nameCurrency = function(name) {
	return this.metric(name, "CURRENCY");
};

Request.prototype.namePercent = function(name) {
	return this.metric(name, "PERCENT");
};

Request.prototype.nameTime = function(name) {
	return this.metric(name, "TIME");
};

Request.prototype.clearMetrics = function() {
	return this.clear("metrics");
};

Request.prototype.removeMetric = function(name) {
	name = ApiHelper.generateApiName(name);
	return this.remove("metrics", "expression", name);
};

Request.prototype.removeMetrics = function(...values) {
	var that = this;
	values = this.getValues(values);
	values.forEach(function(value){
		that.removeMetric(value)
	})
	return this;
};

Request.prototype.filtersExpression = function(expression) {
	return this.set("filtersExpression", expression);
};

Request.prototype.orderBy = function(params) {
	return this.append("orderBys", {
		fieldName: ApiHelper.generateApiName(params.name),
		orderType: params.type ? params.type : "VALUE",
		sortOrder: params.order ? params.order : "DESCENDING"
	});
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

Request.prototype.orderHistogram = function(name) {
	return this.orderBy({
		name: name,
		type: "HISTOGRAM_BUCKET"
	});
};

Request.prototype.removeOrder = function(name) {
	name = ApiHelper.generateApiName(name);
	return this.remove("orderBys", "fieldName", name);
};

Request.prototype.removeOrders = function(...values) {
	values = this.getValues(values);
	values = values.map(ApiHelper.generateApiName);
	return this.remove("orderBys", "fieldName", values);
};

Request.prototype.filter = function(type, filter) {
	return this.filters(type, [filter]);
};

Request.prototype.filters = function(type, filters) {
	filters = makeFiltersObject(filters,"AND");
	return this.append(type, filters);
};

Request.prototype.orFilters = function(type, filters) {
	filters = makeFiltersObject(filters);
	return this.append(type, filters);
};


Request.prototype.metricFilter = function(filter) {
	return this.filter("metricFilterClauses", filter);
};

Request.prototype.metricFilters = function(filters) {
	return this.filters("metricFilterClauses", filters);
};

Request.prototype.metricOrFilters = function(filters) {
	return this.orFilters("metricFilterClauses", filters);
};

Request.prototype.dimensionFilter = function(filter) {
	return this.filter("dimensionFilterClauses", filter);
};

Request.prototype.dimensionFilters = function(filters) {
	return this.filters("dimensionFilterClauses", filters);
};

Request.prototype.dimensionOrFilters = function(filters) {
	return this.orFilters("dimensionFilterClauses", filters);
};

Request.prototype.clearDimensionFilters = function() {
	return this.clear("dimensionFilterClauses");
};

Request.prototype.clearMetricFilters = function() {
	return this.clear("metricFilterClauses");
};

Request.prototype.clearFilters = function() {
	this.clearDimensionFilters();
	this.clearMetricFilters();
	return this;
};

Request.prototype.where = function(...values) {
	values = this.getValues(values);
	values = ApiHelper.sortMetricsDimensions(values);
	metricFilterList = values.metrics;
	dimensionFilterList = values.dimensions;
	notFilter = false;
	return this;
}

Request.prototype.whereDimensions = function(...values) {
	values = this.getValues(values);
	dimensionFilterList = values;
	notFilter = false;
	return this;
}

Request.prototype.whereDimension = function(value) {
	dimensionFilterList = [value];
	notFilter = false;
	return this;
}

Request.prototype.whereMetrics = function(...values) {
	values = this.getValues(values);
	metricFilterList = values;
	notFilter = false;
	return this;
}

Request.prototype.whereMetric = function(value) {
	metricFilterList = [values];
	notFilter = false;
	return this;
}

Request.prototype.not = function() {
	notFilter = true;
	return this;
}

Request.prototype.filterConditions = function(values, dimensionCondition=null, metricCondition=null) {	

	if(dimensionCondition && dimensionFilterList.length > 0) {
		var dimensionValues = values;
		if(dimensionCondition === "IN_LIST") {
			dimensionValues = [dimensionValues];
		}
		var filters = [];
		dimensionFilterList.forEach(function(name){
			dimensionValues.forEach(function(value){
				var f = new DimensionFilter()
					.dimension(name)
					// All values must be converted to a string
					.condition(dimensionCondition, Array.isArray(value) ? value : [value.toString()])
				if(notFilter) {
					f.not();
				}
				filters.push(f);
			});
		});
		if(filters.length == 1) {
			this.dimensionFilter(filters[0]);
		} else {
			this.dimensionOrFilters(filters);
		}
		dimensionFilterList = [];
	}

	if(metricCondition && metricFilterList.length > 0) {
		var metricValues = values;
		var filters = [];
		metricFilterList.forEach(function(name){
			metricValues.forEach(function(value){
				var f = new MetricFilter()
					.metric(name)
					// All values must be converted to a string
					.condition(metricCondition,value.toString())
				if(notFilter) {
					f.not();
				}
				filters.push(f);
			});
		});
		if(filters.length == 1) {
			this.metricFilter(filters[0]);
		} else {
			this.metricOrFilters(filters);
		}
		metricFilterList = [];
	}

	return this;
}

Request.prototype.equals = function(...values) {
	return this.filterConditions(values, "EXACT", "EQUAL");
}

Request.prototype.is = function(...values) {
	return this.equals(values);
}

Request.prototype.matchesRegex = function(...values) {
	return this.filterConditions(values, "REGEXP");
}

Request.prototype.beginsWith = function(...values) {
	return this.filterConditions(values, "BEGINS_WITH");
}

Request.prototype.endsWith = function(...values) {
	return this.filterConditions(values, "ENDS_WITH");
}

Request.prototype.contains = function(...values) {
	return this.filterConditions(values, "PARTIAL");
}

Request.prototype.greaterThan = function(...values) {
	return this.filterConditions(values, "NUMERIC_GREATER_THAN", "GREATER_THAN");
}

Request.prototype.lessThan = function(...values) {
	return this.filterConditions(values, "NUMERIC_LESS_THAN", "LESS_THAN");
}

Request.prototype.inList = function(...values) {
	return this.filterConditions(values, "IN_LIST");
}

module.exports = function() {
	return new Request().clone();
}