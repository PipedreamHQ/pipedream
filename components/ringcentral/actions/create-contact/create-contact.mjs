import ringcentral from "../../ringcentral.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "ringcentral-create-contact",
  name: "Create Contact",
  description: "Creates a user personal contact. [See the documentation](https://developers.ringcentral.com/api-reference/External-Contacts/createContact)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ringcentral,
    accountId: {
      propDefinition: [
        ringcentral,
        "accountId",
      ],
    },
    extensionId: {
      propDefinition: [
        ringcentral,
        "extensionId",
      ],
      description: "Internal identifier of the RingCentral extension/user",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the contact",
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the contact",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the contact",
      optional: true,
    },
    mobilePhone: {
      type: "string",
      label: "Mobile Phone",
      description: "Mobile phone of the contact",
      optional: true,
    },
    additionalOptions: {
      type: "object",
      label: "Additional Options",
      description: "Additional parameters to set for the contact. [See the documentation](https://developers.ringcentral.com/api-reference/External-Contacts/createContact) for all available parameters. Values will be parsed as JSON where applicable. Example: `{ \"notes\": \"Notes for the contact\" }`",
      optional: true,
    },
  },
  methods: {
    createContact({
      accountId, extensionId, ...args
    }) {
      return this.ringcentral.makeRequest({
        method: "POST",
        path: `/account/${accountId}/extension/${extensionId}/address-book/contact`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const { // eslint-disable-next-line no-unused-vars
      ringcentral, createContact, accountId, extensionId, additionalOptions, ...data
    } = this;

    const response =
      await createContact({
        $,
        accountId,
        extensionId,
        data: {
          ...data,
          ...(additionalOptions && utils.parseObjectEntries(additionalOptions)),
        },
      });

    $.export("$summary", `Successfully created contact (ID: ${response.id})`);
    return response;
  },
};
