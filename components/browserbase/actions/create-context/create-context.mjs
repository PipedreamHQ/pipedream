import browserbase from "../../browserbase.app.mjs";

export default {
  key: "browserbase-create-context",
  name: "Create Context",
  description: "Creates a new context in Browserbase. [See the documentation](https://docs.browserbase.com/reference/api/create-a-context)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    browserbase,
    projectId: {
      propDefinition: [
        browserbase,
        "projectId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.browserbase.createContext({
      $,
      data: {
        projectId: this.projectId,
      },
    });

    $.export("$summary", `Successfully created context with ID: ${response.id}`);

    return response;
  },
};
