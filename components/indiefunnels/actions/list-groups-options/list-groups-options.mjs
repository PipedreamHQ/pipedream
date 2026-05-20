import indiefunnels from "../../indiefunnels.app.mjs";

export default {
  key: "indiefunnels-list-groups-options",
  name: "List Member Groups Options",
  description: "Retrieves available options for the Member Groups field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    indiefunnels,
  },
  async run({ $ }) {
    const options = await indiefunnels.propDefinitions.groups.options.call(this.indiefunnels);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
