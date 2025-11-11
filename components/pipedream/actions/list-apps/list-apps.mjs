import app from "../../pipedream.app.mjs";

export default {
  key: "pipedream-list-apps",
  name: "List Apps",
  description: "List all available Pipedream apps. [See the documentation](https://pipedream.com/docs/rest-api/api-reference/apps/list-apps)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
    idempotentHint: true,
  },
  type: "action",
  props: {
    app,
    q: {
      propDefinition: [
        app,
        "q",
      ],
    },
    hasComponents: {
      propDefinition: [
        app,
        "hasComponents",
      ],
    },
    hasActions: {
      propDefinition: [
        app,
        "hasActions",
      ],
    },
    hasTriggers: {
      propDefinition: [
        app,
        "hasTriggers",
      ],
    },
  },
  methods: {
    toNumber(value) {
      return value === "1" || value === 1 || value === "true" || value === true
        ? "1"
        : value;
    },
  },
  async run({ $ }) {
    const {
      app,
      toNumber,
      q,
      hasComponents,
      hasActions,
      hasTriggers,
    } = this;

    const response = await app.listApps({
      $,
      params: {
        q,
        has_components: toNumber(hasComponents),
        has_actions: toNumber(hasActions),
        has_triggers: toNumber(hasTriggers),
      },
    });

    $.export("$summary", `Successfully retrieved ${response.page_info.count} app(s)`);
    return response;
  },
};
