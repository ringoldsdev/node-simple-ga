const objectPath = require("object-path-immutable");

objectPath.ensureExists = function (obj, path, value){
	if(this.get(obj, path) === undefined) {
		return this.set(obj, path, value);
	}
	return obj;
};

module.exports = objectPath;