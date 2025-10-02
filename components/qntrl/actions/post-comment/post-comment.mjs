import qntrl from "../../qntrl.app.mjs";

export default {
  key: "qntrl-post-comment",
  name: "Post Comment",
  description: "Posts a new comment under a specific job. [See the documentation](https://core.qntrl.com/apidoc.html?type=reference&module=jobs&action=PostComment)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    qntrl,
    orgId: {
      propDefinition: [
        qntrl,
        "orgId",
      ],
    },
    jobId: {
      propDefinition: [
        qntrl,
        "jobId",
        (({ orgId }) => ({
          orgId,
        })),
      ],
    },
    content: {
      type: "string",
      label: "Content",
      description: "Comment to be posted.",
    },
  },
  async run({ $ }) {
    const {
      qntrl, orgId, jobId, content,
    } = this;
    const response = await qntrl.postComment({
      $,
      orgId,
      jobId,
      data: {
        content,
      },
    });

    $.export("$summary", `Successfully posted a comment under job ID ${this.jobId}`);
    return response;
  },
};
