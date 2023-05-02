const {URLMatcher, EmailMatcher, PhoneMatcher} = require("../scripts/matchers");

describe("URLMatcher Tests", () => {
  const urlMatcher = new URLMatcher();
  it("Simple URL Matcher Test", () => {
    expect(urlMatcher.parseDocument("www.google.es")).toEqual([])
  })

  it("http URL Matcher Test", () => {
    expect(urlMatcher.parseDocument("http://www.google.es")).toEqual(["http://www.google.es"])
  })

  it("https URL Matcher Test", () => {
    expect(urlMatcher.parseDocument("https://www.google.es")).toEqual(["https://www.google.es"])
  })

  it("Long text with URL inside", () => {
    expect(urlMatcher.parseDocument("hola buenos dias que tal va todo https://www.google.es ")).toEqual(["https://www.google.es"])
  })

  it("Long text with many URLs inside", () => {
    expect(urlMatcher.parseDocument("hola buenos dias que tal va todo https://www.google.es es un grand dia hoy http://www.google.es")).toEqual(["https://www.google.es","http://www.google.es",])
  })
});

describe("EmailMatcher Tests", () => {
  const emailMatcher = new EmailMatcher();
  it("Simple email Matcher Test", () => {
    expect(emailMatcher.parseDocument("test@gmail.com")).toEqual(["test@gmail.com"])
  })

});
