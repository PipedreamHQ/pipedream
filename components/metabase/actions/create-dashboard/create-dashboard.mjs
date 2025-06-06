import app from "../../metabase.app.mjs";

export default {
  key: "metabase-create-dashboard",
  name: "Create Dashboard",
  description: "Create a new dashboard in Metabase. [See the documentation](https://www.metabase.com/docs/latest/api#tag/apidashboard/POST/api/dashboard/).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the dashboard",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the dashboard",
      optional: true,
    },
    collectionId: {
      propDefinition: [
        app,
        "collectionId",
      ],
      optional: true,
    },
    parameters: {
      type: "object",
      label: "Parameters",
      description: "Dashboard parameters configuration",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      name,
      description,
      collectionId,
      parameters,
    } = this;

    const data = {
      name,
      parameters: parameters || [],
    };

    if (description) {
      data.description = description;
    }

    if (collectionId !== undefined) {
      data.collection_id = collectionId;
    }

    const response = await this.app.createDashboard({
      $,
      data,
    });

    $.export("$summary", `Successfully created dashboard "${name}" with ID ${response.id}`);

    return response;
  },
};
