import common, { getProps } from "../common/base.mjs";
import contact from "../../common/sobjects/contact.mjs";
import { docsLink } from "../create-contact/create-contact.mjs";
import propsAsyncOptions from "../../common/props-async-options.mjs";

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
  version: "0.3.{{ts}}",
  type: "action",
  methods: {
    ...common.methods,
    getAdvancedProps() {
      return contact.extraProps;
    },
  },
  props: {
    salesforce,
    contactId: {
      ...propsAsyncOptions.ContactId,
      async options() {
        return this.salesforce.listRecordOptions({
          objType: "Contact",
        });
      },
    },
    ...props,
  },
  async run({ $ }) {
    /* eslint-disable no-unused-vars */
    const {
      salesforce,
      getAdvancedProps,
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
    const response = await salesforce.updateContact({
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
