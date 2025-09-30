import app from "../../anchor_browser.app.mjs";

export default {
  key: "anchor_browser-start-browser",
  name: "Start Browser",
  description: "Allocates a new browser session for the user, with optional configurations for ad-blocking, captcha solving, proxy usage, and idle timeout. [See the documentation](https://docs.anchorbrowser.io/api-reference/browser-sessions/start-browser).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    adblockConfigActive: {
      type: "boolean",
      label: "Adblock Configuration - Active",
      description: "Whether adblock configuration is active",
    },
    adblockConfigPopupBlockingActive: {
      type: "boolean",
      label: "Adblock Configuration - Popup Blocking Active",
      description: "Whether popup blocking is active",
    },
    captchaConfigActive: {
      type: "boolean",
      label: "Captcha Configuration - Active",
      description: "Whether captcha configuration is active",
    },
    headless: {
      type: "boolean",
      label: "Headless",
      description: "Whether browser should be headless or headfull.",
    },
    proxyConfigType: {
      type: "string",
      label: "Proxy Configuration - Type",
      description: "The type of proxy configuration to use. Eg. `anchor_residential`.",
      optional: true,
    },
    proxyConfigActive: {
      type: "boolean",
      label: "Proxy Configuration - Active",
      description: "Whether proxy configuration is active",
      optional: true,
    },
    recordingActive: {
      type: "boolean",
      label: "Recording - Active",
      description: "Whether recording is active",
      optional: true,
    },
    profileName: {
      description: "The name of the profile to use for the browser session.",
      propDefinition: [
        app,
        "profileName",
      ],
    },
    profilePersist: {
      type: "boolean",
      label: "Profile - Persist",
      description: "Whether the profile should persist after the session ends.",
    },
    viewportWidth: {
      type: "integer",
      label: "Viewport - Width",
      description: "The width of the viewport",
    },
    viewportHeight: {
      type: "integer",
      label: "Viewport - Height",
      description: "The height of the viewport",
    },
    timeout: {
      type: "string",
      label: "Timeout",
      description: "Maximum amount of time (in minutes) for the browser to run, before terminating. Defaults to `-1`, which disables the global timeout mechanism.",
      optional: true,
    },
    idleTimeout: {
      type: "string",
      label: "Idle Timeout",
      description: "The amount of time (in minutes) the session waits for new connections after all others are closed before stopping. Defaults to `1`. Setting it to `-1` let the browser session continue forever [**CAUTION** - Keep track of long living sessions and manually kill them].",
      optional: true,
    },
  },
  methods: {
    startBrowserSession(args = {}) {
      return this.app.post({
        path: "/sessions",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      startBrowserSession,
      adblockConfigActive,
      adblockConfigPopupBlockingActive,
      captchaConfigActive,
      headless,
      proxyConfigType,
      proxyConfigActive,
      recordingActive,
      profileName,
      profilePersist,
      viewportWidth,
      viewportHeight,
      timeout,
      idleTimeout,
    } = this;

    const response = await startBrowserSession({
      $,
      data: {
        adblock_config: {
          active: adblockConfigActive,
          popup_blocking_active: adblockConfigPopupBlockingActive,
        },
        captcha_config: {
          active: captchaConfigActive,
        },
        headless,
        proxy_config: {
          type: proxyConfigType,
          active: proxyConfigActive,
        },
        recording: {
          active: recordingActive,
        },
        profile: {
          name: profileName,
          persist: profilePersist,
        },
        viewport: {
          width: viewportWidth,
          height: viewportHeight,
        },
        timeout,
        idle_timeout: idleTimeout,
      },
    });

    $.export("$summary", "Successfully started browser session.");
    return response;
  },
};
