import app from "../../universal_api.app.mjs";

export default {
  key: "universal_api-create-consumer",
  name: "Create Consumer",
  description:
    "Create a new consumer via the Platform API on Universal API. [See the documentation](https://docs.universalapi.io/reference/create-consumer).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the consumer to create.",
    },
  },
  async run({ $ }) {
    const response = await this.app.createConsumer({
      $,
      data: {
        name: this.name,
      },
    });
    $.export("$summary", `Successfully created consumer${response.data?.id
      ? ` ${response.data.id}`
      : ""}: ${this.name}`);
    return response;
  },
};
