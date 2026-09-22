import minform from "../../minform.app.mjs";

export default {
  key: "minform-get-form-submissions",
  name: "Get Form Submissions",
  description: "Returns the 10 most recent submissions for a form. [See the documentation](https://minform-pipedream-api-docs.solutionportal.workers.dev/submissions/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    minform,
    formId: {
      propDefinition: [
        minform,
        "formId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.minform.listSubmissions({
      $,
      params: {
        slug: this.formId,
      },
    });
    $.export("$summary", `Found ${response?.length ?? 0} submission${response?.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
