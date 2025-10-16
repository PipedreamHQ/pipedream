import app from "../../craftboxx.app.mjs";
import countries from "../../common/countries.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "craftboxx-create-customer-and-mailing-address",
  name: "Create Customer and Mailing Address",
  description: "Creates a new customer along with their mailing address in Craftboxx. [See the documentation](https://api.craftboxx.de/docs/docs.json)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the customer",
    },
    customerNumber: {
      type: "string",
      label: "Customer Number",
      description: "The number of the customer",
      optional: true,
    },
    info: {
      type: "string",
      label: "Info",
      description: "The info of the customer",
      optional: true,
    },
    type: {
      type: "string",
      label: "Type",
      description: "The customer address type",
      optional: true,
      options: constants.CUSTOMER_TYPES,
    },
    street: {
      type: "string",
      label: "Street",
      description: "The customer address street",
      optional: true,
    },
    zip: {
      type: "string",
      label: "Zip",
      description: "The customer address zip",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "The customer address city",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "The customer address country",
      optional: true,
      options: countries,
    },
    mail: {
      type: "string",
      label: "Mail",
      description: "The customer address mail",
      optional: true,
    },
  },
  methods: {
    createCustomer(args = {}) {
      return this.app.post({
        path: "/customers",
        ...args,
      });
    },
    createCustomerAddresses(args = {}) {
      return this.app.post({
        path: "/customers/addresses",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createCustomer,
      name,
      customerNumber,
      info,
      createCustomerAddresses,
      ...customerAddressesData
    } = this;

    const customerResponse =
      await createCustomer({
        $,
        data: {
          name,
          customer_number: customerNumber,
          info,
        },
      });

    const customerAddressesResponse = await createCustomerAddresses({
      $,
      data: {
        customer_id: customerResponse.data.id,
        ...customerAddressesData,
      },
    });

    $.export("$summary", `Successfully created customer with ID \`${customerResponse.data.id}\` and customer address with ID \`${customerAddressesResponse.data.id}\``);

    return {
      customerResponse,
      customerAddressesResponse,
    };
  },
};
