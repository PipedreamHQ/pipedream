import app from "../../hunter.app.mjs";

export default {
  key: "hunter-list-leads",
  name: "List Leads",
  description: "List all your leads with comprehensive filtering options. The leads are returned in sorted order, with the most recent leads appearing first. [See the documentation](https://hunter.io/api-documentation/v2#leads).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    leadsListId: {
      propDefinition: [
        app,
        "leadsListId",
      ],
      description: "Only returns the leads belonging to this list.",
      optional: true,
    },
    email: {
      propDefinition: [
        app,
        "email",
      ],
      description: "Filter leads by email. Use `*` for any value, `~` for empty, or specific email.",
      optional: true,
    },
    firstName: {
      propDefinition: [
        app,
        "firstName",
      ],
      description: "Filter leads by first name. Use `*` for any value, `~` for empty, or specific name.",
      optional: true,
    },
    lastName: {
      propDefinition: [
        app,
        "lastName",
      ],
      description: "Filter leads by last name. Use `*` for any value, `~` for empty, or specific name.",
      optional: true,
    },
    position: {
      propDefinition: [
        app,
        "position",
      ],
      description: "Filter leads by position. Use `*` for any value, `~` for empty, or specific position.",
      optional: true,
    },
    company: {
      propDefinition: [
        app,
        "company",
      ],
      description: "Filter leads by company. Use `*` for any value, `~` for empty, or specific company.",
      optional: true,
    },
    industry: {
      propDefinition: [
        app,
        "industry",
      ],
      description: "Filter leads by industry. Use `*` for any value, `~` for empty, or specific industry.",
      optional: true,
    },
    website: {
      propDefinition: [
        app,
        "website",
      ],
      description: "Filter leads by website. Use `*` for any value, `~` for empty, or specific website.",
      optional: true,
    },
    countryCode: {
      propDefinition: [
        app,
        "countryCode",
      ],
      description: "Filter leads by country code (ISO 3166-1 alpha-2). Use `*` for any value, `~` for empty.",
      optional: true,
    },
    companySize: {
      propDefinition: [
        app,
        "companySize",
      ],
      description: "Filter leads by company size. Use `*` for any value, `~` for empty, or specific size.",
      optional: true,
    },
    source: {
      propDefinition: [
        app,
        "source",
      ],
      description: "Filter leads by source. Use `*` for any value, `~` for empty, or specific source.",
      optional: true,
    },
    twitter: {
      propDefinition: [
        app,
        "twitter",
      ],
      description: "Filter leads by Twitter handle. Use `*` for any value, `~` for empty, or specific handle.",
      optional: true,
    },
    linkedinUrl: {
      propDefinition: [
        app,
        "linkedinUrl",
      ],
      description: "Filter leads by LinkedIn URL. Use `*` for any value, `~` for empty, or specific URL.",
      optional: true,
    },
    phoneNumber: {
      propDefinition: [
        app,
        "phoneNumber",
      ],
      description: "Filter leads by phone number. Use `*` for any value, `~` for empty, or specific number.",
      optional: true,
    },
    syncStatus: {
      type: "string",
      label: "Sync Status",
      description: "Only returns the leads matching this synchronization status.",
      options: [
        "pending",
        "error",
        "success",
      ],
      optional: true,
    },
    sendingStatus: {
      type: "string[]",
      label: "Sending Status",
      description: "Only returns the leads matching these sending status(es).",
      options: [
        "clicked",
        "opened",
        "sent",
        "pending",
        "error",
        "bounced",
        "unsubscribed",
        "replied",
        {
          value: "~",
          label: "unset",
        },
      ],
      optional: true,
    },
    verificationStatus: {
      type: "string[]",
      label: "Verification Status",
      description: "Only returns the leads matching these verification status(es).",
      options: [
        "accept_all",
        "disposable",
        "invalid",
        "unknown",
        "valid",
        "webmail",
        "pending",
      ],
      optional: true,
    },
    lastActivityAt: {
      type: "string",
      label: "Last Activity",
      description: "Only returns the leads matching this last activity.",
      options: [
        {
          value: "*",
          label: "any",
        },
        {
          value: "~",
          label: "unset",
        },
      ],
      optional: true,
    },
    lastContactedAt: {
      type: "string",
      label: "Last Contacted",
      description: "Only returns the leads matching this last contact date.",
      options: [
        {
          value: "*",
          label: "any",
        },
        {
          value: "~",
          label: "unset",
        },
      ],
      optional: true,
    },
    query: {
      type: "string",
      label: "Query",
      description: "Only returns the leads with **First Name**, **Last Name**, or **Email** matching the query.",
      optional: true,
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
      description: "A limit on the number of leads to be returned. Limit can range between `1` and `1,000`. Default is `20`.",
      min: 1,
      max: 1000,
    },
  },
  async run({ $ }) {
    const {
      app,
      leadsListId,
      email,
      firstName,
      lastName,
      position,
      company,
      industry,
      website,
      countryCode,
      companySize,
      source,
      twitter,
      linkedinUrl,
      phoneNumber,
      syncStatus,
      sendingStatus,
      verificationStatus,
      lastActivityAt,
      lastContactedAt,
      query,
      limit,
    } = this;

    const response = await app.listLeads({
      $,
      params: {
        limit,
        leads_list_id: leadsListId,
        email,
        first_name: firstName,
        last_name: lastName,
        position,
        company,
        industry,
        website,
        country_code: countryCode,
        company_size: companySize,
        source,
        twitter,
        linkedin_url: linkedinUrl,
        phone_number: phoneNumber,
        sync_status: syncStatus,
        query,
        last_activity_at: lastActivityAt,
        last_contacted_at: lastContactedAt,
        ...(Array.isArray(sendingStatus) && sendingStatus.length && {
          ["sending_status[]"]: sendingStatus,
        }),
        ...(Array.isArray(verificationStatus) && verificationStatus.length && {
          ["verification_status[]"]: verificationStatus,
        }),
      },
    });

    $.export("$summary", "Successfully retrieved leads");
    return response;
  },
};
