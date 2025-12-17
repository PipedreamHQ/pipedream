import app from "../../ayrshare.app.mjs";

export default {
  key: "ayrshare-update-user",
  name: "Update User",
  description: "Update an existing profile. [See the documentation](https://www.ayrshare.com/docs/apis/profiles/update-profile)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    profileKey: {
      propDefinition: [
        app,
        "profileKey",
      ],
    },
    title: {
      propDefinition: [
        app,
        "title",
      ],
      description: "Unique title of the profile that will be updated",
    },
    messagingActive: {
      propDefinition: [
        app,
        "messagingActive",
      ],
    },
    hideTopHeader: {
      propDefinition: [
        app,
        "hideTopHeader",
      ],
    },
    topHeader: {
      propDefinition: [
        app,
        "topHeader",
      ],
    },
    disableSocial: {
      propDefinition: [
        app,
        "disableSocial",
      ],
    },
    tags: {
      propDefinition: [
        app,
        "tags",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.updateUser({
      $,
      data: {
        title: this.title,
        messagingActive: this.messagingActive,
        hideTopHeader: this.hideTopHeader,
        topHeader: this.topHeader,
        disableSocial: this.disableSocial,
        tags: this.tags,
        profileKey: this.profileKey,
      },
    });
    $.export("$summary", "Successfully sent the request to update the user profile. Status: " + response.status);
    return response;
  },
};
