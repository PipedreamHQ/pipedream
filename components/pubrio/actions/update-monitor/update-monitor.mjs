import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-update-monitor",
  name: "Update Monitor",
  description: "Update an existing signal monitor. [See the documentation](https://docs.pubrio.com)",
  version: "0.0.1",
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
      description: "Whether to detect new signals only or new and updated",
      options: ["new", "new_and_updated"],
      optional: true,
    },
    signalTypes: {
      type: "string[]",
      label: "Signal Types",
      description: "Types of signals to monitor",
      options: ["jobs", "news", "advertisements"],
      optional: true,
    },
    destinationType: {
      type: "string",
      label: "Destination Type",
      description: "How to deliver monitor results",
      options: ["webhook", "email", "outreach_sequence"],
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
  },
  async run({ $ }) {
    const data = {
      monitor_id: this.monitorId,
    };
    if (this.name) data.name = this.name;
    if (this.detectionMode) data.detection_mode = this.detectionMode;
    if (this.signalTypes?.length) data.signal_types = this.signalTypes;
    if (this.destinationType) data.destination_type = this.destinationType;
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
    const response = await this.pubrio.makeRequest({
      $,
      method: "POST",
      url: "/monitors/update",
      data,
    });
    $.export("$summary", "Successfully updated monitor");
    return response;
  },
};
