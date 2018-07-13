const cloneDeep = require("clone-deep");

var ObjectBuilder = function() {
	this.data = {}
}

ObjectBuilder.prototype.reset = function() {
	this.data = {};
	return this;
};

ObjectBuilder.prototype.set = function(key, value) {
	if (value == null) {
		return this.clear(key);
	}

	this.data[key] = value;
	return this;
}

ObjectBuilder.prototype.append = function(key, value) {
	if(!this.data[key]) {
		this.data[key] = [];
	}
	this.data[key].push(value);
	return this;
}

ObjectBuilder.prototype.getValues = function(values) {

	if(!values) {
		return [];
	}
	if(values.length === 0) {
		return [];
	}

	if(values.length === 1 && Array.isArray(values[0])) {
		values = values[0]
	};

	return values;
}

ObjectBuilder.prototype.appendMultiple = function(key, values) {
	var that = this;
	values.forEach(
		function(value) {
			that.append(key, value);
		}
	);
	return this;
}

ObjectBuilder.prototype.remove = function(key, param, value) {

	if (!this.data[key]) {
		return this;
	}

	this.data[key] = this.data[key].filter(function(entry) {
		return entry[param] !== value;
	});

	if (this.data.length == 0) {
		this.clear(key);
	}

	return this;
}

ObjectBuilder.prototype.removeMultiple = function(key, param, values) {
	values.forEach(function(value){
		this.remove(value)
	}.bind(this));

	return this;
}

ObjectBuilder.prototype.clear = function(key) {
	if(!key) {
		return this.reset();
	}
	delete this.data[key];
	return this;
}

ObjectBuilder.prototype.make = function() {
	return JSON.parse(JSON.stringify(this.data));
};

ObjectBuilder.prototype.clone = function(type, filter) {
	return cloneDeep(this);
};

module.exports = ObjectBuilder;