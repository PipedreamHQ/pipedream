export default {
  type: {
    type: "string",
    label: "Type",
    description: "The type of the hCaptcha task.",
    options: [
      "HCaptchaTaskProxyless",
      "HCaptchaTask",
    ],
    default: "HCaptchaTaskProxyless",
    reloadProps: true,
  },
  websiteURL: {
    type: "string",
    label: "Website URL",
    description: "The full URL of target web page where the captcha is loaded. We do not open the page, not a problem if it is available only for authenticated users.",
  },
  websiteKey: {
    type: "string",
    label: "Website Key",
    description: "hCaptcha sitekey. Can be found inside **data-sitekey** property of the hCaptcha **div** element or inside **sitekey** parameter of the requests to hCaptcha API.",
  },
  isInvisible: {
    type: "boolean",
    label: "Is Invisible",
    description: "Pass **true** for Invisible version of hCaptcha - a case when you don't see the checkbox, but the challenge appears. Mostly used with a callback function.",
    optional: true,
  },
  enterprisePayload: {
    type: "object",
    label: "Enterprise Payload",
    description: "An object containing additional parameters like: **rqdata**, **sentry**, **apiEndpoint**, **endpoint**, **reportapi**, **assethost**, **imghost**. Usage example: **{\"rqdata\":\"test_string\"}**.",
    optional: true,
  },
};
