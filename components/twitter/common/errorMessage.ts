export const ERROR_URL = "https://developer.twitter.com/en/docs/twitter-api/getting-started/about-twitter-api#item0";
export const ERROR_MESSAGE = `Check if your app is properly configured on the [Twitter Developer Portal](${ERROR_URL}), and if your plan has access to the endpoint used by this component.`;

export const ACTION_ERROR_MESSAGE = `${ERROR_MESSAGE} Additional debugging information has been exported from the step.`;

// Taken from https://developer.twitter.com/en/support/x-api/error-troubleshooting#error-information and https://api.twitter.com/2/openapi.json
const PROBLEM_BASE_URL = "https://api.twitter.com/2/problems";
export const PROBLEM_TYPE = {
  [`${PROBLEM_BASE_URL}/client-forbidden`]: "This X (Twitter) account appears to be on the Free plan, which only has access to **Create Tweets**. [Refer to Twitter's developer docs](https://developer.twitter.com/en/docs/twitter-api/getting-started/about-twitter-api#v2-access-leve) for the latest info on API access.",
  ["about:blank"]: "A generic problem with no additional information beyond that provided by the HTTP status code.",
  [`${PROBLEM_BASE_URL}/invalid-request`]: "A problem that indicates this request is invalid. If your request takes a POST body, ensure the contents is valid JSON and matches the [OpenAPI spec](https://api.twitter.com/2/openapi.json).",
  [`${PROBLEM_BASE_URL}/resource-not-found`]: "A problem that indicates that a given Post, User, etc. does not exist.",
  [`${PROBLEM_BASE_URL}/not-authorized-for-resource`]: "A problem that indicates you are not allowed to see a particular Post, User, etc.",
  [`${PROBLEM_BASE_URL}/disallowed-resource`]: "A problem that indicates that the resource requested violates the precepts of this API.",
  [`${PROBLEM_BASE_URL}/unsupported-authentication`]: "A problem that indicates that the authentication used is not supported.",
  [`${PROBLEM_BASE_URL}/usage-capped`]: "A problem that indicates that a usage cap has been exceeded.",
  [`${PROBLEM_BASE_URL}/streaming-connection`]: "A problem that indicates something is wrong with the connection.",
  [`${PROBLEM_BASE_URL}/client-disconnected`]: "Your client has gone away.",
  [`${PROBLEM_BASE_URL}/operational-disconnect`]: "You have been disconnected for operational reasons.",
  [`${PROBLEM_BASE_URL}/rule-cap`]: "You have exceeded the maximum number of rules.",
  [`${PROBLEM_BASE_URL}/rule-length`]: "You have exceeded the maximum number of characters allowed on your query or rule based on your access level. See [access levels](https://developer.twitter.com/en/docs/twitter-api/getting-started/about-twitter-api.html#Access).",
  [`${PROBLEM_BASE_URL}/invalid-rules`]: "The rule you have submitted is invalid.",
  [`${PROBLEM_BASE_URL}/duplicate-rules`]: "The rule you have submitted is a duplicate.",
  [`${PROBLEM_BASE_URL}/conflict`]: "The rule you have submitted is in conflict with another rule.",
  [`${PROBLEM_BASE_URL}/noncompliant-rules`]: "The rule you have submitted is not compliant with Twitter's Automation Rules",
  [`${PROBLEM_BASE_URL}/not-authorized-for-field`]: "A problem that indicates you are not allowed to see a particular field.",
  [`${PROBLEM_BASE_URL}/oauth1-permissions`]: "A problem that indicates you are not allowed to see a particular field.",
  [`${PROBLEM_BASE_URL}/resource-unavailable`]: "A problem that indicates that a given Post, User, etc. is temporarily unavailable.",
};
