import { sare } from "../../sare.app.mjs";

export default {
  key: "sare-list-groups-options",
  name: "List Groups Options",
  description: "Retrieves available options for the Groups field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    sare,
  },
  async run({ $ }) {
    const options = await sare.propDefinitions.groups.options.call(this.sare, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
