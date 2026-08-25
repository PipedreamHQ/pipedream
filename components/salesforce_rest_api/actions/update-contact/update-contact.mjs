// x-pd-ai: optimized
import common, { getProps } from "../common/base-create-update.mjs";
import contact from "../../common/sobjects/contact.mjs";
import salesforce from "../../salesforce_rest_api.app.mjs";
import { docsLink } from "../create-contact/create-contact.mjs";

/* eslint-disable no-unused-vars */
const {
  salesforce: _sf, ...props
} = getProps({
  createOrUpdate: "update",
  objType: contact,
  docsLink,
});
/* eslint-enable no-unused-vars */

export default {
  ...common,
  key: "salesforce_rest_api-update-contact",
  name: "Update Contact",
  description: "Update fields on an existing Salesforce contact."
    + " Only the fields you supply change; everything else is left as-is."
    + " Use **Find Records** on `Contact` to get the record ID first."
    + " "
    + `[See the documentation](${docsLink})`,
  version: "0.4.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  methods: {
    ...common.methods,
  },
  props: {
    salesforce,
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The ID of the Contact to update (Salesforce's 15- or 18-character record ID, e.g. `003XX000004TmiQ`). Use **SOQL Query** to find the ID.",
    },
    ...props,
  },
  async run({ $ }) {
    /* eslint-disable no-unused-vars */
    const {
      salesforce,
      getAdditionalFields,
      formatDateTimeProps,
      contactId,
      docsInfo,
      additionalFields,
      ...data
    } = this;
    /* eslint-enable no-unused-vars */
    const response = await salesforce.updateRecord("Contact", {
      $,
      id: contactId,
      data: {
        ...data,
        ...getAdditionalFields(),
      },
    });
    $.export(
      "$summary",
      `Successfully updated contact (ID: ${this.contactId})`,
    );
    return response;
  },
};
