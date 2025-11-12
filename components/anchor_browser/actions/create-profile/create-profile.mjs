import app from "../../anchor_browser.app.mjs";

export default {
  key: "anchor_browser-create-profile",
  name: "Create Profile",
  description: "Creates a new profile from a session. A Profile stores cookies, local storage, and cache. [See the documentation](https://docs.anchorbrowser.io/api-reference/profiles/create-profile).",
  version: "0.0.3",
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
    createProfile(args = {}) {
      return this.app.post({
        path: "/profiles",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createProfile,
      name,
      description,
      source,
      sessionId,
    } = this;

    const response = await createProfile({
      $,
      data: {
        name,
        description,
        source,
        session_id: sessionId,
      },
    });

    $.export("$summary", "Successfully created profile.");
    return response;
  },
};
