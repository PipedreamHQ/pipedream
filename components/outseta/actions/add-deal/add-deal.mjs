import app from "../../outseta.app.mjs";

export default {
  key: "outseta-add-deal",
  name: "Add Deal",
  description: "Add a new deal record to CRM. [See the documentation](https://documenter.getpostman.com/view/3613332/outseta-rest-api-v1/7TNfr6k#115dec74-85a4-f825-ff76-f12adddb652c)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the deal to be added",
    },
    dealPipelineStage: {
      propDefinition: [
        app,
        "dealPipelineStage",
      ],
    },
    amount: {
      type: "integer",
      label: "Amount",
      description: "Deal's amount",
      optional: true,
    },
    dealPeople: {
      propDefinition: [
        app,
        "person",
      ],
      optional: true,
    },
    account: {
      propDefinition: [
        app,
        "account",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      Name: this.name,
      DealPipelineStage: {
        Uid: this.dealPipelineStage,
      },
      Amount: this.amount,
      Account: this.account && {
        Uid: this.account,
      },
      DealPeople: this.dealPeople && [
        {
          Person: {
            Uid: this.dealPeople,
          },
        },
      ],
    };

    const response = await this.app.addDeal({
      $,
      data,
    });

    $.export("$summary", `Successfully added a deal with UID: ${response.Uid}`);
    return response;
  },
};
