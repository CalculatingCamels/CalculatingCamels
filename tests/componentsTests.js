describe("An AngularJS test suite", function(){
  beforeEach(module('ngResource'));

  it("should have tests", function(){
  	expect(true).toBe(true);
  });

  it("should inject resources", inject( function ($resource) {
  	expect($resource).toBeDefined();
  }));

  
});