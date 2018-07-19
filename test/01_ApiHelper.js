const should = require("chai").should();

const ApiHelper = require("../src/ApiHelper");

function randomString() {
	return Math.random()
		.toString(36)
		.substr(2, 5);
}

describe("ApiHelper", function() {
	var str = randomString();
	it("should prepend '" + str + "' with ga:", function(done) {
		ApiHelper.generateApiName(str).should.equal("ga:" + str);
		done();
	});
});
