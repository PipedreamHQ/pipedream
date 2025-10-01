import app from "../../revolt.app.mjs";

export default {
  key: "revolt-create-group",
  name: "Create Group",
  description: "Create a new group channel. [See the documentation](https://developers.revolt.chat/developers/api/reference.html#tag/groups/post/channels/create)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
    description: {
      propDefinition: [
        app,
        "description",
      ],
      optional: true,
    },
    users: {
      propDefinition: [
        app,
        "users",
      ],
      optional: true,
    },
    nsfw: {
      propDefinition: [
        app,
        "nsfw",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.createGroup({
      $,
      data: {
        name: this.name,
        description: this.description,
        users: this.users,
        nsfw: this.nsfw,
      },
    });

    $.export("$summary", `Successfully created group with ID: '${response._id}'`);

    return response;
  },
};
