import chartmogul from "../../chartmogul.app.mjs";

export default {
  key: "chartmogul-update-customer",
  name: "Update Customer",
  version: "0.0.4",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Updates certain modifiable attributes of a `customer` object in your ChartMogul account. [See the docs here](https://dev.chartmogul.com/reference/update-a-customer)",
  type: "action",
  props: {
    chartmogul,
    customerId: {
      propDefinition: [
        chartmogul,
        "customerId",
      ],
    },
    name: {
      propDefinition: [
        chartmogul,
        "name",
      ],
      optional: true,
    },
    email: {
      propDefinition: [
        chartmogul,
        "email",
      ],
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "The new status of the customer.",
      options: [
        "New Lead",
        "Working Lead",
        "Qualified Lead",
        "Unqualified Lead",
        "Active",
        "Past Due",
        "Cancelled",
      ],
      optional: true,
    },
    company: {
      propDefinition: [
        chartmogul,
        "company",
      ],
      optional: true,
    },
    country: {
      propDefinition: [
        chartmogul,
        "country",
      ],
      optional: true,
    },
    state: {
      propDefinition: [
        chartmogul,
        "state",
      ],
      optional: true,
    },
    city: {
      propDefinition: [
        chartmogul,
        "city",
      ],
      optional: true,
    },
    zip: {
      propDefinition: [
        chartmogul,
        "zip",
      ],
      optional: true,
    },
    leadCreatedAt: {
      propDefinition: [
        chartmogul,
        "leadCreatedAt",
      ],
      optional: true,
    },
    freeTrialStartedAt: {
      propDefinition: [
        chartmogul,
        "freeTrialStartedAt",
      ],
      optional: true,
    },
    tags: {
      propDefinition: [
        chartmogul,
        "tags",
      ],
      optional: true,
    },
    custom: {
      propDefinition: [
        chartmogul,
        "custom",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      customerId,
      name,
      email,
      status,
      company,
      country,
      state,
      city,
      zip,
      leadCreatedAt,
      freeTrialStartedAt,
      tags,
      custom,
    } = this;

    const response = await this.chartmogul.updateCustomer({
      $,
      customerId,
      name,
      email,
      status,
      company,
      country,
      state,
      city,
      zip,
      lead_created_at: leadCreatedAt,
      free_trial_started_at: freeTrialStartedAt,
      attributes: {
        tags,
        custom: custom && custom.map((item) => JSON.parse(item)),
      },
    });

    $.export("$summary", `Customer Successfully updated with ID ${response.id}`);
    return response;
  },
};
