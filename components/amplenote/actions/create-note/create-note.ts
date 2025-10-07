import amplenote from "../../app/amplenote.app";
import { defineAction } from "@pipedream/types";
import { ConfigurationError } from "@pipedream/platform";

export default defineAction({
  name: "Create Note",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "amplenote-create-note",
  description: "Creates a new note. [See docs here](https://www.amplenote.com/api_documentation#post-/notes)",
  type: "action",
  props: {
    amplenote,
    name: {
      label: "Name of the note",
      description: "Title to identify the note",
      type: "string",
    },
    tags: {
      label: "Tags",
      description: "Tags to create the task. E.g `{ \"text\": \"string\", \"color\": \"string\" }`",
      type: "string[]",
    },
  },
  async run({ $ }) {
    if (!Array.isArray(this.tags)) {
      throw new ConfigurationError("Tags is required be an array of objects");
    }

    this.tags = this.tags.map((tag) => {
      return typeof tag === "string"
        ? JSON.parse(tag)
        : tag;
    });

    const response = await this.amplenote.createNote({
      $,
      data: {
        name: this.name,
        tags: this.tags,
      },
    });

    $.export("$summary", "Successfully created note");

    return response;
  },
});
