import app from "../../pipedream.app.mjs";

export default {
  key: "pipedream-get-component-from-global-registry",
  name: "Get Component From Global Registry",
  description: "Get details for a component from the Pipedream global registry. [See the documentation](https://pipedream.com/docs/rest-api/api-reference/components/get-a-component-from-the-global-registry)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
    idempotentHint: true,
  },
  type: "action",
  props: {
    app,
    key: {
      propDefinition: [
        app,
        "componentKey",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      key,
    } = this;

    const response = await app.getComponentFromRegistry({
      $,
      key,
    });

    if (response.data) {
      $.export("$summary", `Successfully fetched component with key \`${key}\``);
    } else {
      $.export("$summary", `Component \`${key}\` was not found`);
    }

    return response;
  },
};
