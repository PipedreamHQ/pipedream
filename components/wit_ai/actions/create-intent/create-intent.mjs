import app from "../../wit_ai.app.mjs";

export default {
  key: "wit_ai-create-intent",
  name: "Create Intent",
  description: "Creates a new intent. [See the documentation](https://wit.ai/docs/http/20240304/#post__intents_link)",
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
      type: "string",
      label: "Name",
      description: "Name for the intent.",
    },
  },
  methods: {
    createIntent(args = {}) {
      return this.app.post({
        path: "/intents",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createIntent,
      name,
    } = this;
    const response = await createIntent({
      $,
      data: {
        name,
      },
    });
    $.export("$summary", "Successfully created intent");
    return response;
  },
};
