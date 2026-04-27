import statuspage from "../../statuspage.app.mjs";

export default {
  name: "Update Incident",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "statuspage-update-incident",
  description: "Updates an existing incident. [See the documentation](https://developer.statuspage.io/#update-an-incident)",
  type: "action",
  props: {
    statuspage,
    pageId: {
      propDefinition: [
        statuspage,
        "pageId",
      ],
    },
    incidentId: {
      propDefinition: [
        statuspage,
        "incidentId",
        (c) => ({
          pageId: c.pageId,
        }),
      ],
    },
    status: {
      propDefinition: [
        statuspage,
        "status",
      ],
    },
    body: {
      label: "Body",
      description: "The body of the update",
      type: "string",
    },
    componentIds: {
      label: "Component IDs",
      description: "The IDs of the components affected by this incident update (e.g., `[\"ftgks51sfs2d\", \"bb5w0kc1234x\"]`). Leave empty to keep the existing affected components unchanged.",
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
    const response = await this.statuspage.updateIncident({
      $,
      pageId: this.pageId,
      incidentId: this.incidentId,
      data: {
        incident: {
          status: this.status,
          body: this.body,
          ...(this.componentIds?.length && {
            component_ids: this.componentIds,
          }),
        },
      },
    });

    if (response) {
      $.export("$summary", `Successfully updated incident with id ${response.id}`);
    }

    return response;
  },
};
