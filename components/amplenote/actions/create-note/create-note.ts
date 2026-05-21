import amplenote from "../../app/amplenote.app";
import { defineAction } from "@pipedream/types";
import { parseObjectArray } from "../../common/utils";

export default defineAction({
  name: "Create Note",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "amplenote-create-note",
  description: "Creates a new note. [See the documentation](https://www.amplenote.com/api_documentation#post-/notes)",
  type: "action",
  props: {
    amplenote,
    name: {
      label: "Name of the Note",
      description: "Title to identify the note",
      type: "string",
    },
    tags: {
      label: "Tags",
      description: "Tags to create the task. E.g `[{ \"text\": \"string\", \"color\": \"string\" }]`",
      type: "string[]",
    },
  },
  async run({ $ }) {
    const tags = parseObjectArray(this.tags, "Tags");

    const response = await this.amplenote.createNote({
      $,
      data: {
        name: this.name,
        tags,
      },
    });

    $.export("$summary", `Successfully created note with UUID ${response.uuid}`);

    return response;
  },
});
