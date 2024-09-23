import offlight from "../../offlight.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "offlight-create-task",
  name: "Create Task",
  description: "Initiates the creation of a new task in Offlight. [See the documentation](https://www.offlight.work/docs/zapeir-api)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    offlight,
    taskName: {
      propDefinition: [
        offlight,
        "taskName",
      ],
    },
    taskNote: {
      propDefinition: [
        offlight,
        "taskNote",
      ],
      optional: true,
    },
    taskDeadline: {
      propDefinition: [
        offlight,
        "taskDeadline",
      ],
      optional: true,
    },
    identifier: {
      propDefinition: [
        offlight,
        "identifier",
      ],
      optional: true,
    },
    sourceName: {
      propDefinition: [
        offlight,
        "sourceName",
      ],
      optional: true,
    },
    sourceLink: {
      propDefinition: [
        offlight,
        "sourceLink",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.offlight.createTask({
      taskName: this.taskName,
      taskNote: this.taskNote,
      taskDeadline: this.taskDeadline,
      identifier: this.identifier,
      sourceName: this.sourceName,
      sourceLink: this.sourceLink,
    });

    $.export("$summary", `Task successfully created with ID: ${response.id}`);
    return response;
  },
};
