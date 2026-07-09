import minform from "../../minform.app.mjs";

export default {
  key: "minform-list-forms",
  name: "List Forms",
  description: "List all forms",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    minform,
  },
  async run({ $ }) {
    const response = await this.minform.listForms({
      $,
    });
    $.export("$summary", `Found ${response?.length ?? 0} form${response?.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
