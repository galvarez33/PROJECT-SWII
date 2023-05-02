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

  it("Strange email Matcher Test", () => {
    expect(emailMatcher.parseDocument("test@marca.com")).toEqual(["test@marca.com"])
  })

  it("Long text email Matcher Test", () => {
    expect(emailMatcher.parseDocument("Hola buenos dias que tal soy test@gmail.com")).toEqual(["test@gmail.com"])
  })

  it("Two emails inside long text Matcher Test", () => {
    expect(emailMatcher.parseDocument("Hola buenos dias que tal soy test@gmail.com y mi compañero es test2@gmail.com")).toEqual(["test@gmail.com", "test2@gmail.com"])
  })

  it("Lots of email using different types Matcher test", () => {
    expect(emailMatcher.parseDocument("test@gmail.com y mi compañero es test2@gmail.com y mi amigo es t@marc.com y su amigo es marca@marca.com")).toEqual(["test@gmail.com", "test2@gmail.com", "t@marc.com", "marca@marca.com"])
  })

});
