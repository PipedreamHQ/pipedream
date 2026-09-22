import flowla from "../../flowla.app.mjs";
import currencies from "../../common/currencies.mjs";

export default {
  key: "flowla-create-flow-from-template",
  name: "Create Flow From Template",
  description: "Create a new flow in Flowla from a pre-existing template. [See the documentation](https://api.flowla.com/docs#/default/ApiV1Controller_useTemplate)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    flowla,
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The ID of the template to use, present at the end of the URL when using a template in Flowla's UI. Example: `3a30f67e-f436-40ca-aa93-fc4e1d0493fa`",
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the flow",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address to use",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "A description of the flow",
      optional: true,
    },
    companyId: {
      propDefinition: [
        flowla,
        "companyId",
      ],
      optional: true,
    },
    labelId: {
      propDefinition: [
        flowla,
        "labelId",
      ],
      optional: true,
    },
    statusId: {
      propDefinition: [
        flowla,
        "statusId",
      ],
      optional: true,
    },
    userId: {
      propDefinition: [
        flowla,
        "userId",
      ],
      optional: true,
    },
    amount: {
      type: "string",
      label: "Amount",
      description: "The amount",
      optional: true,
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "The currency to use",
      options: currencies,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.flowla.createFlowFromTemplate({
      $,
      data: {
        templateId: this.templateId,
        title: this.title,
        email: this.email,
        description: this.description,
        companyId: this.companyId,
        labelId: this.labelId,
        statusId: this.statusId,
        userId: this.userId,
        amount: this.amount
          ? parseFloat(this.amount)
          : undefined,
        currency: this.currency,
      },
    });
    $.export("$summary", "Successfully created flow from template");
    return response;
  },
};
