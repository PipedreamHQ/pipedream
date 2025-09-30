import { ConfigurationError } from "@pipedream/platform";
import { POSTAGE_ACCOUNT_OPTIONS } from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import zenventory from "../../zenventory.app.mjs";

export default {
  key: "zenventory-create-customer-order",
  name: "Create Customer Order",
  description: "Creates a new customer order. [See the documentation](https://docs.zenventory.com/#tag/customer_order/paths/~1customer-orders/post)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    zenventory,
    orderNumber: {
      type: "string",
      label: "Order Number",
      description: "Order number for the customer order.",
      optional: true,
    },
    clientId: {
      propDefinition: [
        zenventory,
        "clientId",
      ],
      optional: true,
    },
    clientName: {
      propDefinition: [
        zenventory,
        "clientName",
      ],
      optional: true,
    },
    customerId: {
      type: "integer",
      label: "Customer Id",
      description: "Id of the customer. If none is provided, will attempt to find an existing customer based on the other customer fields and shipping address. Other fields not used if id is provided.",
      optional: true,
    },
    title: {
      type: "string",
      label: "Customer Title",
      description: "The title of the customer.",
      optional: true,
    },
    name: {
      type: "string",
      label: "Customer Name",
      description: "A combination of name and surname is required if the customer is new.",
      optional: true,
    },
    surname: {
      type: "string",
      label: "Customer Surname",
      description: "A combination of name and surname is required if the customer is new.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Customer Email",
      description: "The email of the customer.",
      optional: true,
    },
    customerCompany: {
      type: "string",
      label: "Customer Company",
      description: "The company of the customer.",
      optional: true,
    },
    accountNumber: {
      type: "string",
      label: "Customer Account Number",
      description: "Will only match a customer on this field if provided.",
      optional: true,
    },
    shippingAddressId: {
      type: "integer",
      label: "Shipping Address Id",
      description: "Id of the shipping address. **Other Shipping fields will not be used if provided.**",
      optional: true,
    },
    shippingAddressCode: {
      type: "string",
      label: "Shipping Address Code",
      description: "Used to find an existing address. Other fields not used if an address is successfully found.",
      optional: true,
    },
    shippingAddressCompany: {
      type: "string",
      label: "Shipping Address Company",
      description: "The company of the shipping address.",
      optional: true,
    },
    shippingAddressName: {
      type: "string",
      label: "Shipping Address Name",
      description: "The name of the shipping address.",
      optional: true,
    },
    shippingAddressline1: {
      type: "string",
      label: "Shipping Address Line 1",
      description: "The shipping address line 1.",
      optional: true,
    },
    shippingAddressline2: {
      type: "string",
      label: "Shipping Address Line 2",
      description: "The shipping address line 2.",
      optional: true,
    },
    shippingAddressline3: {
      type: "string",
      label: "Shipping Address Line 3",
      description: "The shipping address line 3.",
      optional: true,
    },
    shippingAddressCity: {
      type: "string",
      label: "Shipping Address City",
      description: "The city of the shipping address.",
      optional: true,
    },
    shippingAddressState: {
      type: "string",
      label: "Shipping Address State",
      description: "The state of the shipping address.",
      optional: true,
    },
    shippingAddressZip: {
      type: "string",
      label: "Shipping Address Zip",
      description: "The zip of the shipping address.",
      optional: true,
    },
    shippingAddressCountryCode: {
      type: "string",
      label: "Shipping Address Country Code",
      description: "The country code of the shipping address. [See the ISO 3166 codes](https://www.iban.com/country-codes).",
      optional: true,
    },
    shippingAddressPhone: {
      type: "string",
      label: "Shipping Address Phone",
      description: "The phone of the shipping address.",
      optional: true,
    },
    sameAsShipping: {
      type: "boolean",
      label: "Same As Shipping",
      description: "True if the billing address is the same as the shipping address.",
      reloadProps: true,
      optional: true,
    },
    shipFromWarehouseId: {
      type: "string",
      label: "Ship From Warehouse Id",
      description: "Id of the warehouse the ordered items will be allocated from. If no warehouse parameters are given, then the user's current warehouse will be used.",
      optional: true,
    },
    shipFromWarehouseName: {
      type: "string",
      label: "Ship From Warehouse Name",
      description: "Name of the warehouse the ordered items will be allocated from. Ignored if warehouseId is provided.",
      optional: true,
    },
    shipVia: {
      type: "string",
      label: "Ship Via",
      description: "Code of the carrier or service to use for shipping.",
      optional: true,
    },
    postageAccount: {
      type: "string",
      label: "Postage Account",
      description: "Who to bill for shipping.",
      options: POSTAGE_ACCOUNT_OPTIONS,
      optional: true,
    },
    items: {
      type: "string[]",
      label: "Items",
      description: "An array of objects of ordered items. **Example: {\"itemId\": \"123\", \"sku\": \"SKU123\", \"quantity\": 1}** [See the documentation](https://docs.zenventory.com/#tag/customer_order/paths/~1customer-orders/post) fro further information.",
      optional: true,
    },
  },
  async additionalProps() {
    const props = {};

    if (!this.sameAsShipping) {
      props.billingAddressId = {
        type: "integer",
        label: "Billing Address Id",
        description: "Id of the billing address. **Other Billing fields will not be used if provided.**",
        optional: true,
      };
      props.billingAddressCode = {
        type: "string",
        label: "Billing Address Code",
        description: "Used to find an existing address. Other fields not used if an address is successfully found.",
        optional: true,
      };
      props.billingAddressCompany = {
        type: "string",
        label: "Billing Address Company",
        description: "The company of the billing address.",
        optional: true,
      };
      props.billingAddressName = {
        type: "string",
        label: "Billing Address Name",
        description: "The name of the billing address.",
        optional: true,
      };
      props.billingAddressline1 = {
        type: "string",
        label: "Billing Address Line 1",
        description: "The billing address line 1.",
        optional: true,
      };
      props.billingAddressline2 = {
        type: "string",
        label: "Billing Address Line 2",
        description: "The billing address line 2.",
        optional: true,
      };
      props.billingAddressline3 = {
        type: "string",
        label: "Billing Address Line 3",
        description: "The billing address line 3.",
        optional: true,
      };
      props.billingAddressCity = {
        type: "string",
        label: "Billing Address City",
        description: "The city of the billing address.",
        optional: true,
      };
      props.billingAddressState = {
        type: "string",
        label: "Billing Address State",
        description: "The state of the billing address.",
        optional: true,
      };
      props.billingAddressZip = {
        type: "string",
        label: "Billing Address Zip",
        description: "The zip of the billing address.",
        optional: true,
      };
      props.billingAddressCountryCode = {
        type: "string",
        label: "Billing Address Country Code",
        description: "The country code of the billing address. [See the ISO 3166 codes](https://www.iban.com/country-codes).",
        optional: true,
      };
      props.billingAddressPhone = {
        type: "string",
        label: "Billing Address Phone",
        description: "The phone of the billing address.",
        optional: true,
      };
    }
    return props;
  },
  async run({ $ }) {
    if (!this.customerId &&
      !this.title &&
      !this.name &&
      !this.surname &&
      !this.email &&
      !this.customerCompany &&
      !this.accountNumber) {
      throw new ConfigurationError("You must provide at least 'Customer Id', 'Customer Title', 'Customer Name', 'Customer Surname', 'Customer Email', 'Customer Company' or 'Customer Account Number'.");
    }

    if (!this.shippingAddressId &&
      !this.shippingAddressline1 &&
      !this.shippingAddressCountryCode) {
      throw new ConfigurationError("You must provide at least 'Shipping Address Id' or 'Shipping Address Line1' and 'Shipping Address Country Code'.");
    }

    if (!this.sameAsShipping &&
      !this.billingAddressId &&
      !this.billingAddressline1 &&
      !this.billingAddressCountryCode) {
      throw new ConfigurationError("When 'Same As Shipping' is set **False** you must provide at least 'Billing Address Id' or 'Billing Address Line1' and 'Billing Address Country Code'.");
    }

    const response = await this.zenventory.createCustomerOrder({
      $,
      data: {
        orderNumber: this.orderNumber,
        clientId: this.clientId,
        clientName: this.clientName,
        customer: {
          id: this.customerId,
          title: this.title,
          name: this.name,
          surname: this.surname,
          email: this.email,
          company: this.customerCompany,
          accountNumber: this.accountNumber,
        },
        shippingAddress: {
          id: this.shippingAddressId,
          code: this.shippingAddressCode,
          company: this.shippingAddressCompany,
          name: this.shippingAddressName,
          line1: this.shippingAddressline1,
          line2: this.shippingAddressline2,
          line3: this.shippingAddressline3,
          city: this.shippingAddressCity,
          state: this.shippingAddressState,
          zip: this.shippingAddressZip,
          countryCode: this.shippingAddressCountryCode,
          phone: this.shippingAddressPhone,
        },
        billingAddress: {
          sameAsShipping: this.sameAsShipping,
          id: this.billingAddressId,
          code: this.billingAddressCode,
          company: this.billingAddressCompany,
          name: this.billingAddressName,
          line1: this.billingAddressline1,
          line2: this.billingAddressline2,
          line3: this.billingAddressline3,
          city: this.billingAddressCity,
          state: this.billingAddressState,
          zip: this.billingAddressZip,
          countryCode: this.billingAddressCountryCode,
          phone: this.billingAddressPhone,
        },
        shipFromWarehouseId: this.shipFromWarehouseId,
        shipFromWarehouseName: this.shipFromWarehouseName,
        shipVia: this.shipVia,
        postageAccount: this.postageAccount,
        items: parseObject(this.items),
      },
    });

    $.export("$summary", `Successfully created customer order with ID ${response.id}`);
    return response;
  },
};
