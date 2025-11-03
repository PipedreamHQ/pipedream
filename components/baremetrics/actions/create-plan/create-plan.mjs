import app from "../../baremetrics.app.mjs";

export default {
  key: "baremetrics-create-plan",
  name: "Create Plan",
  description: "Create a plan. [See the documentation](https://developers.baremetrics.com/reference/create-plan)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    sourceId: {
      propDefinition: [
        app,
        "sourceId",
      ],
    },
    oid: {
      propDefinition: [
        app,
        "oid",
      ],
    },
    name: {
      propDefinition: [
        app,
        "name",
      ],
      optional: false,
      description: "Name of the Plan",
    },
    currency: {
      propDefinition: [
        app,
        "currency",
      ],
    },
    amount: {
      propDefinition: [
        app,
        "amount",
      ],
    },
    interval: {
      propDefinition: [
        app,
        "interval",
      ],
    },
    intervalCount: {
      propDefinition: [
        app,
        "intervalCount",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createPlan({
      $,
      source_id: this.sourceId,
      data: {
        name: this.name,
        currency: this.currency,
        amount: this.amount,
        interval: this.interval,
        interval_count: this.intervalCount,
        oid: this.oid,
      },
    });

    $.export("$summary", `Successfully created the plan with the ID '${this.oid}'`);

    return response;
  },
};
