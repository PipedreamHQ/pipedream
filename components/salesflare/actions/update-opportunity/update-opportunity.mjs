import app from "../../salesflare.app.mjs";
import utils from "../../common/utils.mjs";
import opportunityProps from "../common/opportunity-props.mjs";

export default {
  key: "salesflare-update-opportunity",
  version: "0.0.1",
  type: "action",
  name: "Update Opportunity",
  description: "Update an Opportunity [See the docs here](https://api.salesflare.com/docs#operation/putOpportunitiesId)",
  props: {
    app,
    opportunityId: {
      propDefinition: [
        app,
        "opportunityId",
      ],
      optional: false,
    },
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
    const resp = await this.app.updateOpportunity({
      $,
      opportunityId: this.opportunityId,
      data,
    });

    $.export("$summary", "The opportunity has been updated successfully.");
    return resp;
  },
};
