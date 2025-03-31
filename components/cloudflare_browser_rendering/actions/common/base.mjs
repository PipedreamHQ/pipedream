import app from "../../cloudflare_browser_rendering.app.mjs";

export default {
  props: {
    app,
    // eslint-disable-next-line pipedream/props-label, pipedream/props-description
    info: {
      type: "alert",
      alertType: "info",
      content: "Please note that either **HTML** or **URL** must be set.",
    },
    html: {
      propDefinition: [
        app,
        "html",
      ],
    },
    url: {
      propDefinition: [
        app,
        "url",
      ],
    },
    viewportHeight: {
      propDefinition: [
        app,
        "viewportHeight",
      ],
    },
    viewportWidth: {
      propDefinition: [
        app,
        "viewportWidth",
      ],
    },
    viewportDeviceScaleFactor: {
      propDefinition: [
        app,
        "viewportDeviceScaleFactor",
      ],
    },
    viewportHasTouch: {
      propDefinition: [
        app,
        "viewportHasTouch",
      ],
    },
    viewportIsLandscape: {
      propDefinition: [
        app,
        "viewportIsLandscape",
      ],
    },
    viewportIsMobile: {
      propDefinition: [
        app,
        "viewportIsMobile",
      ],
    },
    userAgent: {
      propDefinition: [
        app,
        "userAgent",
      ],
    },
    additionalSettings: {
      propDefinition: [
        app,
        "additionalSettings",
      ],
    },
  },
};
