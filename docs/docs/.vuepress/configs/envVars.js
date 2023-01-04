module.exports = {
  PIPEDREAM_BASE_URL: "https://pipedream.com",
  API_BASE_URL: "https://api.pipedream.com/v1",
  SQL_API_BASE_URL: "https://rt.pipedream.com/sql",
  PAYLOAD_SIZE_LIMIT: "512KB",
  MEMORY_LIMIT: "256MB",
  MEMORY_ABSOLUTE_LIMIT: "10GB",
  EMAIL_PAYLOAD_SIZE_LIMIT: "30MB",

  limits: {
    // DATA STORES LIMITS
    data_stores: {
      FREE: "2",
      PRO: "10",
      ADVANCED: "25",
      BUSINESS: "100",
      ENTERPRISE: "Unlimited",
    },

    data_stores_keys: {
      FREE: "1,000",
      PRO: "Unlimited",
      ADVANCED: "Unlimited",
      BUSINESS: "Unlimited",
      ENTERPRISE: "Unlimited",
    },

    // WORKFLOW LIMITS
    workflows: {
      FREE: "10",
      PRO: "25",
      ADVANCED: 'Unlimited',
      BUSINESS: 'Unlimited',
      ENTERPRISE: 'Unlimited',
    },

    compute_time_per_invocation: {
      FREE: '350 seconds',
      PRO: '750 seconds',
      ADVANCED: '750 seconds',
      BUSINESS: '750 seconds',
      ENTERPRISE: '750 seconds',
    },

    workflow_queue_size: {
      FREE: "100",
      PRO: '10,000',
      ADVANCED: '25,000',
      BUSINESS: '100,000',
      ENTERPRISE: 'custom',
    },

    // SOURCE LIMITS
    sources: {
      FREE: '10',
      PRO: '25',
      ADVANCED: 'Unlimited',
      BUSINESS: 'Unlimited',
      ENTERPRISE: 'Unlimited',
    },

    // POLLING INTERVAL LIMITS
    polling_intervals: {
      FREE: '15 seconds',
      PRO: '1 second',
      ADVANCED: '1 second',
      BUSINESS: '1 second',
      ENTERPRISE: '1 second',
    },

    // EVENT HISTORY LIMITS
    event_histories: {
      FREE: "100",
      PRO: "1,000",
      ADVANCED: "5,000",
      BUSINESS: "10,000",
      ENTERPRISE: "custom",
    },

    // CONNECTED ACCOUNT LIMITS
    connected_accounts: {
      FREE: "5",
      PRO: "20",
      ADVANCED: "Unlimited",
      BUSINESS: "Unlimited",
      ENTERPRISE: "Unlimited",
    },

    // INVOCATION OVERAGE PRICING
    invocation_overage_pricing: {
      FREE: 'N/A - limited to 100 invocations per day',
      PRO: '$0.0004',
      ADVANCED: '$0.0003',
      BUSINESS: '$0.0002',
      ENTERPRISE: '$0.0002',
    },

    // BASE INVOCATION QUOTAS
    base_invocations: {
      FREE: '100 per day',
      PRO: '10,000',
      ADVANCED: '100,000',
      BUSINESS: '500,000',
      ENTERPRISE: '1,000,000',
    },

    // MONTHLY SUBSCRIPTION PRICE
    monthly_subscription_price: {
      FREE: '$0.00',
      PRO: '$29.00',
      ADVANCED: '$149.00',
      BUSINESS: '$499.00',
      ENTERPRISE: 'custom',
    },

    // ANNUAL SUBSCRIPTION PRICE
    annual_subscription_price: {
      FREE: '$0.00',
      PRO: '$19.00 per month',
      ADVANCED: '$99.00 per month',
      BUSINESS: '$335.00 per month',
      ENTERPRISE: 'custom',
    },

    // USER LIMITS
    user_limits: {
      FREE: '1',
      PRO: '1',
      ADVANCED: '1',
      BUSINESS: '5',
      ENTERPRISE: '10',
    },

    // GITHUB INTEGRATION
    git_integration: {
      FREE: 'Personal',
      PRO: 'Personal',
      ADVANCED: 'Organization',
      BUSINESS: 'Organization',
      ENTERPRISE: 'Enterprise Server',
    },

    // Support
    support: {
      FREE: "Slack Community and Forum Support",
      PRO: "Slack Community and Forum Support",
      ADVANCED: "Slack Community and Forum Support",
      BUSINESS: "Email and Private Slack Channel with Pipedream Support",
      ENTERPRISE: "Email and Private Slack Channel with Pipedream Support",
    },

    // HTTP Proxy

    // workspaces
    workspaces: {
      FREE: 'None',
      PRO: '1',
      ADVANCED: '5',
      BUSINESS: '50',
      ENTERPRISE: "100"
    }
  },

  INSPECTOR_EVENT_EXPIRY_DAYS: "365",
  FUNCTION_PAYLOAD_LIMIT: "6MB",
  DAILY_INVOCATIONS_LIMIT: "333",
  FREE_ORG_DAILY_INVOCATIONS_LIMIT: "66",
  PRICE_PER_INVOCATION: "0.0002",
  FREE_MONTHLY_INVOCATIONS: "10,000",
  PRO_MONTHLY_INVOCATIONS: "20,000",
  TEAM_MONTHLY_INVOCATIONS: "20,000",
  TEAM_MEMBER_LIMIT: "5",
  PRO_MONTHLY_PRICE: "$19",
  TEAM_MONTHLY_PRICE: "$19",
  DEFAULT_WORKFLOW_QUEUE_SIZE: "100",
  MAX_WORKFLOW_QUEUE_SIZE: "10,000",
  NODE_VERSION: "14",
  PYTHON_VERSION: "3.8",
  GO_LANG_VERSION: "1.17.1",
  CONFIGURED_PROPS_SIZE_LIMIT: "64KB",
  SERVICE_DB_SIZE_LIMIT: "60KB",
  TMP_SIZE_LIMIT: "2GB",
  DELAY_MIN_MAX_TIME: "You can pause your workflow for as little as one millisecond, or as long as one year",
  PUBLIC_APPS: "1000"
}
