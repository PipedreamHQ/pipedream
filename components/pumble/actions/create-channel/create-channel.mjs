import pumble from "../../pumble.app.mjs";

export default {
  key: "pumble-create-channel",
  name: "Create Channel",
  description: "Create a new channel in Pumble. [See the documentation](https://pumble.com/help/integrations/add-pumble-apps/api-keys-integration/#create-channel)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    pumble,
    name: {
      type: "string",
      label: "Channel Name",
      description: "Name of the new channel",
    },
    type: {
      type: "string",
      label: "Type",
      description: "Whether the new channel is public or private. Defaults to `public`",
      options: [
        "PUBLIC",
        "PRIVATE",
      ],
      default: "PUBLIC",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the new channel",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.pumble.createChannel({
      $,
      data: {
        name: this.name,
        type: this.type,
        description: this.description,
      },
    });
    $.export("$summary", `Successfully created channel with ID ${response.id}`);
    return response;
  },
};
