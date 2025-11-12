import chartmogul from "../../chartmogul.app.mjs";

export default {
  key: "chartmogul-create-customer",
  name: "Create Customer",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Creates a `customer` object in ChartMogul under the specified `data_source` [See the docs here](https://dev.chartmogul.com/reference/create-customer)",
  type: "action",
  props: {
    chartmogul,
    dataSourceId: {
      propDefinition: [
        chartmogul,
        "dataSourceId",
      ],
    },
    externalId: {
      propDefinition: [
        chartmogul,
        "externalId",
      ],
    },
    name: {
      propDefinition: [
        chartmogul,
        "name",
      ],
    },
    email: {
      propDefinition: [
        chartmogul,
        "email",
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
    source: {
      propDefinition: [
        chartmogul,
        "source",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      dataSourceId,
      externalId,
      name,
      email,
      company,
      country,
      state,
      city,
      zip,
      leadCreatedAt,
      freeTrialStartedAt,
      tags,
      custom,
      source,
    } = this;

    const response = await this.chartmogul.createCustomer({
      $,
      data_source_uuid: dataSourceId,
      external_id: externalId,
      name,
      email,
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
      source,
    });

    $.export("$summary", `Customer Successfully created with ID ${response.id}`);
    return response;
  },
};
