function appendPrefix(key) {
	return `ga:${key}`;
}

function initProcessMetric(metrics) {
	return appendPrefix;
}

function initProcessDimension(dimensions) {
	return appendPrefix
}

module.exports = {
	processMetric: initProcessMetric(),
	processDimension: initProcessDimension()
}