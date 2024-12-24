const BASE_URL = "https://api.uptimerobot.com";
const VERSION_PATH = "/v2";
const DEFAULT_LIMIT = 50;

const MONITOR_TYPE = {
  PING: {
    label: "Ping",
    value: "3",
  },
  PORT: {
    label: "Port",
    value: "4",
  },
  HTTPS: {
    label: "HTTP(s)",
    value: "1",
  },
  KEYWORD: {
    label: "Keyword",
    value: "2",
  },
};

const ALERT_CONTACT_STATUS = {
  NOT_ACTIVATED: {
    label: "Not Activated",
    value: "0",
  },
  PAUSED: {
    label: "Paused",
    value: "1",
  },
  ACTIVE: {
    label: "Active",
    value: "2",
  },
};

const PORT_TYPE = {
  HTTP: {
    label: "HTTP (80)",
    value: "1",
  },
  HTTPS: {
    label: "HTTPS (443)",
    value: "2",
  },
  FTP: {
    label: "FTP (21)",
    value: "3",
  },
  SMTP: {
    label: "SMTP (25)",
    value: "4",
  },
  POP3: {
    label: "POP3 (110)",
    value: "5",
  },
  IMAP: {
    label: "IMAP (143)",
    value: "6",
  },
  CUSTOM: {
    label: "Custom Port",
    value: "99",
  },
};

const ALERT_CONTACT_TYPE = {
  SMS: {
    label: "SMS",
    value: "1",
  },
  EMAIL: {
    label: "E-mail",
    value: "2",
  },
  TWITTER: {
    label: "Twitter",
    value: "3",
  },
  WEB_HOOK: {
    label: "Web-hook",
    value: "5",
  },
  PUSHBULLET: {
    label: "Pushbullet",
    value: "6",
  },
  ZAPIER: {
    label: "Zapier",
    value: "7",
  },
  PRO_SMS: {
    label: "Pro SMS",
    value: "8",
  },
  PUSHOVER: {
    label: "Pushover",
    value: "9",
  },
  SLACK: {
    label: "Slack",
    value: "11",
  },
  VOICE_CALL: {
    label: "Voice Call",
    value: "14",
  },
  SPLUNK: {
    label: "Splunk",
    value: "15",
  },
  PAGERDUTY: {
    label: "Pagerduty",
    value: "16",
  },
  OPSGENIE: {
    label: "Opsgenie",
    value: "17",
  },
  MS_TEAMS: {
    label: "MS Teams",
    value: "20",
  },
  GOOGLE_CHAT: {
    label: "Google Chat",
    value: "21",
  },
  DISCORD: {
    label: "Discord",
    value: "23",
  },
};

const ALERT_CONTACT_TYPE_VALUE_MAP = {
  "1": "sms",
  "2": "e-mail",
  "3": "twitter",
  "5": "web-hook",
  "6": "pushbullet",
  "7": "zapier",
  "8": "pro-sms",
  "9": "pushover",
  "11": "slack",
  "14": "voice-call",
  "15": "splunk",
  "16": "pagerduty",
  "17": "opsgenie",
  "20": "ms-teams",
  "21": "google-chat",
  "23": "discord",
};

const PORT_VALUE_MAP = {
  "1": 80,
  "2": 443,
  "3": 21,
  "4": 25,
  "5": 110,
  "6": 143,
};

export default {
  BASE_URL,
  VERSION_PATH,
  MONITOR_TYPE,
  DEFAULT_LIMIT,
  ALERT_CONTACT_TYPE,
  ALERT_CONTACT_TYPE_VALUE_MAP,
  ALERT_CONTACT_STATUS,
  PORT_TYPE,
  PORT_VALUE_MAP,
};
