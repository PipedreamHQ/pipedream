import visualping from "../../app/visualping.app.mjs";

export default {
  key: "visualping-delete-job",
  name: "Delete Job",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Delete an existing job by id. [See the docs here](https://develop.api.visualping.io/doc.html#tag/Jobs/paths/~1v2~1jobs~1%7BjobId%7D/delete)",
  type: "action",
  props: {
    visualping,
    workspaceId: {
      propDefinition: [
        visualping,
        "workspaceId",
      ],
    },
    jobId: {
      propDefinition: [
        visualping,
        "jobId",
        ({ workspaceId }) => ({
          workspaceId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      visualping,
      jobId,
      workspaceId,
    } = this;

    const response = await visualping.deleteJob({
      jobId,
      workspaceId,
    });

    $.export("$summary", `Job with id ${jobId} successfully deleted!`);
    return response;
  },
};
