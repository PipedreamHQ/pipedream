import app from "../../baremetrics.app.mjs";

export default {
  key: "baremetrics-create-subscription",
  name: "Create Subscription",
  description: "Subscribe a client to a plan. [See the documentation](https://developers.baremetrics.com/reference/create-subscription)",
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
    customerOid: {
      propDefinition: [
        app,
        "customerOid",
        (c) => ({
          sourceId: c.sourceId,
        }),
      ],
    },
    planOid: {
      propDefinition: [
        app,
        "planOid",
        (c) => ({
          sourceId: c.sourceId,
        }),
      ],
    },
    startedAt: {
      propDefinition: [
        app,
        "startedAt",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createSubscription({
      $,
      source_id: this.sourceId,
      data: {
        started_at: this.startedAt,
        oid: this.oid,
        customer_oid: this.customerOid,
        plan_oid: this.planOid,
      },
    });

    $.export("$summary", `Successfully subscribed customer with ID '${this.customerOid}' to the plan with ID '${this.planOid}'`);

    return response;
  },
};
