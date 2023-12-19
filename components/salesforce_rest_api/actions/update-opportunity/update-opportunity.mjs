import common from "../common/base.mjs";
import opportunity from "../../common/sobjects/opportunity.mjs";
import {
  pickBy, pick,
} from "lodash-es";
import { toSingleLineString } from "../../common/utils.mjs";

const { salesforce } = common.props;

export default {
  ...common,
  key: "salesforce_rest_api-update-opportunity",
  name: "Update Opportunity",
  description: toSingleLineString(`
    Updates an opportunity, which represents an opportunity, which is a sale or pending deal.
    See [Opportunity SObject](https://developer.salesforce.com/docs/atlas.en-us.228.0.object_reference.meta/object_reference/sforce_api_objects_opportunity.htm)
    and [Update Record](https://developer.salesforce.com/docs/atlas.en-us.228.0.api_rest.meta/api_rest/dome_update_fields.htm)
  `),
  version: "0.2.5",
  type: "action",
  props: {
    salesforce,
    OpportunityId: {
      type: "string",
      label: "Opportunity ID",
      description: "ID of the Opportunity to update.",
    },
    CloseDate: {
      type: "string",
      label: "CloseDate",
      description: "Date when the opportunity is expected to close.",
      optional: true,
    },
    Name: {
      type: "string",
      label: "Name",
      description: "A name for this opportunity. Limit: 120 characters.",
      optional: true,
    },
    StageName: {
      type: "string",
      label: "StageName",
      description: "Current stage of this record. The StageName field controls several other fields on an opportunity. Each of the fields can be directly set or implied by changing the StageName field. In addition, the StageName field is a picklist, so it has additional members in the returned describeSObjectResult to indicate how it affects the other fields. To obtain the stage name values in the picklist, query the OpportunityStage object. If the StageName is updated, then the ForecastCategoryName, IsClosed, IsWon, and Probability are automatically updated based on the stage-category mapping.",
      optional: true,
    },
    selector: {
      propDefinition: [
        salesforce,
        "fieldSelector",
      ],
      description: `${salesforce.propDefinitions.fieldSelector.description} Opportunity`,
      options: () => Object.keys(opportunity),
      reloadProps: true,
    },
  },
  additionalProps() {
    return this.additionalProps(this.selector, opportunity);
  },
  async run({ $ }) {
    const data = pickBy(pick(this, [
      "OpportunityId",
      "CloseDate",
      "Name",
      "StageName",
      ...this.selector,
    ]));
    const response = await this.salesforce.updateOpportunity({
      $,
      id: this.OpportunityId,
      data,
    });
    $.export("$summary", `Successfully updated opportunity ${this.OpportunityId}`);
    return response;
  },
};
