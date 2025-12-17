import printful_oauth from "../../printful_oauth.app.mjs";

export default {
  name: "Create Order",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "printful_oauth-create-order",
  description: "Creates an order. [See docs here](https://developers.printful.com/docs/#operation/createOrder)",
  type: "action",
  props: {
    printful_oauth,
    externalId: {
      label: "External ID",
      description: "Order ID from the external system",
      type: "string",
      optional: true,
    },
    recipientName: {
      label: "Recipient Name",
      description: "The recipient full name",
      type: "string",
    },
    recipientCompanyName: {
      label: "Recipient Company Name",
      description: "The recipient company name",
      type: "string",
      optional: true,
    },
    address1: {
      label: "Address 1",
      description: "The address 1",
      type: "string",
    },
    address2: {
      label: "Address 2",
      description: "The address 2",
      type: "string",
      optional: true,
    },
    city: {
      label: "City",
      description: "The city",
      type: "string",
    },
    stateCode: {
      label: "State Code",
      description: "The state code. E.g. `SC`",
      type: "string",
    },
    countryCode: {
      label: "Country Code",
      description: "The country code. E.g. `BR`",
      type: "string",
      reloadProps: true,
    },
    zip: {
      label: "ZIP/Postal Code",
      description: "The ZIP/postal code. E.g. `89221525`",
      type: "string",
      reloadProps: true,
    },
    phone: {
      label: "Phone",
      description: "The phone number",
      type: "string",
      optional: true,
    },
    email: {
      label: "Email",
      description: "The email",
      type: "string",
      optional: true,
    },
    giftSubject: {
      label: "Gift Subject",
      description: "Gift message title",
      type: "string",
      optional: true,
    },
    giftMessage: {
      label: "Gift Message",
      description: "Gift message text",
      type: "string",
      optional: true,
    },
    items: {
      label: "Items",
      description: "Array of items in the order. E.g. `[ { \"id\": 1, \"variant_id\": 2, \"quantity\": 3, \"price\": \"13.60\", \"retail_price\": \"9.90\", \"name\": \"Beauty Poster\", \"product\": { \"product_id\": 301, \"variant_id\": 500, \"name\": \"Red T-Shirt\" } } ]`",
      type: "string",
    },
  },
  additionalProps() {
    const additionalProps = {
      taxNumber: {
        label: "Tax Number",
        description: "TAX number (`optional`, but in case of Brazil country this field becomes `required` and will be used as CPF/CNPJ number)",
        type: "string",
        optional: true,
      },
    };

    if (this.countryCode === "BR") {
      additionalProps.taxNumber.optional = false;
    }

    return additionalProps;
  },
  async run({ $ }) {
    const parsedItems = typeof this.items === "string" ?
      JSON.parse(this.items)
      : this.items;

    const response = await this.printful_oauth.createOrder({
      $,
      data: {
        external_id: this.externalId,
        shipping: "STANDARD",
        recipient: {
          name: this.recipientName,
          company: this.recipientCompanyName,
          address1: this.address1,
          address2: this.address2,
          city: this.city,
          state_code: this.stateCode,
          country_code: this.countryCode,
          zip: this.zip,
          phone: this.phone,
          email: this.email,
          tax_number: this.taxNumber,
        },
        gift: {
          subject: this.giftSubject,
          message: this.giftMessage,
        },
        items: parsedItems,
      },
    });

    if (response) {
      $.export("$summary", `Successfully created order with id ${response.id}`);
    }

    return response;
  },
};
