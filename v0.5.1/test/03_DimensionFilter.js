const should = require("chai").should();
const fs = require("fs");

const DimensionFilter = require("../src/DimensionFilter");

function randomString() {
	return Math.random()
		.toString(36)
		.substr(2, 5);
}

function randomNumber() {
	return Math.floor(Math.random() * 10000);
}

describe("DimensionFilter", function() {
	var str = randomString();
	it("should have operator equal to " + str, function(done) {
		var filter = new DimensionFilter().condition("", str).make();
		filter.operator.should.equal(str);
		done();
	});
	var str = randomString();
	it("should have expressions equal to ['" + str + "']", function(done) {
		var filter = new DimensionFilter().condition(str, "").make();
		filter.expressions.should.eql([str]);
		done();
	});
	var str = randomString();
	it("should have dimensionName equal to ga:" + str, function(done) {
		var filter = new DimensionFilter().dimension(str).make();
		filter.dimensionName.should.equal("ga:" + str);
		done();
	});
	it("should have not equal to true", function(done) {
		var filter = new DimensionFilter().not().make();
		filter.not.should.equal(true);
		done();
	});
	it("should have not equal to true", function(done) {
		var filter = new DimensionFilter().inverse().make();
		filter.not.should.equal(true);
		done();
	});
	describe("operator", function() {
		it("should have operator equal to REGEXP", function(done) {
			var filter = new DimensionFilter().matchRegex("").make();
			filter.operator.should.equal("REGEXP");
			done();
		});
		it("should have operator equal to BEGINS_WITH", function(done) {
			var filter = new DimensionFilter().beginsWith("").make();
			filter.operator.should.equal("BEGINS_WITH");
			done();
		});
		it("should have operator equal to ENDS_WITH", function(done) {
			var filter = new DimensionFilter().endsWith("").make();
			filter.operator.should.equal("ENDS_WITH");
			done();
		});
		it("should have operator equal to PARTIAL", function(done) {
			var filter = new DimensionFilter().contains("").make();
			filter.operator.should.equal("PARTIAL");
			done();
		});
		it("should have operator equal to EXACT", function(done) {
			var filter = new DimensionFilter().is("").make();
			filter.operator.should.equal("EXACT");
			done();
		});
		it("should have operator equal to EXACT", function(done) {
			var filter = new DimensionFilter().matches("").make();
			filter.operator.should.equal("EXACT");
			done();
		});
		it("should have operator equal to NUMERIC_EQUAL", function(done) {
			var filter = new DimensionFilter().equalsTo("").make();
			filter.operator.should.equal("NUMERIC_EQUAL");
			done();
		});
		it("should have operator equal to NUMERIC_EQUAL", function(done) {
			var filter = new DimensionFilter().eq("").make();
			filter.operator.should.equal("NUMERIC_EQUAL");
			done();
		});
		it("should have operator equal to NUMERIC_GREATER_THAN", function(done) {
			var filter = new DimensionFilter().greaterThan("").make();
			filter.operator.should.equal("NUMERIC_GREATER_THAN");
			done();
		});
		it("should have operator equal to NUMERIC_GREATER_THAN", function(done) {
			var filter = new DimensionFilter().gt("").make();
			filter.operator.should.equal("NUMERIC_GREATER_THAN");
			done();
		});
		it("should have operator equal to NUMERIC_LESS_THAN", function(done) {
			var filter = new DimensionFilter().lessThan("").make();
			filter.operator.should.equal("NUMERIC_LESS_THAN");
			done();
		});
		it("should have operator equal to NUMERIC_LESS_THAN", function(done) {
			var filter = new DimensionFilter().lt("").make();
			filter.operator.should.equal("NUMERIC_LESS_THAN");
			done();
		});
		it("should have operator equal to IN_LIST", function(done) {
			var filter = new DimensionFilter().inList("").make();
			filter.operator.should.equal("IN_LIST");
			done();
		});
	});

	describe("expressions", function() {
		var str = randomString();
		it("should equal to ['" + str + "']", function(done) {
			var filter = new DimensionFilter().matchRegex(str).make();
			filter.expressions.should.eql([str]);
			done();
		});
		it("should equal to ['" + str + "']", function(done) {
			var filter = new DimensionFilter().beginsWith(str).make();
			filter.expressions.should.eql([str]);
			done();
		});
		it("should equal to ['" + str + "']", function(done) {
			var filter = new DimensionFilter().endsWith(str).make();
			filter.expressions.should.eql([str]);
			done();
		});
		it("should equal to ['" + str + "']", function(done) {
			var filter = new DimensionFilter().contains(str).make();
			filter.expressions.should.eql([str]);
			done();
		});
		it("should equal to ['" + str + "']", function(done) {
			var filter = new DimensionFilter().is(str).make();
			filter.expressions.should.eql([str]);
			done();
		});
		it("should equal to ['" + str + "']", function(done) {
			var filter = new DimensionFilter().matches(str).make();
			filter.expressions.should.eql([str]);
			done();
		});
		var num = randomNumber();
		it("should equal to ['" + num + "']", function(done) {
			var filter = new DimensionFilter().equalsTo(num).make();
			filter.expressions.should.eql([num.toString()]);
			done();
		});
		it("should equal to ['" + num + "']", function(done) {
			var filter = new DimensionFilter().eq(num).make();
			filter.expressions.should.eql([num.toString()]);
			done();
		});
		it("should equal to ['" + num + "']", function(done) {
			var filter = new DimensionFilter().greaterThan(num).make();
			filter.expressions.should.eql([num.toString()]);
			done();
		});
		it("should equal to ['" + num + "']", function(done) {
			var filter = new DimensionFilter().gt(num).make();
			filter.expressions.should.eql([num.toString()]);
			done();
		});
		it("should equal to ['" + (num - 1) + "']", function(done) {
			var filter = new DimensionFilter().greaterThanEqualTo(num).make();
			filter.expressions.should.eql([(num - 1).toString()]);
			done();
		});
		it("should equal to ['" + (num - 1) + "']", function(done) {
			var filter = new DimensionFilter().gte(num).make();
			filter.expressions.should.eql([(num - 1).toString()]);
			done();
		});
		it("should equal to ['" + num + "']", function(done) {
			var filter = new DimensionFilter().lessThan(num).make();
			filter.expressions.should.eql([num.toString()]);
			done();
		});
		it("should equal to ['" + num + "']", function(done) {
			var filter = new DimensionFilter().lt(num).make();
			filter.expressions.should.eql([num.toString()]);
			done();
		});
		it("should equal to ['" + (num + 1) + "']", function(done) {
			var filter = new DimensionFilter().lessThanEqualTo(num).make();
			filter.expressions.should.eql([(num + 1).toString()]);
			done();
		});
		it("should equal to ['" + (num + 1) + "']", function(done) {
			var filter = new DimensionFilter().lte(num).make();
			filter.expressions.should.eql([(num + 1).toString()]);
			done();
		});
		it("should equal to ['1','2','3']", function(done) {
			var filter = new DimensionFilter().inList([1, 2, 3]).make();
			filter.expressions.should.eql(["1", "2", "3"]);
			done();
		});
		it("should equal to ['1','2','3']", function(done) {
			var filter = new DimensionFilter().inList(1, 2, 3).make();
			filter.expressions.should.eql(["1", "2", "3"]);
			done();
		});
	});

	it("should have caseSensitive equal to true", function(done) {
		var filter = new DimensionFilter().caseSensitive().make();
		filter.caseSensitive.should.equal(true);
		done();
	});
});
