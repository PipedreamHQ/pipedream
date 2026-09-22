import mailmodo from "../../mailmodo.app.mjs";

export default {
  key: "mailmodo-list-list-name-options",
  name: "List List Options",
  description: "Retrieves available options for the List field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    mailmodo,
  },
  async run({ $ }) {
    const options = await mailmodo.propDefinitions.listName.options.call(this.mailmodo);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
