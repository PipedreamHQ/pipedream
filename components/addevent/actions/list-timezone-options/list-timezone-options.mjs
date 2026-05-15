import addevent from "../../addevent.app.mjs";

export default {
  key: "addevent-list-timezone-options",
  name: "List Timezone Options",
  description: "Retrieves available options for the Timezone field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    addevent,
  },
  async run({ $ }) {
    const options = await addevent.propDefinitions.timezone.options.call(this.addevent);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
