import minform from "../../minform.app.mjs";

export default {
  key: "minform-list-forms",
  name: "List Forms",
  description: "List forms the authenticated user can access across their workspaces. [See the documentation](https://minform-pipedream-api-docs.solutionportal.workers.dev/forms/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    minform,
    page: {
      type: "integer",
      label: "Page",
      description: "The page number to get. The first page is 0.",
      default: 0,
      min: 0,
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The number of forms to get per page. The default is 25.",
      default: 25,
      min: 1,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.minform.listForms({
      $,
      params: {
        page: this.page,
        limit: this.limit,
      },
    });
    $.export("$summary", `Found ${response?.length ?? 0} form${response?.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
