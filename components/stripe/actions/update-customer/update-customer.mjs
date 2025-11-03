import utils from "../../common/utils.mjs";
import app from "../../stripe.app.mjs";

export default {
  key: "stripe-update-customer",
  name: "Update a Customer",
  type: "action",
  version: "0.1.4",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Update a customer. [See the documentation](https://stripe.com/docs/api/customers/update).",
  props: {
    app,
    customer: {
      propDefinition: [
        app,
        "customer",
      ],
      optional: false,
    },
    name: {
      description: "The customer's full name or business name.",
      propDefinition: [
        app,
        "name",
      ],
    },
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
    phone: {
      propDefinition: [
        app,
        "phone",
      ],
    },
    description: {
      propDefinition: [
        app,
        "description",
      ],
    },
    addressCity: {
      propDefinition: [
        app,
        "addressCity",
      ],
    },
    addressCountry: {
      propDefinition: [
        app,
        "addressCountry",
      ],
    },
    addressLine1: {
      propDefinition: [
        app,
        "addressLine1",
      ],
    },
    addressLine2: {
      propDefinition: [
        app,
        "addressLine2",
      ],
    },
    addressPostalCode: {
      propDefinition: [
        app,
        "addressPostalCode",
      ],
    },
    addressState: {
      propDefinition: [
        app,
        "addressState",
      ],
    },
    metadata: {
      propDefinition: [
        app,
        "metadata",
      ],
    },
  },
  methods: {
    getOtherParams() {
      const {
        addressCity,
        addressCountry,
        addressLine1,
        addressLine2,
        addressPostalCode,
        addressState,
      } = this;

      const hasAddressData = addressCity
        || addressCountry
        || addressLine1
        || addressLine2
        || addressPostalCode
        || addressState;

      return {
        ...(hasAddressData && {
          address: {
            city: addressCity,
            country: addressCountry,
            line1: addressLine1,
            line2: addressLine2,
            postal_code: addressPostalCode,
            state: addressState,
          },
        }),
      };
    },
  },
  async run({ $ }) {
    const {
      app,
      customer,
      name,
      email,
      phone,
      description,
      metadata,
      getOtherParams,
    } = this;

    const resp = await app.sdk().customers.update(customer, {
      name,
      email,
      phone,
      description,
      metadata: utils.parseJson(metadata),
      ...getOtherParams(),
    });
    $.export("$summary", `Successfully updated the customer, \`${resp.id}\`.`);
    return resp;
  },
};
