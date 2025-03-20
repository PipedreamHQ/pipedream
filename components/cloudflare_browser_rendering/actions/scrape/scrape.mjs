import { ConfigurationError } from "@pipedream/platform";
import common from "../common/base.mjs";
import utils from "../../common/utils.mjs";

export default {
  ...common,
  key: "cloudflare_browser_rendering-scrape",
  name: "Scrape",
  description: "Get meta attributes like height, width, text and others of selected elements. [See the documentation](https://developers.cloudflare.com/api/resources/browser_rendering/subresources/scrape/methods/create/)",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    elements: {
      type: "string[]",
      label: "Elements",
      description: "List of elements to scrape where each element is an object with selector. Eg. `{ selector: \"selector\" }`.",
      default: [
        JSON.stringify({
          selector: "body",
        }),
      ],
    },
  },
  methods: {
    scrape(args = {}) {
      return this.app.post({
        path: "/scrape",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      scrape,
      elements,
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

    const response = await scrape({
      $,
      data: {
        elements: utils.parseArray(elements),
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

    $.export("$summary", "Successfully scraped elements");
    return response;
  },
};
