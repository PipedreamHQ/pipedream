import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-create-monitor",
  name: "Create Monitor",
  description: "Create a new signal monitor for jobs, news, or advertisements. [See the documentation](https://docs.pubrio.com)",
  version: "0.0.1",
  type: "action",
  props: {
    pubrio,
    name: {
      type: "string",
      label: "Name",
      description: "Name for the monitor",
    },
    detectionMode: {
      type: "string",
      label: "Detection Mode",
      description: "Whether to detect new signals only or new and updated",
      options: ["new", "new_and_updated"],
    },
    signalTypes: {
      type: "string[]",
      label: "Signal Types",
      description: "Types of signals to monitor",
      options: ["jobs", "news", "advertisements"],
    },
    destinationType: {
      type: "string",
      label: "Destination Type",
      description: "How to deliver monitor results",
      options: ["webhook", "email", "outreach_sequence"],
    },
    webhookUrl: {
      type: "string",
      label: "Webhook URL",
      description: "Webhook URL for delivery (required if destination_type is webhook)",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address for delivery (required if destination_type is email)",
      optional: true,
    },
    sequenceIdentifier: {
      type: "string",
      label: "Sequence Identifier",
      description: "Outreach sequence identifier (required if destination_type is outreach_sequence)",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description for the monitor",
      optional: true,
    },
    frequencyMinute: {
      type: "integer",
      label: "Frequency (Minutes)",
      description: "How often to check for new signals in minutes",
      optional: true,
    },
    maxDailyTrigger: {
      type: "integer",
      label: "Max Daily Triggers",
      description: "Maximum number of triggers per day",
      optional: true,
    },
    maxRecordsPerTrigger: {
      type: "integer",
      label: "Max Records Per Trigger",
      description: "Maximum records per trigger",
      optional: true,
    },
    companies: {
      type: "string",
      label: "Companies",
      description: "Comma-separated company names to monitor",
      optional: true,
    },
    domains: {
      type: "string",
      label: "Domains",
      description: "Comma-separated domains to monitor",
      optional: true,
    },
    linkedinUrls: {
      type: "string",
      label: "LinkedIn URLs",
      description: "Comma-separated LinkedIn URLs to monitor",
      optional: true,
    },
    companyFilters: {
      type: "string",
      label: "Company Filters",
      description: "JSON object of company filters",
      optional: true,
    },
    signalFilters: {
      type: "string",
      label: "Signal Filters",
      description: "JSON array of signal filter objects",
      optional: true,
    },
    peopleEnrichmentConfigs: {
      type: "string",
      label: "People Enrichment Configs",
      description: "JSON array of people enrichment configuration objects",
      optional: true,
    },
    isCompanyEnrichment: {
      type: "boolean",
      label: "Enable Company Enrichment",
      description: "Whether to enrich company data",
      optional: true,
    },
    isPeopleEnrichment: {
      type: "boolean",
      label: "Enable People Enrichment",
      description: "Whether to enrich people data",
      optional: true,
    },
    maxFailureTrigger: {
      type: "integer",
      label: "Max Failure Triggers",
      description: "Maximum number of failure triggers (1-10)",
      optional: true,
    },
    maxRetryPerTrigger: {
      type: "integer",
      label: "Max Retry Per Trigger",
      description: "Maximum retries per trigger (0-3)",
      optional: true,
    },
    retryDelaySecond: {
      type: "integer",
      label: "Retry Delay (Seconds)",
      description: "Delay between retries in seconds (1-5)",
      optional: true,
    },
    notificationEmail: {
      type: "string",
      label: "Notification Email",
      description: "Email address for failure notifications",
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.destinationType === "webhook" && !this.webhookUrl) {
      throw new Error("Webhook URL is required when destination type is 'webhook'");
    }
    if (this.destinationType === "email" && !this.email) {
      throw new Error("Email is required when destination type is 'email'");
    }
    if (this.destinationType === "outreach_sequence" && !this.sequenceIdentifier) {
      throw new Error("Sequence Identifier is required when destination type is 'outreach_sequence'");
    }
    const data = {
      name: this.name,
      detection_mode: this.detectionMode,
      signal_types: this.signalTypes,
      destination_type: this.destinationType,
    };
    if (this.webhookUrl) data.webhook_url = this.webhookUrl;
    if (this.email) data.email = this.email;
    if (this.sequenceIdentifier) data.sequence_identifier = this.sequenceIdentifier;
    if (this.description) data.description = this.description;
    if (this.frequencyMinute != null) data.frequency_minute = this.frequencyMinute;
    if (this.maxDailyTrigger != null) data.max_daily_trigger = this.maxDailyTrigger;
    if (this.maxRecordsPerTrigger != null) data.max_records_per_trigger = this.maxRecordsPerTrigger;
    if (this.companies) data.companies = this.pubrio.splitComma(this.companies);
    if (this.domains) data.domains = this.pubrio.splitComma(this.domains);
    if (this.linkedinUrls) data.linkedin_urls = this.pubrio.splitComma(this.linkedinUrls);
    if (this.companyFilters) {
      try { data.company_filters = JSON.parse(this.companyFilters); }
      catch { throw new Error("company_filters must be valid JSON"); }
    }
    if (this.signalFilters) {
      try { data.signal_filters = JSON.parse(this.signalFilters); }
      catch { throw new Error("signal_filters must be valid JSON"); }
    }
    if (this.peopleEnrichmentConfigs) {
      try { data.people_enrichment_configs = JSON.parse(this.peopleEnrichmentConfigs); }
      catch { throw new Error("people_enrichment_configs must be valid JSON"); }
    }
    if (this.isCompanyEnrichment != null) data.is_company_enrichment = this.isCompanyEnrichment;
    if (this.isPeopleEnrichment != null) data.is_people_enrichment = this.isPeopleEnrichment;
    if (this.maxFailureTrigger != null) data.max_failure_trigger = this.maxFailureTrigger;
    if (this.maxRetryPerTrigger != null) data.max_retry_per_trigger = this.maxRetryPerTrigger;
    if (this.retryDelaySecond != null) data.retry_delay_second = this.retryDelaySecond;
    if (this.notificationEmail) data.notification_email = this.notificationEmail;
    const response = await this.pubrio.makeRequest({
      $,
      method: "POST",
      url: "/monitors/create",
      data,
    });
    $.export("$summary", "Successfully created monitor");
    return response;
  },
};
