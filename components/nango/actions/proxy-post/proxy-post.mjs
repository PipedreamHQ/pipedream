import app from "../../nango.app.mjs";

export default {
  key: "nango-proxy-post",
  name: "Proxy Post Request",
  description: "Make a post request with the Proxy. [See the Documentation](https://docs.nango.dev/api-reference/proxy/post)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    anyPath: {
      propDefinition: [
        app,
        "anyPath",
      ],
    },
    connectionId: {
      propDefinition: [
        app,
        "connectionId",
      ],
    },
    providerConfigKey: {
      description: "The Provider Config Key of the connection.",
      propDefinition: [
        app,
        "providerConfigKey",
      ],
    },
    retries: {
      propDefinition: [
        app,
        "retries",
      ],
    },
    baseUrlOverride: {
      propDefinition: [
        app,
        "baseUrlOverride",
      ],
    },
    anyBodyParam: {
      type: "object",
      label: "Any Body Param",
      description: "The Any Body Param of the request.",
      optional: true,
    },
  },
  methods: {
    proxyPost({
      anyPath, ...args
    } = {}) {
      return this.app.post({
        path: `/proxy${anyPath}`,
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      anyPath,
      connectionId,
      providerConfigKey,
      retries,
      baseUrlOverride,
      anyBodyParam,
    } = this;

    const response = await this.proxyPost({
      step,
      anyPath,
      headers: {
        "Connection-Id": connectionId,
        "Provider-Config-Key": providerConfigKey,
        "Retries": retries,
        "Base-Url-Override": baseUrlOverride,
      },
      data: anyBodyParam,
    });

    step.export("$summary", `Successfully made a post request to ${anyPath}.`);

    return response;
  },
};
