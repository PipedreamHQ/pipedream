import app from "../../refersion.app.mjs";
import options from "../../common/options.mjs";

export default {
  name: "Manual Comission Credit",
  description: "Allows you to manually credit an affiliate with any commission amount. [See the docs here](https://www.refersion.dev/reference/manual_commission_credit)",
  key: "refersion-manual-commission-credit",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    id: {
      propDefinition: [
        app,
        "affiliateId",
      ],
    },
    commission: {
      type: "string",
      label: "Commission",
      description: "The commission amount to credit the affiliate with",
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status of the commission",
      options: options.MANUAL_COMMISSION_CREDIT_STATUS,
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "Currency of the manual credit. If no currency provided then we will use your default account settings.",
      optional: true,
    },
    notes: {
      type: "string",
      label: "Note",
      description: "Note to add to the manual credit",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      ...data
    } = this;
    const res = await app.createManualCommissionCredit(data, $);
    $.export("$summary", `Manual Commission credit successfully created with id ${res.conversion_id}`);
    return res;
  },
};
