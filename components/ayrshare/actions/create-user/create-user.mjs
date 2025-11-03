import app from "../../ayrshare.app.mjs";

export default {
  key: "ayrshare-create-user",
  name: "Create User",
  description: "Create a new User Profile under your Primary Profile. [See the documentation](https://www.ayrshare.com/docs/apis/profiles/create-profile)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    title: {
      propDefinition: [
        app,
        "title",
      ],
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
    subHeader: {
      propDefinition: [
        app,
        "subHeader",
      ],
    },
    disableSocial: {
      propDefinition: [
        app,
        "disableSocial",
      ],
    },
    team: {
      propDefinition: [
        app,
        "team",
      ],
    },
    email: {
      propDefinition: [
        app,
        "email",
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
    const response = await this.app.createUser({
      $,
      data: {
        title: this.title,
        messagingActive: this.messagingActive,
        hideTopHeader: this.hideTopHeader,
        topHeader: this.topHeader,
        subHeader: this.subHeader,
        disableSocial: this.disableSocial,
        team: this.team,
        email: this.email,
        tags: this.tags,
      },
    });
    $.export("$summary", "Successfully created user with the profile Key: " + response.profileKey);
    return response;
  },
};
