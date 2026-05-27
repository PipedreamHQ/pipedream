import amplenote from "../../app/amplenote.app";
import { defineAction } from "@pipedream/types";
import { parseObjectArray } from "../../common/utils";

export default defineAction({
  name: "Create Task",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "amplenote-create-task",
  description: "Creates a new task. [See the documentation](https://www.amplenote.com/api_documentation#post-/notes/-uuid-/actions)",
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
      type: "object",
    },
  },
  async run({ $ }) {
    const nodes = parseObjectArray(this.nodes, "Nodes");

    const response = await this.amplenote.createTask({
      $,
      noteId: this.noteId,
      data: {
        type: "INSERT_NODES",
        nodes,
      },
    });

    $.export("$summary", "Successfully created task");

    return response;
  },
});
