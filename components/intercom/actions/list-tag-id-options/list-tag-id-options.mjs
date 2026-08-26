// x-pd-ai: optimized
import intercom from "../../intercom.app.mjs";

export default {
  key: "intercom-list-tag-id-options",
  name: "List Tag ID Options",
  description: "Retrieves all tags in your Intercom workspace and returns their IDs and names. Call this action before **Add Tag To Contact** to discover valid tag IDs. Example: returns `[{ label: \"VIP\", value: \"7522907\" }, ...]`. [See the documentation](https://developers.intercom.com/docs/references/rest-api/api.intercom.io/tags/listtags).",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    intercom,
  },
  async run({ $ }) {
    const { data: tags } = await this.intercom.listTags();
    const options = tags.map(({
      id: value, name: label,
    }) => ({
      label,
      value,
    }));
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
