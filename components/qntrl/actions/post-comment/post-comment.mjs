import qntrl from "../../qntrl.app.mjs";

export default {
  key: "qntrl-post-comment",
  name: "Post Comment",
  description: "Posts a new comment under a specific job. The 'job id' and 'comment' props are required. Additional optional props are 'attachment' for any documents or files. [See the documentation](https://coreapi.qntrl.com/blueprint/api)",
  version: "0.0.1",
  type: "action",
  props: {
    qntrl,
    jobId: {
      propDefinition: [
        qntrl,
        "jobId",
      ],
    },
    comment: {
      propDefinition: [
        qntrl,
        "comment",
      ],
    },
    attachment: {
      propDefinition: [
        qntrl,
        "attachment",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.qntrl.postComment({
      jobId: this.jobId,
      comment: this.comment,
      attachment: this.attachment,
    });

    $.export("$summary", `Successfully posted a comment under job ID ${this.jobId}`);
    return response;
  },
};
