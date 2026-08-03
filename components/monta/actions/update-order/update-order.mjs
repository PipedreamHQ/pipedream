import { ConfigurationError } from "@pipedream/platform";
import monta from "../../monta.app.mjs";

function cleanObject(obj) {
  const entries = Object.entries(obj).filter(([
    , value,
  ]) => value !== undefined);
  return entries.length
    ? Object.fromEntries(entries)
    : undefined;
}

export default {
  key: "monta-update-order",
  name: "Update Order",
  description: "Change an existing order by its ID, for example to correct a customer's delivery address before it is picked. Call this directly with the order ID and the fields to change. When changing the delivery address, first read the current address with **Get Order**, then call this with the full address plus your change, since Monta replaces the entire address (it needs at least Street, City, and Country Code). Monta rejects address changes once picking has started (error 17) or after the order has shipped (error 19). [See the documentation](https://api-v6.monta.nl/index.html#tag/Order/paths/~1order~1%7Bwebshoporderid%7D/put)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    monta,
    orderId: {
      propDefinition: [
        monta,
        "orderId",
      ],
    },
    street: {
      propDefinition: [
        monta,
        "street",
      ],
      label: "Delivery Street",
      optional: true,
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
    city: {
      propDefinition: [
        monta,
        "city",
      ],
      label: "Delivery City",
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
    countryCode: {
      propDefinition: [
        monta,
        "countryCode",
      ],
      label: "Delivery Country Code",
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
    additionalFields: {
      propDefinition: [
        monta,
        "additionalFields",
      ],
      description: "Additional order properties to send in the request body, using Monta's request-body casing (e.g. `{ \"Comment\": \"...\" }`)",
      optional: true,
    },
  },
  async run({ $ }) {
    const addressProvided = [
      this.street,
      this.houseNumber,
      this.houseNumberAddition,
      this.postalCode,
      this.city,
      this.state,
      this.countryCode,
      this.company,
      this.firstName,
      this.middleName,
      this.lastName,
      this.phoneNumber,
      this.emailAddress,
    ].some((value) => value !== undefined);
    if (addressProvided && (!this.street || !this.city || !this.countryCode)) {
      throw new ConfigurationError("To change the delivery address, provide Street, City, and Country Code together, since Monta replaces the entire address and a partial update would clear the other fields.");
    }

    const deliveryAddress = cleanObject({
      Street: this.street,
      HouseNumber: this.houseNumber,
      HouseNumberAddition: this.houseNumberAddition,
      PostalCode: this.postalCode,
      City: this.city,
      State: this.state,
      CountryCode: this.countryCode,
      Company: this.company,
      FirstName: this.firstName,
      MiddleName: this.middleName,
      LastName: this.lastName,
      PhoneNumber: this.phoneNumber,
      EmailAddress: this.emailAddress,
    });

    const additionalConsumerDetails = this.additionalFields?.ConsumerDetails;
    const consumerDetails = cleanObject({
      ...additionalConsumerDetails,
      DeliveryAddress: deliveryAddress ?? additionalConsumerDetails?.DeliveryAddress,
    });

    const data = cleanObject({
      ...this.additionalFields,
      WebshopOrderId: this.orderId,
      ConsumerDetails: consumerDetails,
    });

    const response = await this.monta.updateOrder({
      $,
      orderId: this.orderId,
      data,
    });

    $.export("$summary", `Successfully updated order \`${this.orderId}\``);

    return response;
  },
};
