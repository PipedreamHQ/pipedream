import returnista from "../../returnista.app.mjs";

export default {
  key: "returnista-create-draft-return-order",
  name: "Create Draft Return Order",
  description: "Creates a new draft return order for a consumer."
    + " Draft return orders are pending merchant review before being accepted or rejected."
    + " Use **Process Draft Return Order** to accept or reject the created draft."
    + " [See the documentation](https://platform.returnista.com/reference/rest-api/#post-/consumer/-consumerId-/draft-return-order)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    returnista,
    consumerId: {
      propDefinition: [
        returnista,
        "consumerId",
      ],
    },
    purchaseId: {
      propDefinition: [
        returnista,
        "purchaseId",
      ],
    },
    returnReasonId: {
      propDefinition: [
        returnista,
        "returnReasonId",
      ],
    },
    returnReasonComment: {
      propDefinition: [
        returnista,
        "returnReasonComment",
      ],
    },
    resolutionType: {
      propDefinition: [
        returnista,
        "resolutionType",
      ],
    },
    exchangeProductId: {
      propDefinition: [
        returnista,
        "exchangeProductId",
      ],
    },
    exchangeOptionSku: {
      propDefinition: [
        returnista,
        "exchangeOptionSku",
      ],
    },
    answers: {
      propDefinition: [
        returnista,
        "answers",
      ],
    },
  },
  async run({ $ }) {
    const answers = Array.isArray(this.answers)
      ? this.answers.map((a) => JSON.parse(a))
      : undefined;
    const response = await this.returnista.createDraftReturnOrder({
      $,
      consumerId: this.consumerId,
      data: {
        selectedPurchases: [
          {
            purchaseId: this.purchaseId,
            returnReasonId: this.returnReasonId || null,
            returnReasonComment: this.returnReasonComment,
            resolutionType: this.resolutionType,
            answers,
            exchangeProductId: this.exchangeProductId,
            exchangeOptionSku: this.exchangeOptionSku,
          },
        ],
      },
    });
    $.export("$summary", `Successfully created draft return order for consumer ${this.consumerId}`);
    return response;
  },
};
