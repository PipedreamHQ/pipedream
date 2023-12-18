import common from "../common/base.mjs";
import contact from "../../common/sobjects/contact.mjs";
import {
  pickBy, pick,
} from "lodash-es";
import { toSingleLineString } from "../../common/utils.mjs";

const { salesforce } = common.props;

export default {
  ...common,
  key: "salesforce_rest_api-create-contact",
  name: "Create Contact",
  description: toSingleLineString(`
    Creates a Contact, which is a person associated with an account.
    See [Contact SObject](https://developer.salesforce.com/docs/atlas.en-us.228.0.object_reference.meta/object_reference/sforce_api_objects_contact.htm)
    and [Create Record](https://developer.salesforce.com/docs/atlas.en-us.228.0.api_rest.meta/api_rest/dome_sobject_create.htm)
  `),
  version: "0.2.5",
  type: "action",
  props: {
    salesforce,
    LastName: {
      type: "string",
      label: "Last name",
      description: "Last name of the contact up to 80 characters.",
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
  additionalProps() {
    return this.additionalProps(this.selector, contact);
  },
  async run({ $ }) {
    const data = pickBy(pick(this, [
      "LastName",
      ...this.selector,
    ]));
    const response = await this.salesforce.createContact({
      $,
      data,
    });
    $.export("$summary", `Successfully created contact "${this.LastName}"`);
    return response;
  },
};
