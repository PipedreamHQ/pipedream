import statuspage from "../../statuspage.app.mjs";

export default {
  name: "Create Incident",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "statuspage-create-incident",
  description: "Creates an incident. [See docs here](https://developer.statuspage.io/#create-an-incident)",
  type: "action",
  props: {
    statuspage,
    pageId: {
      propDefinition: [
        statuspage,
        "pageId",
      ],
    },
    name: {
      label: "Name",
      description: "The name of the incident",
      type: "string",
    },
    status: {
      propDefinition: [
        statuspage,
        "status",
      ],
    },
    message: {
      label: "Message",
      description: "The description of the incident",
      type: "string",
    },
    componentIds: {
      label: "Component IDs",
      description: "The IDs of the component that will be affected",
      type: "string[]",
      propDefinition: [
        statuspage,
        "componentId",
        (c) => ({
          pageId: c.pageId,
        }),
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.statuspage.createIncident({
      $,
      pageId: this.pageId,
      data: {
        incident: {
          name: this.name,
          status: this.status,
          message: this.message,
          component_ids: this.componentIds,
        },
      },
    });

    if (response) {
      $.export("$summary", `Successfully created incident with id ${response.id}`);
    }

    return response;
  },
};
