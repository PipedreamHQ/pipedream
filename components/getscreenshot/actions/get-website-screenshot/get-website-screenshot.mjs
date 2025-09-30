import getscreenshot from "../../getscreenshot.app.mjs";

export default {
  key: "getscreenshot-get-website-screenshot",
  name: "Get Website Screenshot",
  description: "Capture a screenshot from a live website. [See the documentation](https://docs.rasterwise.com/docs/getscreenshot/api-reference-0/)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    getscreenshot,
    url: {
      type: "string",
      label: "Website URL",
      description: "URL of the website / page you want to screenshot. Should start with `http://` or `https://`",
    },
    format: {
      type: "string",
      label: "Image Format",
      description: "The file type/format in which you want to get your capture. If `pdf` is selected, an A4 PDF of the passed website will be generated, rendered the same as if you were printing it from your browser.",
      options: [
        "png",
        "jpeg",
        "pdf",
      ],
      default: "png",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email Address",
      description: "If specified, a formatted email will be sent to this email address, including the captured image and details of the capture.",
      optional: true,
    },
    element: {
      type: "string",
      label: "Element",
      description: "If you need to target specific DOM elements instead of taking dimension-based screenshots, you can specify an element DOM selector, e.g. `#colordiv` to target a div with the id \"colordiv\".",
      optional: true,
    },
    additionalParams: {
      type: "object",
      label: "Additional Parameters",
      description: "Additional parameters (key/value pairs) to send in this request. [See the documentation](https://docs.rasterwise.com/docs/getscreenshot/api-reference-0/) for all available parameters.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      getscreenshot, format, additionalParams, ...params
    } = this;
    const response = await getscreenshot.getScreenshot({
      $,
      params: {
        ...params,
        ...(format === "pdf"
          ? {
            pdf: true,
          }
          : {
            format,
          }),
        ...additionalParams,
      },
    });
    $.export("$summary", `Successfully captured screenshot of "${this.url}"`);
    return response;
  },
};
