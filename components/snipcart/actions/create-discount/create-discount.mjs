import app from "../../snipcart.app.mjs";

export default {
  key: "snipcart-create-discount",
  name: "Create Discount",
  description: "Create a new Discount. [See the documentation](https://docs.snipcart.com/v3/api-reference/discounts#post-discounts)",
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
      propDefinition: [
        app,
        "name",
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
      },
    });

    $.export("$summary", `Successfully created Discount with ID '${response.id}'`);

    return response;
  },
};
