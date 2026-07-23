// x-pd-ai: optimized
import wrike from "../../wrike.app.mjs";

export default {
  key: "wrike-list-custom-fields-keys-options",
  name: "List Custom Fields Keys Options",
  description: "Retrieves available custom fields so callers can copy field IDs into free-form customFields props in other actions. [See the documentation](https://developers.wrike.com/reference/getcustomfields)",
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
    const customFields = await this.wrike.listCustomFields({
      $,
    });
    const options = customFields.map((field) => ({
      label: field.title,
      value: field.id,
    }));
    $.export("$summary", `Successfully retrieved ${options.length} custom field${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
