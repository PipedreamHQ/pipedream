import convertapi from "../../convertapi.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "convertapi-convert-web-url",
  name: "Convert Web URL to Specified Format",
  description: "Converts a website page to a specified format. [See the documentation](https://v2.convertapi.com/info/openapi)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    convertapi,
    url: {
      propDefinition: [
        convertapi,
        "url",
      ],
    },
    format: {
      propDefinition: [
        convertapi,
        "format",
      ],
    },
    userJs: {
      propDefinition: [
        convertapi,
        "userJs",
      ],
    },
    userCss: {
      propDefinition: [
        convertapi,
        "userCss",
      ],
    },
    hideElements: {
      propDefinition: [
        convertapi,
        "hideElements",
      ],
    },
    cssMediaType: {
      propDefinition: [
        convertapi,
        "cssMediaType",
      ],
    },
    headers: {
      propDefinition: [
        convertapi,
        "headers",
      ],
    },
    loadLazyContent: {
      propDefinition: [
        convertapi,
        "loadLazyContent",
      ],
    },
    viewportWidth: {
      propDefinition: [
        convertapi,
        "viewportWidth",
      ],
    },
    viewportHeight: {
      propDefinition: [
        convertapi,
        "viewportHeight",
      ],
    },
    respectViewport: {
      propDefinition: [
        convertapi,
        "respectViewport",
      ],
    },
    scale: {
      propDefinition: [
        convertapi,
        "scale",
      ],
    },
    pageOrientation: {
      propDefinition: [
        convertapi,
        "pageOrientation",
      ],
    },
    pageSize: {
      propDefinition: [
        convertapi,
        "pageSize",
      ],
    },
    marginTop: {
      propDefinition: [
        convertapi,
        "marginTop",
      ],
    },
    marginRight: {
      propDefinition: [
        convertapi,
        "marginRight",
      ],
    },
    marginBottom: {
      propDefinition: [
        convertapi,
        "marginBottom",
      ],
    },
    marginLeft: {
      propDefinition: [
        convertapi,
        "marginLeft",
      ],
    },
    pageRange: {
      propDefinition: [
        convertapi,
        "pageRange",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.convertapi.convertUrlToFormat({
      url: this.url,
      format: this.format,
      userJs: this.userJs,
      userCss: this.userCss,
      hideElements: this.hideElements,
      cssMediaType: this.cssMediaType,
      headers: this.headers,
      loadLazyContent: this.loadLazyContent,
      viewportWidth: this.viewportWidth,
      viewportHeight: this.viewportHeight,
      respectViewport: this.respectViewport,
      scale: this.scale,
      pageOrientation: this.pageOrientation,
      pageSize: this.pageSize,
      marginTop: this.marginTop,
      marginRight: this.marginRight,
      marginBottom: this.marginBottom,
      marginLeft: this.marginLeft,
      pageRange: this.pageRange,
    });

    $.export("$summary", `Successfully converted URL to ${this.format || "default format"}`);
    return response;
  },
};
