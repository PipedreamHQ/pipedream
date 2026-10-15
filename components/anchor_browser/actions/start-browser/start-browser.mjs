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
      type: "string",
      description: "An existing profile name to reuse, or a new name to save when Profile - Persist is enabled. Leave empty to start without a profile.",
      label: "Profile Name",
      optional: true,
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
      description: "Maximum amount of time (in minutes) for the browser to run, before terminating. Defaults to `20`. Set to `-1` to disable the global timeout mechanism.",
      optional: true,
    },
    idleTimeout: {
      type: "string",
      label: "Idle Timeout",
      description: "The amount of time (in minutes) the session waits for new connections after all others are closed before stopping. Defaults to `5`. Setting it to `-1` let the browser session continue forever [**CAUTION** - Keep track of long living sessions and manually kill them].",
      optional: true,
    },
  },
  methods: {
    startBrowserSession(args = {}) {
      return this.app.post({
        path: "/sessions",
        apiVersion: "v1",
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
          ...((proxyConfigActive !== undefined || proxyConfigType) && {
            proxy: {
              type: proxyConfigType === "anchor_residential"
                ? "anchor_proxy"
                : proxyConfigType,
              active: proxyConfigActive ?? true,
            },
          }),
          recording: {
            active: recordingActive,
          },
          timeout: {
            max_duration: timeout
              ? Number(timeout)
              : undefined,
            idle_timeout: idleTimeout
              ? Number(idleTimeout)
              : undefined,
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
