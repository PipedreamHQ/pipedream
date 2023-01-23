import salesforce from "../../salesforce_rest_api.app.mjs";
import contact from "../../common/sobjects/contact.mjs";
import {
  pickBy, pick,
} from "lodash-es";
import { toSingleLineString } from "../../common/utils.mjs";

export default {
  key: "salesforce_rest_api-update-contact",
  name: "Update Contact",
  description: toSingleLineString(`
    Updates a Contact, which is a person associated with an account.
    See [Contact SObject](https://developer.salesforce.com/docs/atlas.en-us.228.0.object_reference.meta/object_reference/sforce_api_objects_contact.htm)
    and [Update Record](https://developer.salesforce.com/docs/atlas.en-us.228.0.api_rest.meta/api_rest/dome_update_fields.htm)
  `),
  version: "0.2.4",
  type: "action",
  props: {
    salesforce,
    ContactId: {
      type: "string",
      label: "Contact ID",
      description: "ID of the Contact to update.",
    },
    LastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the contact up to 80 characters.",
      optional: true,
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
    const data = pickBy(pick(this, [
      "ContactId",
      "LastName",
      ...this.selector,
    ]));
    const response = await this.salesforce.updateContact({
      $,
      id: this.ContactId,
      data,
    });
    $.export("$summary", `Successfully updated contact for ${this.ContactId}`);
    return response;
  },
};
