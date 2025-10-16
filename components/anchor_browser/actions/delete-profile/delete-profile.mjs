import app from "../../anchor_browser.app.mjs";

export default {
  key: "anchor_browser-delete-profile",
  name: "Delete Profile",
  description: "Deletes an existing profile by its name. [See the documentation](https://docs.anchorbrowser.io/api-reference/profiles/delete-profile).",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    profileName: {
      description: "The name of the profile to delete.",
      propDefinition: [
        app,
        "profileName",
      ],
    },
  },
  methods: {
    deleteProfile({
      profileName, ...args
    } = {}) {
      return this.app.delete({
        path: `/profiles/${encodeURIComponent(profileName)}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      deleteProfile,
      profileName,
    } = this;

    const response = await deleteProfile({
      $,
      profileName,
    });

    $.export("$summary", "Successfully deleted profile.");
    return response;
  },
};
