import gagelist from "../../gagelist.app.mjs";

export default {
  key: "gagelist-list-manufacturer-options",
  name: "List Manufacturer Options",
  description: "Retrieves available options for the Manufacturer field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    gagelist,
  },
  async run({ $ }) {
    const options = await gagelist.propDefinitions.manufacturer.options.call(this.gagelist);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
