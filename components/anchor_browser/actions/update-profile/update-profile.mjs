import app from "../../anchor_browser.app.mjs";

export default {
  key: "anchor_browser-update-profile",
  name: "Update Profile",
  description: "Updates the description or data of an existing profile using a session. [See the documentation](https://docs.anchorbrowser.io/api-reference/profiles/update-profile).",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    profileName: {
      propDefinition: [
        app,
        "profileName",
      ],
    },
    description: {
      propDefinition: [
        app,
        "description",
      ],
    },
    source: {
      propDefinition: [
        app,
        "source",
      ],
    },
    sessionId: {
      propDefinition: [
        app,
        "sessionId",
      ],
    },
  },
  methods: {
    updateProfile({
      profileName, ...args
    } = {}) {
      return this.app.put({
        path: `/profiles/${encodeURIComponent(profileName)}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      updateProfile,
      profileName,
      description,
      source,
      sessionId,
    } = this;

    const response = await updateProfile({
      $,
      profileName,
      data: {
        description,
        source,
        session_id: sessionId,
      },
    });

    $.export("$summary", "Successfully updated profile.");
    return response;
  },
};
