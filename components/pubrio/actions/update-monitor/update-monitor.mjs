import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-update-monitor",
  name: "Update Monitor",
  description: "Update an existing signal monitor. [See the documentation](https://docs.pubrio.com/en/api-reference/endpoint/monitors/update)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    pubrio,
    monitorId: {
      type: "string",
      label: "Monitor ID",
      description: "The monitor ID to update",
    },
    name: {
      type: "string",
      label: "Name",
      description: "Updated name for the monitor",
      optional: true,
    },
    detectionMode: {
      type: "string",
      label: "Detection Mode",
      description: "How the monitor detects changes: `company_first` monitors specific companies for signals, `signal_first` monitors signals and matches to companies",
      options: [
        {
          label: "Company First",
          value: "company_first",
        },
        {
          label: "Signal First",
          value: "signal_first",
        },
      ],
      optional: true,
    },
    signalTypes: {
      type: "string[]",
      label: "Signal Types",
      description: "Types of signals to monitor",
      options: [
        "jobs",
        "news",
        "advertisements",
      ],
      optional: true,
    },
    destinationType: {
      type: "string",
      label: "Destination Type",
      description: "How to deliver monitor results",
      options: [
        {
          label: "Webhook",
          value: "webhook",
        },
        {
          label: "Email",
          value: "email",
        },
        {
          label: "Sequences",
          value: "sequences",
        },
      ],
      optional: true,
    },
    webhookUrl: {
      type: "string",
      label: "Webhook URL",
      description: "Webhook URL for delivery",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address for delivery",
      optional: true,
    },
    sequenceIdentifier: {
      type: "string",
      label: "Sequence Identifier",
      description: "Outreach sequence identifier",
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
      type: "string[]",
      label: "Companies",
      description: "Company names to monitor",
      optional: true,
    },
    domains: {
      type: "string[]",
      label: "Domains",
      description: "Domains to monitor",
      optional: true,
    },
    linkedinUrls: {
      type: "string[]",
      label: "LinkedIn URLs",
      description: "LinkedIn URLs to monitor",
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
    isActive: {
      type: "boolean",
      label: "Is Active",
      description: "Whether the monitor is active",
      optional: true,
    },
    isPaused: {
      type: "boolean",
      label: "Is Paused",
      description: "Whether the monitor is paused",
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
    if (this.isActive === true && this.isPaused === true) {
      throw new Error("isActive and isPaused cannot both be true");
    }
    const data = {
      monitor_id: this.monitorId,
    };
    if (this.name) data.name = this.name;
    if (this.detectionMode) data.detection_mode = this.detectionMode;
    if (this.signalTypes?.length) data.signal_types = this.signalTypes;
    if (this.destinationType) {
      data.destination_type = this.destinationType;
      if (this.destinationType === "webhook" && !this.webhookUrl) {
        throw new Error("Webhook URL is required when destination type is 'webhook'");
      }
      if (this.destinationType === "email" && !this.email) {
        throw new Error("Email is required when destination type is 'email'");
      }
      if (this.destinationType === "sequences" && !this.sequenceIdentifier) {
        throw new Error("Sequence Identifier is required when destination type is 'sequences'");
      }
    }
    if (this.destinationType === "webhook" && this.webhookUrl) data.webhook_url = this.webhookUrl;
    else if (this.destinationType === "email" && this.email) data.email = this.email;
    else if (this.destinationType === "sequences" && this.sequenceIdentifier) {
      data.sequence_identifier = this.sequenceIdentifier;
    }
    else if (!this.destinationType) {
      if (this.webhookUrl) data.webhook_url = this.webhookUrl;
      if (this.email) data.email = this.email;
      if (this.sequenceIdentifier) data.sequence_identifier = this.sequenceIdentifier;
    }
    if (this.description) data.description = this.description;
    if (this.frequencyMinute != null) data.frequency_minute = this.frequencyMinute;
    if (this.maxDailyTrigger != null) data.max_daily_trigger = this.maxDailyTrigger;
    if (this.maxRecordsPerTrigger != null) data.max_records_per_trigger = this.maxRecordsPerTrigger;
    if (this.companies?.length) data.companies = this.companies;
    if (this.domains?.length) data.domains = this.domains;
    if (this.linkedinUrls?.length) data.linkedin_urls = this.linkedinUrls;
    if (this.companyFilters) {
      data.company_filters = this.pubrio.parseJsonField(this.companyFilters, "company_filters", "object");
    }
    if (this.signalFilters) {
      data.signal_filters = this.pubrio.parseJsonField(this.signalFilters, "signal_filters", "array");
    }
    if (this.peopleEnrichmentConfigs) {
      data.people_enrichment_configs = this.pubrio.parseJsonField(this.peopleEnrichmentConfigs, "people_enrichment_configs", "array");
    }
    if (this.isCompanyEnrichment != null) data.is_company_enrichment = this.isCompanyEnrichment;
    if (this.isPeopleEnrichment != null) data.is_people_enrichment = this.isPeopleEnrichment;
    if (this.isActive != null) data.is_active = this.isActive;
    if (this.isPaused != null) data.is_paused = this.isPaused;
    if (this.maxFailureTrigger != null) {
      if (this.maxFailureTrigger < 1 || this.maxFailureTrigger > 10) {
        throw new Error("Max Failure Trigger must be between 1 and 10");
      }
      data.max_failure_trigger = this.maxFailureTrigger;
    }
    if (this.maxRetryPerTrigger != null) {
      if (this.maxRetryPerTrigger < 0 || this.maxRetryPerTrigger > 3) {
        throw new Error("Max Retry Per Trigger must be between 0 and 3");
      }
      data.max_retry_per_trigger = this.maxRetryPerTrigger;
    }
    if (this.retryDelaySecond != null) {
      if (this.retryDelaySecond < 1 || this.retryDelaySecond > 5) {
        throw new Error("Retry Delay must be between 1 and 5 seconds");
      }
      data.retry_delay_second = this.retryDelaySecond;
    }
    if (this.notificationEmail) data.notification_email = this.notificationEmail;
    const response = await this.pubrio.updateMonitor({
      $,
      data,
    });
    $.export("$summary", `Successfully updated monitor ${this.monitorId}`);
    return response;
  },
};
