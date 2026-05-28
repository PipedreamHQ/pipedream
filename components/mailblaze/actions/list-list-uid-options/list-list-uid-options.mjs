import mailblaze from "../../mailblaze.app.mjs";

export default {
  key: "mailblaze-list-list-uid-options",
  name: "List List UID Options",
  description: "Retrieves available options for the List UID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    mailblaze,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await mailblaze.propDefinitions.listUid.options.call(this.mailblaze, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
