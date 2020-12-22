const { expect } = require("chai");
const ObjectBuilder = require("../src/ObjectBuilder");

describe("ObjectBuilder", function() {
	let objectBuilder = null;
	
	beforeEach(function(){
		objectBuilder = new ObjectBuilder();
	});

	describe("Initialization", function() {
		it("should have a function called toJson", function(){
			expect(typeof objectBuilder.toJson).to.eq("function");
		});
	
		it("should have a function called clone", function(){
			expect(typeof objectBuilder.clone).to.eq("function");
		});
	
		it("should have a function called then", function(){
			expect(typeof objectBuilder.then).to.eq("function");
		});

		it("should have a function called set", function(){
			expect(typeof objectBuilder.set).to.eq("function");
		});

		it("should have a function called append", function(){
			expect(typeof objectBuilder.append).to.eq("function");
		});

		it("should have a function called delete", function(){
			expect(typeof objectBuilder.delete).to.eq("function");
		});

		it("should have a function called remove", function(){
			expect(typeof objectBuilder.remove).to.eq("function");
		});

	});

});