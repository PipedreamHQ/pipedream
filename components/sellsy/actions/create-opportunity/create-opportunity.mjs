import sellsy from "../../sellsy.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "sellsy-create-opportunity",
  name: "Create Opportunity",
  description: "Forms a new opportunity in Sellsy. [See the documentation](https://api.sellsy.com/doc/v2/#operation/create-opportunity)",
  version: "0.0.1",
  type: "action",
  props: {
    sellsy,
    name: {
      type: "string",
      label: "Name",
      description: "Name of the opportunity",
    },
    companyId: {
      propDefinition: [
        sellsy,
        "companyId",
      ],
    },
    pipelineId: {
      propDefinition: [
        sellsy,
        "pipelineId",
      ],
    },
    stepId: {
      propDefinition: [
        sellsy,
        "stepId",
        (c) => ({
          pipelineId: c.pipelineId,
        }),
      ],
    },
    status: {
      type: "string",
      label: "Status",
      description: "Status of the opportunity",
      options: constants.OPPORTUNITY_STATUS,
      optional: true,
    },
    amount: {
      type: "string",
      label: "Amount",
      description: "Potential Opportunity Amount (in the default currency selected for the account)",
      optional: true,
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "Due date of the opportunity. Example: `1970-01-01`",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.sellsy.createOpportunity({
      $,
      data: {
        name: this.name,
        status: this.status,
        amount: this.amount,
        due_date: this.dueDate,
        pipeline: this.pipelineId,
        step: this.stepId,
        related: [
          {
            id: this.companyId,
            type: "company",
          },
        ],
      },
    });
    $.export("$summary", `Successfully created opportunity ${this.name}`);
    return response;
  },
};
