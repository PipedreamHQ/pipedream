import common, { getProps } from "../common/base-create-update.mjs";
import contact from "../../common/sobjects/contact.mjs";

export const docsLink = "https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_contact.htm";

export default {
  ...common,
  key: "salesforce_rest_api-create-contact",
  name: "Create Contact",
  description: `Creates a contact. [See the documentation](${docsLink})`,
  version: "0.3.3",
  type: "action",
  methods: {
    ...common.methods,
    getObjectType() {
      return "Contact";
    },
    getAdvancedProps() {
      return contact.extraProps;
    },
  },
  props: getProps({
    objType: contact,
    docsLink,
    showDateInfo: true,
  }),
  async run({ $ }) {
    /* eslint-disable no-unused-vars */
    const {
      salesforce,
      getAdvancedProps,
      getObjectType,
      getAdditionalFields,
      formatDateTimeProps,
      useAdvancedProps,
      docsInfo,
      dateInfo,
      additionalFields,
      Birthdate,
      ...data
    } = this;
    /* eslint-enable no-unused-vars */
    const response = await salesforce.createRecord("Contact", {
      $,
      data: {
        ...data,
        ...formatDateTimeProps({
          Birthdate,
        }),
        ...getAdditionalFields(),
      },
    });
    $.export("$summary", `Successfully created contact "${this.LastName}"`);
    return response;
  },
};
