import utils from "../../common/utils.mjs";
import base from "../common/opportunity-base.mjs";

export default {
  key: "salesflare-update-opportunity",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  name: "Update Opportunity",
  description: "Update an Opportunity [See the docs here](https://api.salesflare.com/docs#operation/putOpportunitiesId)",
  props: {
    app: base.props.app,
    opportunityId: {
      propDefinition: [
        base.props.app,
        "opportunityId",
      ],
      optional: false,
    },
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
    const resp = await this.app.updateOpportunity({
      $,
      opportunityId: this.opportunityId,
      data,
    });

    $.export("$summary", "The opportunity has been updated successfully.");
    return resp;
  },
};
