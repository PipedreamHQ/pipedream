const providers = {
  ACCELO: "accelo",
  ADOBE: {
    value: "adobe",
    defaultScopes: [
      "offline_access",
    ],
  },
  AIRTABLE: "airtable",
  AMAZON: "amazon",
  AMPLITUDE: "amplitude",
  ASANA: "asana",
  ASSEMBLA: "assembla",
  ATLASSIAN: {
    value: "atlassian",
    defaultScopes: [
      "offline_access",
    ],
  },
  BAMBOOHR: "bamboohr",
  BATTLENET: "battlenet",
  BITBUCKET: "bitbucket",
  BOLDSIGN: "boldsign",
  BOX: "box",
  BRAINTREE: "braintree",
  BRAINTREE_SANDBOX: "braintree-sandbox",
  BREX: {
    value: "brex",
    defaultScopes: [
      "offline_access",
    ],
  },
  BREX_STAGING: "brex-staging",
  CALENDLY: "calendly",
  CLICKUP: "clickup",
  CONFLUENCE: "confluence",
  CONTENTSTACK: "contentstack",
  DEEL: "deel",
  DEEL_SANDBOX: "deel-sandbox",
  DIGITALOCEAN: "digitalocean",
  DISCORD: "discord",
  DOCUSIGN: "docusign",
  DOCUSIGN_SANDBOX: "docusign-sandbox",
  DROPBOX: "dropbox",
  EPIC_GAMES: "epic-games",
  FACEBOOK: "facebook",
  FACTORIAL: "factorial",
  FIGJAM: "figjam",
  FIGMA: "figma",
  FITBIT: "fitbit",
  FRESHBOOKS: "freshbooks",
  FRONT: "front",
  GITHUB: "github",
  GITLAB: "gitlab",
  GOOGLE: "google",
  GOOGLE_CALENDAR: "google-calendar",
  GOOGLE_MAIL: "google-mail",
  GOOGLE_SHEET: "google-sheet",
  GORGIAS: {
    value: "gorgias",
    defaultScopes: [
      "offline",
    ],
  },
  GREENHOUSE: "greenhouse",
  GUMROAD: "gumroad",
  GUSTO: "gusto",
  HEALTH_GORILLA: "health-gorilla",
  HUBSPOT: "hubspot",
  INSTAGRAM: "instagram",
  INTERCOM: "intercom",
  INTUIT: "intuit",
  JIRA: "jira",
  KEAP: "keap",
  LEVER: "lever",
  LINEAR: "linear",
  LINKEDIN: "linkedin",
  LINKHUT: "linkhut",
  MAILCHIMP: "mailchimp",
  MICROSOFT_TEAMS: "microsoft-teams",
  MIRO: "miro",
  MONDAY: "monday",
  MURAL: "mural",
  NETSUITE: {
    value: "netsuite",
    defaultScopes: [
      "restlets",
    ],
  },
  NOTION: "notion",
  NOTION2: "notion2",
  ONE_DRIVE: {
    value: "one-drive",
    defaultScopes: [
      "offline_access",
    ],
  },
  OSU: {
    value: "osu",
    defaultScopes: [
      "identify",
    ],
  },
  OUTREACH: "outreach",
  PAGERDUTY: "pagerduty",
  PANDADOC: "pandadoc",
  PAYFIT: "payfit",
  PIPEDRIVE: "pipedrive",
  QUALTRICS: "qualtrics",
  QUICKBOOKS: "quickbooks",
  RAMP: "ramp",
  RAMP_SANDBOX: "ramp-sandbox",
  REDDIT: "reddit",
  SAGE: "sage",
  SALESFORCE: {
    value: "salesforce",
    defaultScopes: [
      "offline_access",
    ],
  },
  SALESLOFT: "salesloft",
  SEGMENT: "segment",
  SHOPIFY: "shopify",
  SLACK: "slack",
  SMUGMUG: "smugmug",
  SPLITWISE: "splitwise",
  SPOTIFY: "spotify",
  SQUAREUP: "squareup",
  SQUAREUP_SANDBOX: "squareup-sandbox",
  STACKEXCHANGE: {
    value: "stackexchange",
    defaultScopes: [
      "no_expiry",
    ],
  },
  STRAVA: "strava",
  STRIPE: "stripe",
  SURVEY_MONKEY: "survey-monkey",
  TEAMWORK: "teamwork",
  TIMELY: "timely",
  TODOIST: "todoist",
  TRELLO: "trello",
  TWINFIELD: {
    value: "twinfield",
    defaultScopes: [
      "openid",
      "twf.user",
      "twf.organisation",
      "twf.organisationUser",
      "offline_access",
    ],
  },
  TWITCH: "twitch",
  TWITTER: "twitter",
  TWITTER_V2: {
    value: "twitter-v2",
    defaultScopes: [
      "offline.access",
    ],
  },
  TYPEFORM: {
    value: "typeform",
    defaultScopes: [
      "offline",
    ],
  },
  UBER: "uber",
  WAKATIME: "wakatime",
  WAVE_ACCOUNTING: "wave-accounting",
  XERO: "xero",
  YAHOO: "yahoo",
  YANDEX: "yandex",
  YOUTUBE: "youtube",
  ZAPIER_NLA: "zapier-nla",
  ZENDESK: "zendesk",
  ZENEFITS: "zenefits",
  ZOHO_BOOKS: "zoho-books",
  ZOHO_CRM: "zoho-crm",
  ZOHO_DESK: "zoho-desk",
  ZOHO_INVOICE: "zoho-invoice",
  ZOOM: "zoom",
};

function getProviders() {
  return Object.values(providers).map((provider) => provider.value || provider);
}

function getDefaultScopes(providerValue) {
  const providerFound =
    Object.values(providers)
      .find((provider) => provider?.value === providerValue);
  return providerFound?.defaultScopes || [];
}

export default {
  getProviders,
  getDefaultScopes,
};
