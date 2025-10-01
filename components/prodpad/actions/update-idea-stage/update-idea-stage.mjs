import app from "../../prodpad.app.mjs";

export default {
  key: "prodpad-update-idea-stage",
  name: "Update Idea Stage",
  description: "Updates the stage of an idea. [See the docs](https://app.swaggerhub.com/apis-docs/ProdPad/prodpad/1.0#/Ideas/PostIdeaStatus).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    ideaId: {
      propDefinition: [
        app,
        "ideaId",
      ],
    },
    statusId: {
      label: "Workflow Stage",
      propDefinition: [
        app,
        "statusId",
      ],
    },
  },
  methods: {
    updateStatusIdea({
      ideaId, ...args
    } = {}) {
      return this.app.create({
        path: `/ideas/${ideaId}/statuses`,
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      ideaId,
      statusId,
    } = this;

    const response = await this.updateStatusIdea({
      ideaId,
      data: {
        status_id: statusId,
      },
    });

    step.export("$summary", `Successfully updated workflow stage idea with ID ${response.id}`);

    return response;
  },
};
