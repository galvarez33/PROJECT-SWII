const {Matcher} = require("../scripts/matchers")

describe("Matcher", () => {
  describe("parseDocument()", () => {
    it("is abstract method", () => {
      expect(() => {
        const matcher = new Matcher();
        matcher.parseDocument();
      }).toThrow("NotImplementedError")
    });
  });

  describe("getMatches()", () => {

  });
});