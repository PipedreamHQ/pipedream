import amplenote from "../../app/amplenote.app";
import { defineAction } from "@pipedream/types";
import { ConfigurationError } from "@pipedream/platform";

export default defineAction({
  name: "Create Task",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "amplenote-create-task",
  description: "Creates a new task. [See docs here](https://www.amplenote.com/api_documentation#post-/notes/-uuid-/actions)",
  type: "action",
  props: {
    amplenote,
    noteId: {
      propDefinition: [
        amplenote,
        "noteId",
      ],
    },
    nodes: {
      label: "Nodes",
      description: "Nodes to create the task. [Read more about nodes here] (https://www.amplenote.com/api_documentation#post-/notes/-uuid-/actions). E.g `{ \"type\": \"check_list_item\", \"content\": [ { \"type\": \"paragraph\", \"content\": [ { \"type\": \"text\", \"text\": \"Item 1\" } ] } ] }`",
      type: "string[]",
    },
  },
  async run({ $ }) {
    if (!Array.isArray(this.nodes)) {
      throw new ConfigurationError("Nodes is required be an array of objects");
    }

    this.nodes = this.nodes.map((node) => {
      return typeof node === "string"
        ? JSON.parse(node)
        : node;
    });

    const response = await this.amplenote.createTask({
      $,
      noteId: this.noteId,
      data: {
        type: "INSERT_NODES",
        nodes: this.nodes,
      },
    });

    $.export("$summary", "Successfully created task");

    return response;
  },
});
