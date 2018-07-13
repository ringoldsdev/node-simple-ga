const should = require('chai').should();

const ApiHelper = require("../src/ApiHelper");

describe("ApiHelper", function(){
	it("should prepend passed value with ga:", function(done){
		ApiHelper.generateApiName("test").should.equal("ga:test");
		done();
	});
});