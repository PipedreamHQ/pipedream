import app from "../../salesflare.app.mjs";
import utils from "../../common/utils.mjs";
import opportunityProps from "../common/opportunity-props.mjs";

export default {
  key: "salesflare-create-opportunity",
  version: "0.0.1",
  type: "action",
  name: "Create Opprtunity",
  description: "Create opportunity. [See the docs here](https://api.salesflare.com/docs#operation/postOpportunities)",
  props: {
    app,
    owner: {
      propDefinition: [
        app,
        "userId",
      ],
    },
    account: {
      propDefinition: [
        app,
        "accountIds",
      ],
      label: "Account ID",
      type: "integer",
      description: "Account ID",
      optional: false,
    },
    currency: {
      propDefinition: [
        app,
        "currency",
      ],
    },
    ...opportunityProps,
  },
  async run ({ $ }) {
    const pairs = {
      startDate: "start_date",
      closeDate: "close_date",
      recurringPricePerUnit: "recurring_price_per_unit",
      contractStartDate: "contract_start_date",
      contractEndDate: "contract_end_date",
    };
    const data = utils.extractProps(this, pairs);
    const resp = await this.app.createOpportunity({
      $,
      data,
    });
    $.export("$summary", `Opportunity(ID:${resp.id}) has been created successfully.`);
    return resp;
  },
};
