const {URLMatcher, EmailMatcher, PhoneMatcher} = require('./scripts/matchers');

const doc = "https://urllist.net/||||||||||pepe@gmail.com|||||asdfasdf|||||||<><<+34660800249>>";
[
  new URLMatcher(),
  new EmailMatcher(),
  new PhoneMatcher()
].forEach(matcher => {
  console.log(matcher.getMatches(doc));
});

