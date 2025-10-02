import app from "../../uscreen.app.mjs";
import constants from "../common/constants.mjs";

export default {
  name: "Grant User Access",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "uscreen-grant-user-access",
  description: "Grant access to an user. [See the documentation](https://uscreen.io/api/publisher.html#/default/post_customers__customer_id__accesses)",
  type: "action",
  props: {
    app,
    email: {
      type: "string",
      label: "Email",
      description: "The email to grant access",
    },
    productId: {
      propDefinition: [
        app,
        "offerId",
      ],
    },
    productType: {
      type: "string",
      label: "Product type",
      description: "The type of the product",
      reloadProps: true,
      options: constants.PRODUCT_TYPES,
    },
  },
  async additionalProps() {
    let props = {};

    if (this.productType === "offer") {
      props.withManualBilling = {
        type: "boolean",
        label: "Manual billing",
        description: "Is with manual billing",
      };
    }

    return props;
  },
  async run({ $ }) {
    const response = await this.app.grantUserAccess({
      $,
      email: this.email,
      data: {
        product_id: this.productId,
        product_type: this.productType,
        with_manual_billing: this.withManualBilling,
      },
    });

    if (response) {
      $.export("$summary", `Successfully created user with ID \`${response.id}\``);
    }

    return response;
  },
};
