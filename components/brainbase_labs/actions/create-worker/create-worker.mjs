import app from "../../brainbase_labs.app.mjs";

export default {
  key: "brainbase-create-worker",
  name: "Create Worker",
  description: "Create a new worker for the team. [See the documentation](https://docs.usebrainbase.com)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
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
    const response = await this.app.createWorker({
      $,
      data: {
        name: this.name,
        description: this.description,
        status: this.status,
      },
    });

    $.export("$summary", `Successfully created worker "${this.name}"`);
    return response;
  },
};

