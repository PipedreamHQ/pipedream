import app from "../../pro_ledger.app.mjs";

export default {
  key: "pro_ledger-create-record",
  name: "Create Record",
  description: "Create a new record in the Pro Ledger platform. [See the documentation](https://api.pro-ledger.com/redoc#tag/record/operation/create_new_record_api_v1_record_create_new_record_post)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    rec: {
      propDefinition: [
        app,
        "rec",
      ],
    },
    class: {
      propDefinition: [
        app,
        "class",
      ],
    },
    category: {
      propDefinition: [
        app,
        "category",
      ],
    },
    account: {
      propDefinition: [
        app,
        "account",
      ],
    },
    source: {
      propDefinition: [
        app,
        "source",
      ],
    },
    total: {
      propDefinition: [
        app,
        "total",
      ],
    },
    taxIncluded: {
      propDefinition: [
        app,
        "taxIncluded",
      ],
    },
    transactionType: {
      propDefinition: [
        app,
        "transactionType",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.createRecord({
      $,
      params: {
        transactionType: this.transactionType,
      },
      data: {
        job_id: this.jobID,
        rec: this.rec,
        class: this.class,
        category: JSON.stringify(this.category),
        account: this.account,
        source: this.source,
        total: this.total,
        taxIncluded: this.taxIncluded,
      },
    });

    $.export("$summary", `Successfully created record with ID: '${response.data.id}'`);

    return response;
  },
};
