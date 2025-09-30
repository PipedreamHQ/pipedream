import utils from "../../common/utils.mjs";
import base from "../common/opportunity-base.mjs";

export default {
  key: "salesflare-create-opportunity",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  name: "Create Opprtunity",
  description: "Create opportunity. [See the docs here](https://api.salesflare.com/docs#operation/postOpportunities)",
  props: {
    app: base.props.app,
    owner: {
      propDefinition: [
        base.props.app,
        "userId",
      ],
    },
    account: {
      propDefinition: [
        base.props.app,
        "accountIds",
      ],
      label: "Account ID",
      type: "integer",
      description: "Account ID",
      optional: false,
    },
    currency: {
      propDefinition: [
        base.props.app,
        "currency",
      ],
    },
    ...base.props,
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
    $.export("$summary", `Opportunity (ID: ${resp.id}) has been created successfully.`);
    return resp;
  },
};
