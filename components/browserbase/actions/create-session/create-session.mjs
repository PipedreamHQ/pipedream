import browserbase from "../../browserbase.app.mjs";
import { REGION_OPTIONS } from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "browserbase-create-session",
  name: "Create Session",
  description: "Creates a new browser session with specified settings. [See the documentation](https://docs.browserbase.com/reference/api/create-a-session)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      type: "string",
      label: "Extension ID",
      description: "The uploaded Extension ID",
      optional: true,
    },
    browserSettings: {
      type: "object",
      label: "Browser Settings",
      description: "An object with the settings for the session. [See the documentation](https://docs.browserbase.com/reference/api/create-a-session#body-browser-settings) for more details.",
      optional: true,
    },
    timeout: {
      type: "integer",
      label: "Timeout",
      description: "Duration in seconds after which the session will automatically end.",
      min: 60,
      max: 21600,
      optional: true,
    },
    keepAlive: {
      type: "boolean",
      label: "Keep Alive",
      description: "Set to true to keep the session alive even after disconnections.",
      optional: true,
    },
    proxies: {
      type: "string[]",
      label: "Proxies",
      description: "An array of objects with proxy configuration. [See the documentation](https://docs.browserbase.com/reference/api/create-a-session#body-proxies) for more details.",
      optional: true,
    },
    region: {
      type: "string",
      label: "Region",
      description: "The region where the session should run.",
      options: REGION_OPTIONS,
      optional: true,
    },
    userMetadata: {
      type: "object",
      label: "User Metadata",
      description: "Arbitrary user metadata to attach to the session. To learn more about user metadata, see [User Metadata](https://docs.browserbase.com/features/sessions#user-metadata).",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.browserbase.createSession({
      $,
      data: {
        projectId: this.projectId,
        extensionId: this.extensionId,
        browserSettings: parseObject(this.browserSettings),
        timeout: this.timeout,
        keepAlive: this.keepAlive,
        proxies: parseObject(this.proxies),
        region: this.region,
        userMetadata: parseObject(this.userMetadata),
      },
    });

    $.export("$summary", `Session created successfully with ID: ${response.id}`);
    return response;
  },
};
