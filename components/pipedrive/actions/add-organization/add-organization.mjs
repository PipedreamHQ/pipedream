import pipedriveApp from "../../pipedrive.app.mjs";

export default {
  key: "pipedrive-add-organization",
  name: "Add Organization",
  description: "Adds a new organization. See the Pipedrive API docs for Organizations [here](https://developers.pipedrive.com/docs/api/v1/Organizations#addOrganization)",
  version: "0.1.2",
  type: "action",
  props: {
    pipedriveApp,
    name: {
      type: "string",
      label: "Name",
      description: "Organization name",
    },
    ownerId: {
      label: "Owner ID",
      description: "ID of the user who will be marked as the owner of this organization. When omitted, the authorized user ID will be used.",
      propDefinition: [
        pipedriveApp,
        "userId",
      ],
    },
    visibleTo: {
      propDefinition: [
        pipedriveApp,
        "visibleTo",
      ],
      description: "Visibility of the organization. If omitted, visibility will be set to the default visibility setting of this item type for the authorized user.",
    },
    addTime: {
      propDefinition: [
        pipedriveApp,
        "addTime",
      ],
      description: "Optional creation date & time of the organization in UTC. Requires admin user API token. Format: `YYYY-MM-DD HH:MM:SS`",
    },
  },
  async run({ $ }) {
    const {
      name,
      ownerId,
      visibleTo,
      addTime,
    } = this;

    try {
      const resp =
        await this.pipedriveApp.addOrganization({
          name,
          owner_id: ownerId,
          visible_to: visibleTo,
          add_time: addTime,
        });

      $.export("$summary", "Successfully added organization");

      return resp;
    } catch (error) {
      console.error(error.context?.body || error);
      throw error.context?.body?.error || "Failed to add organization";
    }
  },
};
