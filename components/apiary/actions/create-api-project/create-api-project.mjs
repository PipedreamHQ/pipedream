import app from "../../apiary.app.mjs";

export default {
  key: "apiary-create-api-project",
  name: "Create API Project",
  description: "Create a new API project. [See the documentation](https://apiary.docs.apiary.io/#reference/blueprint/create-api-project/create-api-project)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    type: {
      propDefinition: [
        app,
        "type",
      ],
    },
    public: {
      propDefinition: [
        app,
        "public",
      ],
    },
    desiredName: {
      propDefinition: [
        app,
        "desiredName",
      ],
    },
    code: {
      propDefinition: [
        app,
        "code",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createApiProject({
      $,
      data: {
        type: this.type,
        public: this.public,
        desiredName: this.desiredName,
        code: this.code,
      },
    });

    $.export("$summary", `Successfully created a new API Project with the following domain: ${response.domain}`);

    return response;
  },
};
