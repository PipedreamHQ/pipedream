import app from "../../brainbase_labs.app.mjs";

export default {
  key: "brainbase-update-worker",
  name: "Update Worker",
  description: "Update an existing worker. [See the documentation](https://docs.usebrainbase.com)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    workerId: {
      propDefinition: [
        app,
        "workerId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the worker",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Worker description",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Worker status",
      optional: true,
      options: [
        "active",
        "inactive",
        "archived",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.updateWorker({
      $,
      workerId: this.workerId,
      data: {
        name: this.name,
        description: this.description,
        status: this.status,
      },
    });

    $.export("$summary", `Successfully updated worker "${this.name}"`);
    return response;
  },
};

