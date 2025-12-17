import app from "../../fly_io.app.mjs";

export default {
  key: "fly_io-create-app",
  name: "Create App",
  description: "Create an app with the specified details in the request body. [See the documentation](https://docs.machines.dev/#tag/apps/post/apps)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    appName: {
      type: "string",
      label: "App Name",
      description: "The name of the app",
    },
    enableSubdomains: {
      type: "boolean",
      label: "Enable Subdomains",
      description: "Whether to enable subdomains for the app",
      optional: true,
    },
    network: {
      type: "string",
      label: "Network",
      description: "The network for the app",
      optional: true,
    },
  },
  methods: {
    createApp(args = {}) {
      return this.app.post({
        path: "/apps",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      app,
      createApp,
      appName,
      enableSubdomains,
      network,
    } = this;

    const response = await createApp({
      $,
      data: {
        app_name: appName,
        enable_subdomains: enableSubdomains,
        network,
        org_slug: app.getOrgSlug(),
      },
    });

    $.export("$summary", `Successfully created app with ID \`${response.id}\``);
    return response;
  },
};
