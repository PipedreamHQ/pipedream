export default {
  type: {
    type: "string",
    label: "Type",
    description: "The type of the Cloudflare Turnstile task.",
    options: [
      "TurnstileTaskProxyless",
      "TurnstileTask",
    ],
    default: "TurnstileTaskProxyless",
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
    description: "Turnstile sitekey. Can be found inside **data-sitekey** property of the Turnstile **div** element.",
  },
  userAgent: {
    type: "string",
    label: "User Agent",
    description: "User-Agent of your browser will be used to load the captcha. Use only modern browser's User-Agents.",
    optional: true,
  },
  action: {
    type: "string",
    label: "Action",
    description: "Required for Cloudflare Challenge pages. The value of **action** parameter of **turnstile.render** call.",
    optional: true,
  },
  data: {
    type: "string",
    label: "Data",
    description: "Required for Cloudflare Challenge pages. The value of **data** parameter of **turnstile.render** call.",
    optional: true,
  },
  pagedata: {
    type: "string",
    label: "Pagedata",
    description: "Required for Cloudflare Challenge pages. The value of **chlPageData** parameter of **turnstile.render** call.",
    optional: true,
  },
};
