import whatconverts from "../../whatconverts.app.mjs";

export default {
  key: "whatconverts-find-lead",
  name: "Find Lead",
  description: "Find a lead in WhatConverts. [See the documentation](https://www.whatconverts.com/api/leads/#get-all-leads)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    whatconverts,
    accountId: {
      propDefinition: [
        whatconverts,
        "accountId",
      ],
    },
    profileId: {
      propDefinition: [
        whatconverts,
        "profileId",
        (c) => ({
          accountId: c.accountId,
        }),
      ],
    },
    leadType: {
      propDefinition: [
        whatconverts,
        "leadType",
      ],
    },
    leadStatus: {
      type: "string",
      label: "Lead Status",
      description: "Lead status to return for this request",
      options: [
        "repeat",
        "unique",
      ],
      optional: true,
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "Start date for this request in date or date/time ISO 8601 format (UTC); `2015-11-10` or `2015-11-10T00:00:00Z`. Date range can include up to 400 days.",
      optional: true,
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "End date for this request in date or date/time ISO 8601 format (UTC); `2015-11-10` or `2015-11-10T00:00:00Z`. Date range can include up to 400 days.",
      optional: true,
    },
    order: {
      type: "string",
      label: "Order",
      description: "Order in which to return the leads by date created",
      options: [
        "asc",
        "desc",
      ],
      optional: true,
    },
    quotable: {
      type: "string",
      label: "Quotable",
      description: "Quotable type to return for this request",
      options: [
        "yes",
        "no",
        "pending",
        "not_set",
      ],
      optional: true,
    },
    quoteValue: {
      type: "string",
      label: "Quote Value",
      description: "Return leads that have a quote value",
      options: [
        "has_value",
        "no_value",
      ],
      optional: true,
    },
    salesValue: {
      type: "string",
      label: "Sales Value",
      description: "Return leads that have a sales value",
      options: [
        "has_value",
        "no_value",
      ],
      optional: true,
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "Return leads for the contacts that have this E.164 formatted phone number",
      optional: true,
    },
    emailAddress: {
      type: "string",
      label: "Email Address",
      description: "Return leads for the contact that have this email address",
      optional: true,
    },
    spam: {
      type: "boolean",
      label: "Spam",
      description: "If `true` will return only spam leads",
      optional: true,
    },
    duplicate: {
      type: "boolean",
      label: "Duplicate",
      description: "If true will return only duplicate leads",
      optional: true,
    },
    leadSource: {
      type: "string",
      label: "Lead Source",
      description: "Return leads that have this lead source",
      optional: true,
    },
    leadMedium: {
      type: "string",
      label: "Lead Medium",
      description: "Return leads that have this lead medium",
      optional: true,
    },
    leadCampaign: {
      type: "string",
      label: "Lead Campaign",
      description: "Return leads that have this lead campaign",
      optional: true,
    },
    leadContent: {
      type: "string",
      label: "Lead Content",
      description: "Return leads that have this lead content",
      optional: true,
    },
    leadKeyword: {
      type: "string",
      label: "Lead Keyword",
      description: "Return leads that have this lead keyword",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of results to return. Default: 100, Maximum: 2500",
      optional: true,
      default: 100,
    },
  },
  async run({ $ }) {
    const { leads } = await this.whatconverts.listLeads({
      $,
      params: {
        profile_id: this.profileId,
        lead_type: this.leadType,
        lead_status: this.leadStatus,
        start_date: this.startDate,
        end_date: this.endDate,
        order: this.order,
        quotable: this.quotable,
        quote_value: this.quoteValue,
        sales_value: this.salesValue,
        phone_number: this.phoneNumber,
        email_address: this.emailAddress,
        spam: this.spam,
        duplicate: this.duplicate,
        lead_source: this.leadSource,
        lead_medium: this.leadMedium,
        lead_campaign: this.leadCampaign,
        lead_content: this.leadContent,
        lead_keyword: this.leadKeyword,
        leads_per_page: this.maxResults,
      },
    });

    $.export("$summary", `Found ${leads.length} lead${leads.length === 1
      ? ""
      : "s"}`);
    return leads;
  },
};
