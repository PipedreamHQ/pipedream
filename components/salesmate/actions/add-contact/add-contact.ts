import { defineAction } from "@pipedream/types";
import salesmate from "../../app/salesmate.app";

export default defineAction({
  name: "Add Contact",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "salesmate-add-contact",
  description: "This API is used to add a contact. [See docs here](https://apidocs.salesmate.io/#b768facc-930f-4f93-b9a7-a26a0875b6b0)",
  type: "action",
  props: {
    salesmate,
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

    const response = await salesmate.addContact({
      $,
      data,
    });

    $.export("$summary", `Contact successfuly created with id: ${response.Data.id}!`);

    return response;
  },
});
