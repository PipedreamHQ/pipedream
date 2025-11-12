import clientify from "../../clientify.app.mjs";
import { prepareData } from "../../common/utils.mjs";

export default {
  key: "clientify-update-contact",
  name: "Update Contact",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Update a specific contact. [See the documentation](https://developer.clientify.com/#3107ca4f-0bb5-43a7-9be8-3c2e2f8fe399)",
  type: "action",
  props: {
    clientify,
    contactId: {
      propDefinition: [
        clientify,
        "contactId",
      ],
    },
    firstName: {
      propDefinition: [
        clientify,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        clientify,
        "lastName",
      ],
      optional: true,
    },
    email: {
      propDefinition: [
        clientify,
        "email",
      ],
      optional: true,
    },
    phone: {
      propDefinition: [
        clientify,
        "phone",
      ],
      optional: true,
    },
    status: {
      propDefinition: [
        clientify,
        "status",
      ],
      optional: true,
    },
    title: {
      propDefinition: [
        clientify,
        "title",
      ],
      optional: true,
    },
    company: {
      propDefinition: [
        clientify,
        "company",
      ],
      optional: true,
    },
    contactType: {
      propDefinition: [
        clientify,
        "contactType",
      ],
      optional: true,
    },
    contactSource: {
      propDefinition: [
        clientify,
        "contactSource",
      ],
      optional: true,
    },
    addressType: {
      propDefinition: [
        clientify,
        "addressType",
      ],
      optional: true,
    },
    street: {
      propDefinition: [
        clientify,
        "street",
      ],
      optional: true,
    },
    city: {
      propDefinition: [
        clientify,
        "city",
      ],
      optional: true,
    },
    state: {
      propDefinition: [
        clientify,
        "state",
      ],
      optional: true,
    },
    country: {
      propDefinition: [
        clientify,
        "country",
      ],
      optional: true,
    },
    postalCode: {
      propDefinition: [
        clientify,
        "postalCode",
      ],
      optional: true,
    },
    customFields: {
      propDefinition: [
        clientify,
        "customFields",
      ],
      optional: true,
    },
    description: {
      propDefinition: [
        clientify,
        "description",
      ],
      optional: true,
    },
    remarks: {
      propDefinition: [
        clientify,
        "remarks",
      ],
      optional: true,
    },
    summary: {
      propDefinition: [
        clientify,
        "summary",
      ],
      optional: true,
    },
    message: {
      propDefinition: [
        clientify,
        "message",
      ],
      optional: true,
    },
    lastContact: {
      propDefinition: [
        clientify,
        "lastContact",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      clientify,
      contactId,
      ...data
    } = this;

    const response = await clientify.updateContact({
      $,
      contactId,
      data: prepareData(data),
    });

    $.export("$summary", `The contact with Id: ${contactId} was successfully updated!`);
    return response;
  },
};
