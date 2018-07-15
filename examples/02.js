var ObjectBuilder = require("../src/ObjectBuilder");

var Obj = new ObjectBuilder();

Obj.set("this.is.test",1234);
Obj.set("this.is.test",4567);

console.log(Obj.make());