import { defineAction } from "@pipedream/types";
import salesmate from "../../app/salesmate.app";

export default defineAction({
  name: "Update Contact",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "salesmate-update-contact",
  description: "This API is used to update a contact's details. [See docs here](https://apidocs.salesmate.io/#72ca69e0-e70d-4fc5-837b-a758963300b3)",
  type: "action",
  props: {
    salesmate,
    contactId: {
      propDefinition: [
        salesmate,
        "contactId",
      ],
    },
    firstName: {
      propDefinition: [
        salesmate,
        "firstName",
      ],
      optional: true,
    },
    lastName: {
      propDefinition: [
        salesmate,
        "lastName",
      ],
    },
    owner: {
      propDefinition: [
        salesmate,
        "owner",
      ],
    },
    mobile: {
      propDefinition: [
        salesmate,
        "mobile",
      ],
      optional: true,
    },
    company: {
      propDefinition: [
        salesmate,
        "company",
      ],
      optional: true,
    },
    email: {
      propDefinition: [
        salesmate,
        "email",
      ],
      optional: true,
    },
    website: {
      propDefinition: [
        salesmate,
        "website",
      ],
      optional: true,
    },
    googlePlusHandle: {
      propDefinition: [
        salesmate,
        "googlePlusHandle",
      ],
      optional: true,
    },
    linkedInHandle: {
      propDefinition: [
        salesmate,
        "linkedInHandle",
      ],
      optional: true,
    },
    phone: {
      propDefinition: [
        salesmate,
        "phone",
      ],
      optional: true,
    },
    otherPhone: {
      propDefinition: [
        salesmate,
        "otherPhone",
      ],
      optional: true,
    },
    skypeId: {
      propDefinition: [
        salesmate,
        "skypeId",
      ],
      optional: true,
    },
    facebookHandle: {
      propDefinition: [
        salesmate,
        "facebookHandle",
      ],
      optional: true,
    },
    twitterHandle: {
      propDefinition: [
        salesmate,
        "twitterHandle",
      ],
      optional: true,
    },
    currency: {
      propDefinition: [
        salesmate,
        "currency",
      ],
      optional: true,
    },
    designation: {
      propDefinition: [
        salesmate,
        "designation",
      ],
      optional: true,
    },
    billingAddressLine1: {
      propDefinition: [
        salesmate,
        "billingAddressLine1",
      ],
      optional: true,
    },
    billingAddressLine2: {
      propDefinition: [
        salesmate,
        "billingAddressLine2",
      ],
      optional: true,
    },
    billingCity: {
      propDefinition: [
        salesmate,
        "billingCity",
      ],
      optional: true,
    },
    billingZipCode: {
      propDefinition: [
        salesmate,
        "billingZipCode",
      ],
      optional: true,
    },
    billingState: {
      propDefinition: [
        salesmate,
        "billingState",
      ],
      optional: true,
    },
    billingCountry: {
      propDefinition: [
        salesmate,
        "billingCountry",
      ],
      optional: true,
    },
    description: {
      propDefinition: [
        salesmate,
        "contactDescription",
      ],
      optional: true,
    },
    tags: {
      propDefinition: [
        salesmate,
        "tags",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      salesmate,
      ...data
    } = this;
    data.tags = data.tags?.toString();

    const response = await salesmate.updateContact({
      $,
      ...data,
    });

    $.export("$summary", `Contact with id: ${response.Data.id} successfuly updated!`);

    return response;
  },
});
