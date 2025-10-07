import { defineAction } from "@pipedream/types";
import nectar_crm from "../../app/nectar_crm.app";
import constants from "../common/constants";

export default defineAction({
  key: "nectar_crm-create-sale-opportunity",
  name: "Create Sale Opportunity",
  description: "Created a sale opportunity. [See docs here](https://nectarcrm.docs.apiary.io/#reference/0/oportunidades/criar)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    nectar_crm,
    contactId: {
      propDefinition: [
        nectar_crm,
        "contactId",
      ],
    },
    name: {
      label: "Name",
      description: "The name of the sale opportunity",
      type: "string",
    },
    dueDate: {
      label: "Due Date",
      description: "The due date to finish the sale opportunity. E.g. `2022-07-20T00:00:00-03:00`",
      type: "string",
      optional: true,
    },
    observation: {
      label: "Observation",
      description: "The observation of the sale opportunity",
      type: "string",
      optional: true,
    },
    monthlyAmount: {
      label: "Monthly Amount",
      description: "The monthly amount of the sale opportunity",
      type: "integer",
      optional: true,
    },
    probability: {
      label: "Probability",
      description: "The probability of the sale opportunity. E.g. `40`",
      type: "integer",
      min: 0,
      max: 100,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.nectar_crm.createSaleOpportunity({
      $,
      data: {
        nome: this.name,
        cliente: {
          id: this.contactId,
        },
        dataLimite: this.dueDate,
        observacao: this.observation,
        valorMensal: this.monthlyAmount,
        probabilidade: this.probability,
      },
    });

    $.export("$summary", `Successfully created sale opportunity with id ${response.id}`);

    return response;
  },
});
