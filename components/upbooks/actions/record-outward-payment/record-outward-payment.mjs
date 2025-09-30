import { CURRENCY_OPTIONS } from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import upbooks from "../../upbooks.app.mjs";

export default {
  key: "upbooks-record-outward-payment",
  name: "Record Outward Payment",
  description: "Records an outward payment in UpBooks. [See the documentation](https://www.postman.com/scrrum/workspace/upbooks-io/request/13284127-3fc82d7a-2173-4b3a-a8ec-4c812c928810)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    upbooks,
    mode: {
      type: "string",
      label: "Mode",
      description: "The outward payment mode.",
      options: [
        {
          label: "Cash",
          value: "cash",
        },
        {
          label: "Cheque",
          value: "cheque",
        },
        {
          label: "Neft",
          value: "neft",
        },
        {
          label: "Imps",
          value: "imps",
        },
        {
          label: "Wire Transfer",
          value: "wire transfer",
        },
      ],
    },
    amount: {
      type: "string",
      label: "Amount",
      description: "The outwart payment amount in cents.",
    },
    date: {
      type: "string",
      label: "Date",
      description: "The date of the outward payment. Format: YYYY-MM-DD",
    },
    expenseIds: {
      propDefinition: [
        upbooks,
        "expenseIds",
      ],
    },
    account: {
      propDefinition: [
        upbooks,
        "accountId",
      ],
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "The currency of the outward payment.",
      options: CURRENCY_OPTIONS,
    },
  },
  async run({ $ }) {
    const currency = CURRENCY_OPTIONS.filter((item) => item.value === this.currency)[0];
    const response = await this.upbooks.recordOutwardPayment({
      $,
      data: {
        mode: this.mode,
        amount: (this.amount / 100).toFixed(2),
        date: this.date,
        expenseIds: parseObject(this.expenseIds),
        accountId: this.account,
        currency: {
          name: currency.label,
          symbol: currency.value,
        },
      },
    });
    $.export("$summary", `Successfully recorded outward payment with Id: ${response.data._id}`);
    return response;
  },
};
