import { ConfigurationError } from "@pipedream/platform";
import common from "../common/base.mjs";
import utils from "../../common/utils.mjs";

export default {
  ...common,
  key: "cloudflare_browser_rendering-get-html-content",
  name: "Get HTML Content",
  description: "Fetches rendered HTML content from provided URL or HTML. [See the documentation](https://developers.cloudflare.com/api/resources/browser_rendering/subresources/content/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  methods: {
    getHtmlContent(args = {}) {
      return this.app.post({
        path: "/content",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      getHtmlContent,
      html,
      url,
      viewportHeight,
      viewportWidth,
      viewportDeviceScaleFactor,
      viewportHasTouch,
      viewportIsLandscape,
      viewportIsMobile,
      userAgent,
      additionalSettings,
    } = this;

    if (!html && !url) {
      throw new ConfigurationError("Either **HTML** or **URL** is required");
    }

    if ((viewportHeight && !viewportWidth) || (!viewportHeight && viewportWidth)) {
      throw new ConfigurationError("Both **Viewport - Height** and **Viewport - Width** are required when either is provided");
    }

    const response = await getHtmlContent({
      $,
      data: {
        html,
        url,
        ...(viewportHeight && {
          viewport: {
            height: viewportHeight,
            width: viewportWidth,
            deviceScaleFactor: viewportDeviceScaleFactor,
            hasTouch: viewportHasTouch,
            isLandscape: viewportIsLandscape,
            isMobile: viewportIsMobile,
          },
        }),
        userAgent,
        ...utils.parseJson(additionalSettings),
      },
    });

    $.export("$summary", "Successfully fetched HTML content");
    return response;
  },
};
