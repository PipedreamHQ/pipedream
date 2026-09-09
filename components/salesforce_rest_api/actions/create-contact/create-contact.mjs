import common, { getProps } from "../common/base-create-update.mjs";
import contact from "../../common/sobjects/contact.mjs";

export const docsLink = "https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_contact.htm";

export default {
  ...common,
  key: "salesforce_rest_api-create-contact",
  name: "Create Contact",
  description: "Create a Salesforce contact (a person associated with an account)."
    + " Use **Find Records** on `Account` to get the `AccountId` that links this contact to a company."
    + " Use **Describe Object** on `Contact` to discover which fields your org requires."
    + " "
    + `[See the documentation](${docsLink})`,
  version: "0.3.9",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  methods: {
    ...common.methods,
  },
  props: getProps({
    objType: contact,
    docsLink,
  }),
  async run({ $ }) {
    /* eslint-disable no-unused-vars */
    const {
      salesforce,
      getAdditionalFields,
      formatDateTimeProps,
      docsInfo,
      additionalFields,
      ...data
    } = this;
    /* eslint-enable no-unused-vars */
    const response = await salesforce.createRecord("Contact", {
      $,
      data: {
        ...data,
        ...getAdditionalFields(),
      },
    });
    $.export("$summary", `Successfully created contact "${this.LastName}"`);
    return response;
  },
};
