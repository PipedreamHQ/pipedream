const BASE_URL = "https://api.getrewardful.com/v1";
const DEFAULT_LIMIT = 25;
const MAX_LIMIT = 100;

const AFFILIATE_STATES = [
  "active",
  "disabled",
  "suspicious",
];

const REWARD_TYPES = [
  "percent",
  "amount",
];

const COMMISSION_STATES = [
  "due",
  "pending",
  "paid",
  "voided",
];

const PAYOUT_STATES = [
  "pending",
  "due",
  "processing",
  "paid",
];

const CONVERSION_STATES = [
  "visitor",
  "lead",
  "conversion",
];

const AFFILIATE_EXPAND_OPTIONS = [
  "campaign",
  "links",
  "commission_stats",
];

const COMMISSION_EXPAND_OPTIONS = [
  "sale",
  "campaign",
];

const PAYOUT_EXPAND_OPTIONS = [
  "affiliate",
  "commissions",
];

const REFERRAL_EXPAND_OPTIONS = [
  "affiliate",
];

export default {
  BASE_URL,
  DEFAULT_LIMIT,
  MAX_LIMIT,
  AFFILIATE_STATES,
  REWARD_TYPES,
  COMMISSION_STATES,
  PAYOUT_STATES,
  CONVERSION_STATES,
  AFFILIATE_EXPAND_OPTIONS,
  COMMISSION_EXPAND_OPTIONS,
  PAYOUT_EXPAND_OPTIONS,
  REFERRAL_EXPAND_OPTIONS,
};
