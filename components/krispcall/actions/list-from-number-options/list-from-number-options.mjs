import krispcall from "../../krispcall.app.mjs";

export default {
  key: "krispcall-list-from-number-options",
  name: "List From Number Options",
  description: "Retrieves available options for the From Number field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    krispcall,
  },
  async run({ $ }) {
    const options = await krispcall.propDefinitions.fromNumber.options.call(this.krispcall);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
