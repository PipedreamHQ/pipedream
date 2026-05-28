import { control_d } from "../../control_d.app.mjs";

export default {
  key: "control_d-list-profile-id-options",
  name: "List Profile ID Options",
  description: "Retrieves available options for the Profile ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    control_d,
  },
  async run({ $ }) {
    const options = await control_d.propDefinitions.profileId.options.call(this.control_d, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
