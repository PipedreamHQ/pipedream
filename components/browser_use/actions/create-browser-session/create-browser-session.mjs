import browserUse from "../../browser_use.app.mjs";
import {
  cleanObject,
  getProxyCountryCode,
  parseOptionalObject,
} from "../../common/utils.mjs";

export default {
  key: "browser_use-create-browser-session",
  name: "Create Browser Session",
  description: "Create a standalone Browser Use browser session for direct browser control through CDP. Browser sessions are billed by runtime and can run up to 4 hours. [See the documentation](https://docs.browser-use.com/cloud/api-v3/browsers/create-browser-session)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    browserUse,
    profileId: {
      propDefinition: [
        browserUse,
        "profileId",
      ],
    },
    proxyCountryCode: {
      propDefinition: [
        browserUse,
        "proxyCountryCode",
      ],
    },
    timeout: {
      type: "integer",
      label: "Timeout",
      description: "Session timeout in minutes. Browser Use supports `1` to `240` minutes.",
      optional: true,
      default: 60,
      min: 1,
      max: 240,
    },
    browserScreenWidth: {
      type: "integer",
      label: "Browser Screen Width",
      description: "Custom browser screen width in pixels. Supported range: `320` to `6144`.",
      optional: true,
      min: 320,
      max: 6144,
    },
    browserScreenHeight: {
      type: "integer",
      label: "Browser Screen Height",
      description: "Custom browser screen height in pixels. Supported range: `320` to `3456`.",
      optional: true,
      min: 320,
      max: 3456,
    },
    allowResizing: {
      type: "boolean",
      label: "Allow Resizing",
      description: "Whether to allow browser resizing during the session. Browser Use does not recommend this because it can reduce stealthiness.",
      optional: true,
      default: false,
    },
    customProxy: {
      type: "object",
      label: "Custom Proxy",
      description: "Optional custom proxy object. Example: `{\"host\":\"proxy.example.com\",\"port\":8080,\"username\":\"user\",\"password\":\"pass\"}`. Custom proxies require an active subscription.",
      optional: true,
    },
    enableRecording: {
      type: "boolean",
      label: "Enable Recording",
      description: "If true, records the browser session.",
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    const response = await this.browserUse.createBrowserSession({
      $,
      data: cleanObject({
        profileId: this.profileId,
        proxyCountryCode: getProxyCountryCode(this.proxyCountryCode),
        timeout: this.timeout,
        browserScreenWidth: this.browserScreenWidth,
        browserScreenHeight: this.browserScreenHeight,
        allowResizing: this.allowResizing,
        customProxy: parseOptionalObject(this.customProxy, "Custom Proxy"),
        enableRecording: this.enableRecording,
      }),
    });

    $.export("$summary", `Created browser session ${response.id}`);
    return response;
  },
};
