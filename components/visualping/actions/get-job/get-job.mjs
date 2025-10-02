import visualping from "../../app/visualping.app.mjs";

export default {
  key: "visualping-get-job",
  name: "Get Job Details By Id",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Get an existing job by id. [See the docs here](https://develop.api.visualping.io/doc.html#tag/Jobs/paths/~1v2~1jobs~1%7BjobId%7D/get)",
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
      workspaceId,
      jobId,
    } = this;

    const response = await visualping.getJob({
      workspaceId,
      jobId,
    });

    $.export("$summary", `Job with id ${jobId} was successfully fetched!`);
    return response;
  },
};
