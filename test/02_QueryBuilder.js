const { expect } = require("chai");
const QueryBuilder = require("../src/QueryBuilder");

describe("QueryBuilder", function() {
	let queryBuilder = null;

	describe("Initialization", function() {
		beforeEach(function() {
			queryBuilder = new QueryBuilder();
		});

		it("should have a function called value", function() {
			expect(typeof queryBuilder.value).to.eq("function");
		});

		it("should have a function called clone", function() {
			expect(typeof queryBuilder.clone).to.eq("function");
		});

		it("should have a function called then", function() {
			expect(typeof queryBuilder.then).to.eq("function");
		});

		it("should contain correct default values", function() {
			expect(queryBuilder.value()).to.deep.eq({ metrics: [], dimensions: [], dateRanges: []});
		});

	});

	describe("Actions", function() {});
});
