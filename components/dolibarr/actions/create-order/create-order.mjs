import dolibarr from "../../dolibarr.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "dolibarr-create-order",
  name: "Create Order",
  description: "Create a new order in Dolibarr.",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    dolibarr,
    thirdPartyId: {
      propDefinition: [
        dolibarr,
        "thirdPartyId",
      ],
    },
    date: {
      type: "string",
      label: "Date",
      description: "The date of the order in YYYY-MM-DD format",
    },
    deliveryDate: {
      type: "string",
      label: "Delivery Date",
      description: "The expecteddelivery date of the order in YYYY-MM-DD format",
      optional: true,
    },
    paymentMethodCode: {
      propDefinition: [
        dolibarr,
        "paymentMethodCode",
      ],
    },
    paymentTermCode: {
      propDefinition: [
        dolibarr,
        "paymentTermCode",
      ],
    },
    notePublic: {
      type: "string",
      label: "Note Public",
      description: "A public note to add to the order",
      optional: true,
    },
    notePrivate: {
      type: "string",
      label: "Note Private",
      description: "A private note to add to the order",
      optional: true,
    },
    additionalProperties: {
      propDefinition: [
        dolibarr,
        "additionalProperties",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.dolibarr.createOrder({
      $,
      data: {
        socid: this.thirdPartyId,
        date: Date.parse(this.date) / 1000,
        deliverydate: this.deliveryDate
          ? Date.parse(this.deliveryDate) / 1000
          : undefined,
        mode_reglement_code: this.paymentMethodCode,
        cond_reglement_code: this.paymentTermCode,
        note_public: this.notePublic,
        note_private: this.notePrivate,
        ...parseObject(this.additionalProperties),
      },
    });
    $.export("$summary", `Successfully created order ${response}`);
    return response;
  },
};
