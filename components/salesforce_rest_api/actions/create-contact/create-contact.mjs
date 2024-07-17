import common, { getProps } from "../common/base.mjs";
import contact from "../../common/sobjects/contact.mjs";

export const docsLink = "https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_contact.htm";

export default {
  ...common,
  key: "salesforce_rest_api-create-contact",
  name: "Create Contact",
  description: `Creates a contact. [See the documentation](${docsLink})`,
  version: "0.3.{{ts}}",
  type: "action",
  methods: {
    ...common.methods,
    getAdvancedProps() {
      return contact.extraProps;
    },
  },
  props: getProps({
    objType: contact,
    docsLink,
  }),
  async run({ $ }) {
    /* eslint-disable no-unused-vars */
    const {
      salesforce, useAdvancedProps, docsInfo, additionalFields, Birthdate, ...data
    } = this;
    /* eslint-enable no-unused-vars */
    const response = await salesforce.createContact({
      $,
      data: {
        ...data,
        ...this.formatDateTimeProps({
          Birthdate,
        }),
        ...this.getAdditionalFields(),
      },
    });
    $.export("$summary", `Successfully created contact "${this.LastName}"`);
    return response;
  },
};
