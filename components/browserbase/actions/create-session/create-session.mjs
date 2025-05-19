import browserbase from "../../browserbase.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "browserbase-create-session",
  name: "Create Session",
  description: "Creates a new browser session with specified settings. [See the documentation](https://docs.browserbase.com/reference/api/create-a-session)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    browserbase,
    projectId: {
      propDefinition: [
        browserbase,
        "projectId",
      ],
    },
    extensionId: {
      propDefinition: [
        browserbase,
        "extensionId",
      ],
      optional: true,
    },
    browserSettings: {
      propDefinition: [
        browserbase,
        "browserSettings",
      ],
      optional: true,
    },
    timeout: {
      propDefinition: [
        browserbase,
        "timeout",
      ],
      optional: true,
    },
    keepAlive: {
      propDefinition: [
        browserbase,
        "keepAlive",
      ],
      optional: true,
    },
    proxies: {
      propDefinition: [
        browserbase,
        "proxies",
      ],
      optional: true,
    },
    region: {
      propDefinition: [
        browserbase,
        "region",
      ],
      optional: true,
    },
    userMetadata: {
      propDefinition: [
        browserbase,
        "userMetadata",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.browserbase.createSession({
      projectId: this.projectId,
      extensionId: this.extensionId,
      browserSettings: this.browserSettings,
      timeout: this.timeout,
      keepAlive: this.keepAlive,
      proxies: this.proxies && this.proxies.map(JSON.parse),
      region: this.region,
      userMetadata: this.userMetadata,
    });

    $.export("$summary", `Session created successfully with ID: ${response.id}`);
    return response;
  },
};
