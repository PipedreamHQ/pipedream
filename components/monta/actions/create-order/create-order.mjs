import monta from "../../monta.app.mjs";
import { parseJsonObjects } from "../../common/utils.mjs";

export default {
  key: "monta-create-order",
  name: "Create Order",
  description: "Create a new order in Monta for fulfillment. Provide the recipient's delivery address (which needs a Company or Last Name) and at least one order line; validate the address first with **Validate Address** if needed. [See the documentation](https://api-v6.monta.nl/index.html#tag/Order/paths/~1order/post)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    monta,
    webshopOrderId: {
      type: "string",
      label: "Webshop Order ID",
      description: "The unique order ID assigned by your webshop (not Monta's internal order ID), e.g. `WEB-12345`",
    },
    b2b: {
      type: "boolean",
      label: "B2B",
      description: "Whether this is a business-to-business order",
      default: false,
    },
    street: {
      propDefinition: [
        monta,
        "street",
      ],
      label: "Delivery Street",
    },
    city: {
      propDefinition: [
        monta,
        "city",
      ],
      label: "Delivery City",
    },
    countryCode: {
      propDefinition: [
        monta,
        "countryCode",
      ],
      label: "Delivery Country Code",
    },
    lines: {
      type: "string[]",
      label: "Order Lines",
      description: "The order lines. Each entry is a JSON object with at least `Sku` and `OrderedQuantity` (e.g. `{\"Sku\":\"ABC-123\",\"OrderedQuantity\":2}`)",
    },
    houseNumber: {
      propDefinition: [
        monta,
        "houseNumber",
      ],
      label: "Delivery House Number",
      optional: true,
    },
    houseNumberAddition: {
      propDefinition: [
        monta,
        "houseNumberAddition",
      ],
      label: "Delivery House Number Addition",
      optional: true,
    },
    postalCode: {
      propDefinition: [
        monta,
        "postalCode",
      ],
      label: "Delivery Postal Code",
      optional: true,
    },
    state: {
      propDefinition: [
        monta,
        "state",
      ],
      label: "Delivery State",
      optional: true,
    },
    company: {
      propDefinition: [
        monta,
        "company",
      ],
      label: "Delivery Company",
      optional: true,
    },
    firstName: {
      propDefinition: [
        monta,
        "firstName",
      ],
      label: "Delivery First Name",
      optional: true,
    },
    middleName: {
      propDefinition: [
        monta,
        "middleName",
      ],
      label: "Delivery Middle Name",
      optional: true,
    },
    lastName: {
      propDefinition: [
        monta,
        "lastName",
      ],
      label: "Delivery Last Name",
      optional: true,
    },
    phoneNumber: {
      propDefinition: [
        monta,
        "phoneNumber",
      ],
      label: "Delivery Phone Number",
      optional: true,
    },
    emailAddress: {
      propDefinition: [
        monta,
        "emailAddress",
      ],
      label: "Delivery Email Address",
      optional: true,
    },
    reference: {
      type: "string",
      label: "Reference",
      description: "A reference for the order",
      optional: true,
    },
    comment: {
      type: "string",
      label: "Comment",
      description: "A comment for the order",
      optional: true,
    },
    additionalFields: {
      propDefinition: [
        monta,
        "additionalFields",
      ],
      description: "Additional order properties to send in the request body, using Monta's request-body casing (e.g. `{ \"ShipperCode\": \"...\" }`)",
      optional: true,
    },
  },
  async run({ $ }) {
    const lines = parseJsonObjects(this.lines, "Order Line");

    const response = await this.monta.createOrder({
      $,
      data: {
        ...this.additionalFields,
        WebshopOrderId: this.webshopOrderId,
        Reference: this.reference,
        Comment: this.comment,
        Lines: lines,
        ConsumerDetails: {
          B2B: this.b2b,
          DeliveryAddress: {
            Street: this.street,
            City: this.city,
            CountryCode: this.countryCode,
            HouseNumber: this.houseNumber,
            HouseNumberAddition: this.houseNumberAddition,
            PostalCode: this.postalCode,
            State: this.state,
            Company: this.company,
            FirstName: this.firstName,
            MiddleName: this.middleName,
            LastName: this.lastName,
            PhoneNumber: this.phoneNumber,
            EmailAddress: this.emailAddress,
          },
        },
      },
    });

    $.export("$summary", `Successfully created order \`${this.webshopOrderId}\``);

    return response;
  },
};
