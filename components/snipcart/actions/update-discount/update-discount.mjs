import app from "../../snipcart.app.mjs";

export default {
  key: "snipcart-update-discount",
  name: "Update Discount",
  description: "Update a Discount. [See the documentation](https://docs.snipcart.com/v3/api-reference/discounts#put-discountsid)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    discountId: {
      propDefinition: [
        app,
        "discountId",
      ],
    },
    name: {
      propDefinition: [
        app,
        "name",
      ],
      optional: true,
    },
    trigger: {
      propDefinition: [
        app,
        "trigger",
      ],
      optional: true,
      reloadProps: true,
    },
    code: {
      propDefinition: [
        app,
        "code",
      ],
      optional: true,
      hidden: true,
    },
    totalToReach: {
      propDefinition: [
        app,
        "totalToReach",
      ],
      optional: true,
      hidden: true,
    },
    type: {
      propDefinition: [
        app,
        "type",
      ],
      optional: true,
      reloadProps: true,
    },
    amount: {
      propDefinition: [
        app,
        "amount",
      ],
      optional: true,
      hidden: true,
    },
    rate: {
      propDefinition: [
        app,
        "rate",
      ],
      optional: true,
      hidden: true,
    },
    maxNumberOfUsages: {
      propDefinition: [
        app,
        "maxNumberOfUsages",
      ],
    },
  },
  async additionalProps(props) {
    const triggerIsCode = this.trigger === "Code";
    const triggerIsTotal = this.trigger === "Total";

    props.code.hidden = !triggerIsCode;
    props.code.optional = !triggerIsCode;
    props.totalToReach.hidden = !triggerIsTotal;
    props.totalToReach.optional = !triggerIsTotal;

    const typeIsFixedAmount = this.type === "FixedAmount";
    const typeIsRate = this.type === "Rate";

    props.amount.hidden = !typeIsFixedAmount;
    props.amount.optional = !typeIsFixedAmount;
    props.rate.hidden = !typeIsRate;
    props.rate.optional = !typeIsRate;

    return {};
  },
  async run({ $ }) {
    const discount = await this.app.getDiscount({
      $,
      id: this.discountId,
    });
    const response = await this.app.updateDiscount({
      $,
      id: this.discountId,
      data: {
        name: this.name || discount.name,
        maxNumberOfUsages: this.maxNumberOfUsages || discount.maxNumberOfUsages,
        trigger: this.trigger || discount.trigger,
        code: this.code || discount.code,
        totalToReach: this.totalToReach || discount.totalToReach,
        type: this.type || discount.type,
        amount: this.amount || discount.amount,
        rate: this.rate || discount.rate,
      },
    });

    $.export("$summary", `Successfully updated Discount with ID '${response.id}'`);

    return response;
  },
};
