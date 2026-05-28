import { microsoft_365_people } from "../../microsoft_365_people.app.mjs";

export default {
  key: "microsoft_365_people-list-folder-id-options",
  name: "List Folder ID Options",
  description: "Retrieves available options for the Folder ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    microsoft_365_people,
  },
  async run({ $ }) {
    const options = await microsoft_365_people.propDefinitions.folderId.options
      .call(this.microsoft_365_people, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
