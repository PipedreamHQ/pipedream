import app from "../../anchor_browser.app.mjs";

export default {
  key: "anchor_browser-start-browser",
  name: "Start Browser",
  description: "Allocates a new browser session for the user, with optional configurations for ad-blocking, captcha solving, proxy usage, and idle timeout. [See the documentation](https://docs.anchorbrowser.io/api-reference/browser-sessions/start-browser-session).",
  version: "0.0.3",
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
      description: "The type of proxy configuration to use. Eg. `anchor_proxy`.",
      options: [
        "anchor_proxy",
      ],
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
      description: "The name of the profile to use for the browser session, e.g. `my-profile`. Use **List Profile Name Options** to retrieve available profile names. Leave empty to start a session without a profile.",
      propDefinition: [
        app,
        "profileName",
      ],
      optional: true,
    },
    profilePersist: {
      type: "boolean",
      label: "Profile - Persist",
      description: "Whether the profile should persist after the session ends. Requires **Profile Name**.",
      optional: true,
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
      type: "integer",
      label: "Timeout",
      description: "Maximum amount of time (in minutes) for the browser to run before terminating. Defaults to `20`. Set to `-1` to disable this limit.",
      optional: true,
    },
    idleTimeout: {
      type: "integer",
      label: "Idle Timeout",
      description: "The amount of time (in minutes) the session waits for new connections after all others are closed before stopping. Defaults to `5`. Set to `-1` to disable this limit.",
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
        session: {
          ...((proxyConfigType !== undefined || proxyConfigActive !== undefined) && {
            proxy: {
              type: proxyConfigType,
              active: proxyConfigActive ?? false,
            },
          }),
          recording: {
            active: recordingActive,
          },
          timeout: {
            max_duration: timeout,
            idle_timeout: idleTimeout,
          },
        },
        browser: {
          adblock: {
            active: adblockConfigActive,
          },
          popup_blocker: {
            active: adblockConfigPopupBlockingActive,
          },
          captcha_solver: {
            active: captchaConfigActive,
          },
          headless: {
            active: headless,
          },
          ...(profileName && {
            profile: {
              name: profileName,
              persist: profilePersist,
            },
          }),
          viewport: {
            width: viewportWidth,
            height: viewportHeight,
          },
        },
      },
    });

    $.export("$summary", "Successfully started browser session.");
    return response;
  },
};
