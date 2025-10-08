import app from "../../weaviate.app.mjs";

export default {
  key: "weaviate-create-class",
  name: "Create Class",
  description: "Create a new class in Weaviate. [See the documentation](https://docs.weaviate.io/weaviate/api/rest#tag/schema/post/schema)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    className: {
      propDefinition: [
        app,
        "className",
      ],
    },
    properties: {
      propDefinition: [
        app,
        "properties",
      ],
    },
    description: {
      propDefinition: [
        app,
        "description",
      ],
    },
    multiTenancyEnabled: {
      propDefinition: [
        app,
        "multiTenancyEnabled",
      ],
    },
    vectorIndexType: {
      propDefinition: [
        app,
        "vectorIndexType",
      ],
    },
  },
  async run({ $ }) {
    const parsedProperties = this.properties?.map((p) => JSON.parse(p)) || [];
    const response = await this.app.createClass({
      $,
      data: {
        class: this.className,
        description: this.description,
        vectorizer: this.vectorizer,
        multiTenancyConfig: {
          enabled: this.multiTenancyEnabled,
        },
        vectorIndexType: this.vectorIndexType,
        properties: parsedProperties,
      },
    });
    $.export("$summary", "Successfully sent the request to create a new class");
    return response;
  },
};
