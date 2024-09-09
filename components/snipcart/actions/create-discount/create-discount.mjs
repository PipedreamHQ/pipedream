import app from "../../snipcart.app.mjs";

export default {
  key: "snipcart-create-discount",
  name: "Create Discount",
  description: "Create a new Discount. [See the documentation](https://docs.snipcart.com/v3/api-reference/discounts#post-discounts)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
    maxNumberOfUsages: {
      propDefinition: [
        app,
        "maxNumberOfUsages",
      ],
    },
    trigger: {
      propDefinition: [
        app,
        "trigger",
      ],
      reloadProps: true,
    },
    code: {
      propDefinition: [
        app,
        "code",
      ],
      disabled: true,
      hidden: true,
    },
    totalToReach: {
      propDefinition: [
        app,
        "totalToReach",
      ],
      disabled: true,
      hidden: true,
    },
    type: {
      propDefinition: [
        app,
        "type",
      ],
      reloadProps: true,
    },
    amount: {
      propDefinition: [
        app,
        "amount",
      ],
      disabled: true,
      hidden: true,
    },
    rate: {
      propDefinition: [
        app,
        "rate",
      ],
      disabled: true,
      hidden: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.trigger === "Code") {
      props.code = {
        type: "string",
        label: "Code",
        description: "Code for the discount",
      };
    }
    if (this.trigger === "Total") {
      props.totalToReach = {
        type: "string",
        label: "Total to Reach",
        description: "Minimum amount required to activate the discount",
      };
    }
    if (this.type === "FixedAmount") {
      props.amount = {
        type: "string",
        label: "Amount",
        description: "Discount amount. Required when discount type is `FixedAmount`",
      };
    }
    if (this.type === "Rate") {
      props.rate = {
        type: "string",
        label: "Rate",
        description: "Discount percentage, i.e.: `10`. Required when discount type is `Rate`",
      };
    }
    return props;
  },
  async run({ $ }) {
    const response = await this.app.createDiscount({
      $,
      data: {
        name: this.name,
        maxNumberOfUsages: this.maxNumberOfUsages,
        trigger: this.trigger,
        code: this.code,
        totalToReach: this.totalToReach,
        type: this.type,
        amount: this.amount,
        rate: this.rate,
        discount: this.discount,
      },
    });

    $.export("$summary", `Successfully created Discount with ID '${response.id}'`);

    return response;
  },
};
