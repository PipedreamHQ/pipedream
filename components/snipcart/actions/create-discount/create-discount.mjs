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
  async additionalProps(existingProps) {
    const props = {};
    if (this.trigger === "Code") {
      existingProps.code.hidden = false;
      existingProps.code.disabled: false,
    }
    if (this.trigger === "Total") {
      existingProps.totalToReach.hidden = false;
      existingProps.totalToReach.disabled = false;
    }
    if (this.type === "FixedAmount") {
      existingProps.amount.hidden = false;
      existingProps.amount.disabled = false;
    }
    if (this.type === "Rate") {
      existingProps.rate.hidden = false;
      existingProps.rate.disabled = false;
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
