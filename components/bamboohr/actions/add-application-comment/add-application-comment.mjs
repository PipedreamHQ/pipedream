import bamboohr from "../../bamboohr.app.mjs";

export default {
  key: "bamboohr-add-application-comment",
  name: "Add Application Comment",
  description: "Add a comment to an application. [See the documentation](https://documentation.bamboohr.com/reference/post-application-comment-1)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    bamboohr,
    applicationId: {
      propDefinition: [
        bamboohr,
        "applicationId",
      ],
    },
    comment: {
      type: "string",
      label: "Comment",
      description: "The comment to add to the application",
    },
  },
  async run({ $ }) {
    const response = await this.bamboohr.addApplicationComment({
      $,
      applicationId: this.applicationId,
      data: {
        comment: this.comment,
        type: "comment",
      },
    });
    $.export("$summary", `Added comment to application ${this.applicationId}`);
    return response;
  },
};
