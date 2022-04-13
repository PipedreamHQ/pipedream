import salesforce from "../../salesforce_rest_api.app.mjs";
import contact from "../../common/sobjects/contact.mjs";
import lodash from "lodash";

export default {
  key: "salesforce_rest_api-salesforce-create-contact",
  name: "Create Contact",
  description: "Creates a Contact, which is a person associated with an account. See [Contact SObject](https://developer.salesforce.com/docs/atlas.en-us.228.0.object_reference.meta/object_reference/sforce_api_objects_contact.htm) and [Create Record](https://developer.salesforce.com/docs/atlas.en-us.228.0.api_rest.meta/api_rest/dome_sobject_create.htm)",
  version: "0.2.2",
  type: "action",
  props: {
    salesforce,
    LastName: {
      type: "string",
      label: "LastName",
      description: "Required. Last name of the contact up to 80 characters.",
    },
    selector: {
      propDefinition: [
        salesforce,
        "fieldSelector",
      ],
      description: `${salesforce.propDefinitions.fieldSelector.description} Contact`,
      options: () => Object.keys(contact),
      reloadProps: true,
    },
  },
  async additionalProps() {
    return this.salesforce.additionalProps(this.selector, contact);
  },
  async run({ $ }) {
    const data = lodash.pickBy(lodash.pick(this, [
      "LastName",
      ...this.selector,
    ]));
    const response = await this.salesforce.createContact({
      $,
      data,
    });
    $.export("$summary", `Created contact "${this.LastName}"`);
    return response;
  },
};
