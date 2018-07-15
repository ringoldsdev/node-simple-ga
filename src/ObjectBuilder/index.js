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

ObjectBuilder.prototype.get = function(key) {
	return this.data[key] ? this.data[key] : null;
}

ObjectBuilder.prototype.append = function(key, ...values) {
	if(!this.data[key]) {
		this.data[key] = [];
	}
	values = this.getValues(values);

	values.forEach(function(value){
		this.data[key].push(value);
	}.bind(this));

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

ObjectBuilder.prototype.remove = function(key, param, ...values) {

	if (!this.data[key]) {
		return this;
	}

	this.getValues(values).forEach(function(value){
		this.data[key] = this.data[key].filter(function(entry) {
			return entry[param] !== value;
		});
	}.bind(this));

	if (this.data.length == 0) {
		this.clear(key);
	}

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