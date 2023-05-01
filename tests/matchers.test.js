const {URLMatcher, EmailMatcher, PhoneMatcher} = require("../scripts/matchers");

describe("URLMatcher Tests", () => {
  const urlMatcher = new URLMatcher();
  it("Simple URL Matcher Test", () => {
    expect(urlMatcher.parseDocument("www.google.es")).toEqual([])
  })

  it("http URL Matcher Test", () => {
    expect(urlMatcher.parseDocument("http://www.google.es")).toEqual(["http://www.google.es"])
  })
});
