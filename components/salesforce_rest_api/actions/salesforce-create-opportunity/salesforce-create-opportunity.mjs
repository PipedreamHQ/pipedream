import salesforce from "../../salesforce_rest_api.app.mjs";
import opportunity from "../../common/sobjects/opportunity.mjs";
import lodash from "lodash";

export default {
  key: "salesforce_rest_api-salesforce-create-opportunity",
  name: "Create Opportunity",
  description: "Creates an opportunity, which represents an opportunity, which is a sale or pending deal. See [Opportunity SObject](https://developer.salesforce.com/docs/atlas.en-us.228.0.object_reference.meta/object_reference/sforce_api_objects_opportunity.htm) and [Create Record](https://developer.salesforce.com/docs/atlas.en-us.228.0.api_rest.meta/api_rest/dome_sobject_create.htm)",
  version: "0.2.2",
  type: "action",
  props: {
    salesforce,
    CloseDate: {
      type: "string",
      label: "CloseDate",
      description: "Date when the opportunity is expected to close.",
    },
    Name: {
      type: "string",
      label: "Name",
      description: "A name for this opportunity. Limit: 120 characters.",
    },
    StageName: {
      type: "string",
      label: "StageName",
      description: "Current stage of this record. The StageName field controls several other fields on an opportunity. Each of the fields can be directly set or implied by changing the StageName field. In addition, the StageName field is a picklist, so it has additional members in the returned describeSObjectResult to indicate how it affects the other fields. To obtain the stage name values in the picklist, query the OpportunityStage object. If the StageName is updated, then the ForecastCategoryName, IsClosed, IsWon, and Probability are automatically updated based on the stage-category mapping.",
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
  async additionalProps() {
    return this.salesforce.additionalProps(this.selector, opportunity);
  },
  async run({ $ }) {
    const data = lodash.pickBy(lodash.pick(this, [
      "CloseDate",
      "Name",
      "StageName",
      ...this.selector,
    ]));
    const response = await this.salesforce.createOpportunity({
      $,
      data,
    });
    $.export("$summary", `Created opportunity "${this.Name}"`);
    return response;
  },
};
