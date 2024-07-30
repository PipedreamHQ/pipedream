import common, { getProps } from "../common/base-create-update.mjs";
import contact from "../../common/sobjects/contact.mjs";
import { docsLink } from "../create-contact/create-contact.mjs";

const {
  salesforce, ...props
} = getProps({
  createOrUpdate: "update",
  objType: contact,
  docsLink,
  showDateInfo: true,
});

export default {
  ...common,
  key: "salesforce_rest_api-update-contact",
  name: "Update Contact",
  description: `Updates a contact. [See the documentation](${docsLink})`,
  version: "0.3.0",
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
  props: {
    salesforce,
    contactId: {
      propDefinition: [
        salesforce,
        "recordId",
        () => ({
          objType: "Contact",
          nameField: "Name",
        }),
      ],
      label: "Contact ID",
      description: "The Contact to update.",
    },
    ...props,
  },
  async run({ $ }) {
    /* eslint-disable no-unused-vars */
    const {
      salesforce,
      getAdvancedProps,
      getObjectType,
      getAdditionalFields,
      formatDateTimeProps,
      contactId,
      useAdvancedProps,
      docsInfo,
      dateInfo,
      additionalFields,
      Birthdate,
      ...data
    } = this;
    /* eslint-enable no-unused-vars */
    const response = await salesforce.updateRecord("Contact", {
      $,
      id: contactId,
      data: {
        ...data,
        ...formatDateTimeProps({
          Birthdate,
        }),
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
