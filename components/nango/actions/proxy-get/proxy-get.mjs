import app from "../../nango.app.mjs";

export default {
  key: "nango-proxy-get",
  name: "Proxy Get Request",
  description: "Make a post request with the Proxy. [See the Documentation](https://docs.nango.dev/api-reference/proxy/get)",
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
    anyQueryParams: {
      type: "object",
      label: "Any Query Params",
      description: "The Query Params of the request.",
      optional: true,
    },
  },
  methods: {
    proxyGet({
      anyPath, ...args
    } = {}) {
      return this.app.makeRequest({
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
      anyQueryParams,
    } = this;

    const response = await this.proxyGet({
      step,
      anyPath,
      headers: {
        "Connection-Id": connectionId,
        "Provider-Config-Key": providerConfigKey,
        "Retries": retries,
        "Base-Url-Override": baseUrlOverride,
      },
      params: anyQueryParams,
    });

    step.export("$summary", `Successfully made a get request to ${anyPath}.`);

    return response;
  },
};
