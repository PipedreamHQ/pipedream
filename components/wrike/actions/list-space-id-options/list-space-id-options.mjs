// x-pd-ai: optimized
import wrike from "../../wrike.app.mjs";

export default {
  key: "wrike-list-space-id-options",
  name: "List Space ID Options",
  description: "Retrieves available spaces so callers can copy an ID into another action's free-form spaceId or folderId prop. [See the documentation](https://developers.wrike.com/reference/getspaces)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    wrike,
  },
  async run({ $ }) {
    const spaces = await this.wrike.listSpaces({
      $,
    });
    const options = spaces.map((space) => ({
      label: space.title,
      value: space.id,
    }));
    $.export("$summary", `Successfully retrieved ${options.length} space${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
