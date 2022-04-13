import salesforce from "../../salesforce_rest_api.app.mjs";
import lead from "../../common/sobjects/lead.mjs";
import lodash from "lodash";

export default {
  key: "salesforce_rest_api-salesforce-create-lead",
  name: "Create Lead",
  description: "Creates a lead, which represents a prospect or lead. See [Lead SObject](https://developer.salesforce.com/docs/atlas.en-us.228.0.object_reference.meta/object_reference/sforce_api_objects_lead.htm) and [Create Record](https://developer.salesforce.com/docs/atlas.en-us.228.0.api_rest.meta/api_rest/dome_sobject_create.htm)",
  version: "0.2.2",
  type: "action",
  props: {
    salesforce,
    Company: {
      type: "string",
      label: "Company",
      description: "Required. The lead's company. Note If person account record types have been enabled, and if the value of Company is null, the lead converts to a person account.",
    },
    LastName: {
      type: "string",
      label: "LastName",
      description: "Required. Last name of the lead up to 80 characters.",
    },
    selector: {
      propDefinition: [
        salesforce,
        "fieldSelector",
      ],
      description: `${salesforce.propDefinitions.fieldSelector.description} Lead`,
      options: () => Object.keys(lead),
      reloadProps: true,
    },
  },
  async additionalProps() {
    return this.salesforce.additionalProps(this.selector, lead);
  },
  async run({ $ }) {
    const data = lodash.pickBy(lodash.pick(this, [
      "Company",
      "LastName",
      ...this.selector,
    ]));
    const response = await this.salesforce.createLead({
      $,
      data,
    });
    $.export("$summary", `Created lead for ${this.Company}`);
    return response;
  },
};
