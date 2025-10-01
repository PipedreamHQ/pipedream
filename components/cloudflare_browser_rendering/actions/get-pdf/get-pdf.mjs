import fs from "fs";
import path from "path";
import { ConfigurationError } from "@pipedream/platform";
import common from "../common/base.mjs";
import utils from "../../common/utils.mjs";

export default {
  ...common,
  key: "cloudflare_browser_rendering-get-pdf",
  name: "Get PDF",
  description: "Fetches rendered PDF from provided URL or HTML. [See the documentation](https://developers.cloudflare.com/api/resources/browser_rendering/subresources/pdf/methods/create/)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    fileName: {
      type: "string",
      label: "PDF File Name",
      description: "The name of the PDF file",
      default: "content.pdf",
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  methods: {
    async getPdf(args = {}) {
      try {
        return await this.app.post({
          path: "/pdf",
          responseType: "arraybuffer",
          ...args,
        });
      } catch (error) {
        throw new Error(error.response.data.toString());
      }
    },
  },
  async run({ $ }) {
    const {
      getPdf,
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
      fileName,
    } = this;

    if (!html && !url) {
      throw new ConfigurationError("Either **HTML** or **URL** is required");
    }

    if ((viewportHeight && !viewportWidth) || (!viewportHeight && viewportWidth)) {
      throw new ConfigurationError("Both **Viewport - Height** and **Viewport - Width** are required when either is provided");
    }

    const response = await getPdf({
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

    const pdfPath = path.join("/tmp", fileName);
    fs.writeFileSync(pdfPath, response);

    $.export("$summary", "Successfully fetched PDF content");

    return pdfPath;
  },
};
