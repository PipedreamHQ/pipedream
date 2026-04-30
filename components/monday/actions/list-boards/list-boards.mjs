import monday from "../../monday.app.mjs";

export default {
  key: "monday-list-boards",
  name: "List Boards",
  description: "List all boards. [See the documentation](https://developer.monday.com/api-reference/reference/boards)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    monday,
    page: {
      type: "integer",
      label: "Page",
      description: "The page number to return. Defaults to 1.",
      optional: true,
      default: 1,
      min: 1,
    },
  },
  async run({ $ }) {
    const response = await this.monday.listBoards({
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${response.data?.boards?.length} board${response.data?.boards?.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
