export const DEFAULT_LIMIT = 100;
export const MAX_LIMIT = 500;

export const COURT_STATUSES = [
  "live",
  "coming_soon",
];

export const LOGIC_TYPES = [
  "CourtesyCopyRule",
  "PageWordLimitRule",
  "PreMotionConferenceRule",
  "AdjournmentRequirementRule",
  "BundlingRule",
  "FormatConstraint",
  "DocumentRequirement",
  "CommunicationRule",
  "SealingProcedure",
  "ElectronicFilingRule",
  "FilingTimingRule",
  "ServiceRule",
  "FilingFeeRule",
  "JuniorLawyerIncentive",
];

export const WORKFLOW_PHASES = [
  "FILING",
  "CASE_INITIATION",
  "MOTION_PRACTICE",
  "TRIAL_PREP",
  "POST_JUDGMENT",
];

export const CASE_TYPES = [
  "civil",
  "criminal",
  "habeas",
  "prisoner",
  "social_security",
  "bankruptcy",
  "pro_se",
  "general",
  "family",
  "probate",
  "small_claims",
  "unlawful_detainer",
  "traffic",
  "juvenile",
  "mental_health",
  "limited_civil",
  "unlimited_civil",
  "civil_limited",
  "civil_unlimited",
  "complex_civil",
  "chancery",
  "law",
  "municipal",
  "domestic_relations",
  "domestic_violence",
  "county",
  "commercial",
  "foreclosure",
];

export const DOCUMENT_SCOPES = [
  "brief_support",
  "brief_reply",
  "brief_opposition",
  "reconsideration_support",
  "reconsideration_reply",
  "letter",
  "discovery_letter",
  "proposed_findings",
  "affidavit",
  "settlement_statement",
  "objection_response",
  "rule_56_1_statement",
];

export const MOTION_TYPES = [
  "Rule_12",
  "Rule_56",
  "Rule_50",
  "Rule_59",
  "Rule_60",
  "Daubert",
  "TRO",
  "preliminary_injunction",
  "reconsideration",
  "discovery",
  "motion_to_amend",
  "motion_in_limine",
  "general",
];

export const FILING_ROLES = [
  "movant",
  "opponent",
  "reply",
];
