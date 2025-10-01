import app from "../../cloze.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "cloze-create-update-company",
  name: "Create Or Update Company",
  description: "Create a new company or enhance an existing company within Cloze. Companies can be created with just a domain name or both a name and another unique identifier such as a phone number and email address. [See the documentation](https://api.cloze.com/api-docs/#!/Relations_-_Companies/post_v1_companies_create).",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    name: {
      type: "string",
      label: "Company Name",
      description: "The name of the company.",
      optional: true,
    },
    emails: {
      type: "string[]",
      label: "Emails",
      description: "The emails of the company. Each email should be a JSON object with `value` key. [See the documentation](https://api.cloze.com/api-docs/#!/Relations_-_Companies/post_v1_companies_create).",
      optional: true,
    },
    phones: {
      type: "string[]",
      label: "Phones",
      description: "The phones of the company. Each phone should be a JSON object with `value` key. [See the documentation](https://api.cloze.com/api-docs/#!/Relations_-_Companies/post_v1_companies_create).",
      optional: true,
    },
    domains: {
      type: "string[]",
      label: "Domains",
      description: "The domains of the company.",
      optional: true,
    },
    segment: {
      type: "string",
      label: "Segment",
      description: "The segment of the company.",
      optional: true,
      options: [
        "customer",
        "partner",
        "supplier",
        "investor",
        "advisor",
        "competitor",
        "custom1",
        "custom2",
        "custom3",
        "custom4",
        "custom5",
        "coworker",
        "family",
        "friend",
        "network",
        "personal1",
        "personal2",
      ],
    },
    step: {
      type: "string",
      label: "Step",
      description: "Unique Id of Next Step",
      optional: true,
    },
    stage: {
      type: "string",
      label: "Stage",
      description: "The stage of the company.",
      optional: true,
      options: [
        {
          label: "Lead Stage",
          value: "lead",
        },
        {
          label: "Potential Stage",
          value: "future",
        },
        {
          label: "Active Stage",
          value: "current",
        },
        {
          label: "Inactive Stage",
          value: "past",
        },
        {
          label: "Lost Stage",
          value: "out",
        },
      ],
    },
    assignTo: {
      type: "string",
      label: "Assign To",
      description: "Assign this company to this team member.",
      optional: true,
    },
    additionalData: {
      type: "object",
      label: "Additional Data",
      description: "Additional details for the company in JSON format. [See the documentation](https://api.cloze.com/api-docs/#!/Relations_-_Companies/post_v1_companies_create).",
      optional: true,
    },
  },
  methods: {
    createCompany(args = {}) {
      return this.app.post({
        path: "/companies/create",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createCompany,
      name,
      emails,
      phones,
      domains,
      segment,
      step,
      stage,
      assignTo,
      additionalData,
    } = this;

    const response = await createCompany({
      $,
      data: {
        name,
        emails: utils.parseArray(emails),
        phones: utils.parseArray(phones),
        domains,
        segment,
        step,
        stage,
        assignTo,
        ...additionalData,
      },
    });

    $.export("$summary", "Successfully created/updated company.");
    return response;
  },
};
