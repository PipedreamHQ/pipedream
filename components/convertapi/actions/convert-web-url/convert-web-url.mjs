import FormData from "form-data";
import {
  CSS_MEDIA_TYTPE_OPTIONS,
  FIXED_ELEMENTS_OPTIONS,
  FORMAT_TO_OPTIONS,
  PAGE_ORIENTATION_OPTIONS,
  PAGE_SIZE_OPTIONS,
} from "../../common/constants.mjs";
import { saveFile } from "../../common/utils.mjs";
import convertapi from "../../convertapi.app.mjs";

export default {
  key: "convertapi-convert-web-url",
  name: "Convert Web URL to Specified Format",
  description: "Converts a website page to a specified format. [See the documentation](https://v2.convertapi.com/info/openapi)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    convertapi,
    url: {
      type: "string",
      label: "URL",
      description: "The website URL to be converted to a specified format.",
    },
    formatTo: {
      type: "string",
      label: "Format To",
      description: "The format you want to convert the URL to.",
      options: FORMAT_TO_OPTIONS,
    },
    fileName: {
      type: "string",
      label: "File Name",
      description: "Converted output file name without extension. The extension will be added automatically.",
      optional: true,
    },
    timeout: {
      type: "string",
      label: "Timeout",
      description: "Conversion timeout in seconds.",
      optional: true,
    },
    conversionDelay: {
      type: "integer",
      label: "Conversion Delay",
      description: "Delay in seconds before page load and file creation. Sometimes useful to let web page fully load.",
      optional: true,
    },
    authUsername: {
      type: "string",
      label: "Auth Username",
      description: "HTTP authentication username. Could be used if conversion web page is protected with HTTP authentication.",
      optional: true,
    },
    authPassword: {
      type: "string",
      label: "Auth Password",
      description: "HTTP authentication password. Could be used if conversion web page is protected with HTTP authentication.",
      optional: true,
    },
    adBlock: {
      type: "boolean",
      label: "Ad Block",
      description: "Block ads in converting page.",
      optional: true,
    },
    cookieConsentBlock: {
      type: "boolean",
      label: "Cookie Consent Block",
      description: "Tries to remove EU regulation required cookie warnings from web pages.",
      optional: true,
    },
    cookies: {
      type: "string",
      label: "Cookies",
      description: "Set additional cookies for the page request. Exaple: cookiename1=cookievalue1; cookiename2=cookievalue2; cookiename3=cookievalue3",
      optional: true,
    },
    javaScript: {
      type: "boolean",
      label: "JavaScript",
      description: "Allow web pages to run JavaScript.",
      optional: true,
    },
    waitElement: {
      type: "string",
      label: "Wait Element",
      description: "Element selector string of the DOM element. Converter will wait for this element to appear in DOM before conversion begins.",
      optional: true,
    },
    userJs: {
      type: "string",
      label: "User JS",
      description: "Execute provided JavaScript before conversion begins.",
      optional: true,
    },
    userCss: {
      type: "string",
      label: "User CSS",
      description: "Apply additional CSS before conversion begins.",
      optional: true,
    },
    hideElements: {
      type: "string",
      label: "Hide Elements",
      description: "Element selector string of the DOM elements that need to be hidden during conversion.",
      optional: true,
    },
    cssMediaType: {
      type: "string",
      label: "CSS Media Type",
      description: "Use CSS media type in conversion process.",
      options: CSS_MEDIA_TYTPE_OPTIONS,
      optional: true,
      default: "screen",
    },
    imageWidth: {
      type: "integer",
      label: "Image Width",
      description: "Image width in pixels.",
      hidden: true,
      optional: true,
    },
    imageHeight: {
      type: "integer",
      label: "Image Height",
      description: "Image height in pixels.",
      hidden: true,
      optional: true,
    },
    imageQuality: {
      type: "integer",
      label: "Image Quality",
      description: "Set output image quality.",
      default: 75,
      hidden: true,
      optional: true,
    },
    cropElement: {
      type: "string",
      label: "Crop Element",
      description: "Element selector string of the DOM element that should be converted. Element will be cropped from the document.",
      hidden: true,
      optional: true,
    },
    cropX: {
      type: "integer",
      label: "Crop X",
      description: "Screenshot crop X offset.",
      hidden: true,
      optional: true,
    },
    cropY: {
      type: "integer",
      label: "Crop Y",
      description: "Screenshot crop Y offset.",
      hidden: true,
      optional: true,
    },
    cropWidth: {
      type: "integer",
      label: "Crop Width",
      description: "Screenshot crop width.",
      hidden: true,
      optional: true,
    },
    cropHeight: {
      type: "integer",
      label: "Crop Height",
      description: "Screenshot crop height.",
      hidden: true,
      optional: true,
    },
    zoom: {
      type: "integer",
      label: "Zoom",
      description: "Set the default zoom level of webpages.",
      hidden: true,
      optional: true,
    },
    loadLazyContent: {
      type: "boolean",
      label: "Load Lazy Content",
      description: "Load page images that loads only when they are visible.",
      hidden: true,
      optional: true,
    },
    viewportWidth: {
      type: "integer",
      label: "Viewport Width",
      description: "Sets browser viewport width.",
      hidden: true,
      default: 1366,
      optional: true,
    },
    viewportHeight: {
      type: "integer",
      label: "Viewport Height",
      description: "Sets browser viewport height.",
      hidden: true,
      default: 1024,
      optional: true,
    },
    respectViewport: {
      type: "boolean",
      label: "Respect Viewport",
      description: "If true, the converter will generate PDF as the content looks like in the browser. If is set to false, the converter acts like Chrome print to PDF function.",
      hidden: true,
      optional: true,
    },
    scale: {
      type: "integer",
      label: "Scale",
      description: "Set web page scale value in percentage.",
      hidden: true,
      default: 100,
      optional: true,
    },
    pageOrientation: {
      type: "string",
      label: "Page Orientation",
      description: "PDF page orientation",
      hidden: true,
      options: PAGE_ORIENTATION_OPTIONS,
      optional: true,
    },
    pageSize: {
      type: "string",
      label: "Page Size",
      description: "PDF Page Size",
      hidden: true,
      options: PAGE_SIZE_OPTIONS,
      optional: true,
    },
    pageWidth: {
      type: "integer",
      label: "Page Width",
      description: "Custom page width in millimeters (mm). This option override PageSize option.",
      hidden: true,
      optional: true,
    },
    pageHeight: {
      type: "integer",
      label: "Page Height",
      description: "Custom page height in millimeters (mm). This option override PageSize option.",
      hidden: true,
      optional: true,
    },
    marginTop: {
      type: "integer",
      label: "Margin Top",
      description: "Set the page top margin in millimeters (mm).",
      hidden: true,
      optional: true,
    },
    marginRight: {
      type: "integer",
      label: "Margin Right",
      description: "Set the page right margin in millimeters (mm).",
      hidden: true,
      optional: true,
    },
    marginBottom: {
      type: "integer",
      label: "Margin Bottom",
      description: "Set the page bottom margin in millimeters (mm).",
      hidden: true,
      optional: true,
    },
    marginLeft: {
      type: "integer",
      label: "Margin Left",
      description: "Set the page left margin in millimeters (mm).",
      hidden: true,
      optional: true,
    },
    pageRange: {
      type: "string",
      label: "Page Range",
      description: "Set page range. Example 1-10 or 1,2,5.",
      hidden: true,
      optional: true,
    },
    background: {
      type: "boolean",
      label: "Background",
      description: "Convert web page background.",
      hidden: true,
      optional: true,
    },
    fixedElements: {
      type: "string",
      label: "Fixed Elements",
      description: "Change fixed elements CSS 'position' property to adapt page for conversion",
      options: FIXED_ELEMENTS_OPTIONS,
      hidden: true,
      optional: true,
    },
    showElements: {
      type: "string",
      label: "ShowElements",
      description: "Element selector string of the DOM elements that should be visible during conversion. Other elements will be hidden.",
      hidden: true,
      optional: true,
    },
    avoidBreakElements: {
      type: "string",
      label: "Avoid Break Elements",
      description: "CSS selector for the elements that pages should not break.",
      hidden: true,
      optional: true,
    },
    breakBeforeElements: {
      type: "string",
      label: "Break Before Elements",
      description: "CSS selector for the elements that should apply page break before it.",
      hidden: true,
      optional: true,
    },
    breakAfterElements: {
      type: "string",
      label: "Break After Elements",
      description: "CSS selector for the elements that should apply page break after it.",
      hidden: true,
      optional: true,
    },
    compressPDF: {
      type: "boolean",
      label: "Compress PDF",
      description: "It tries to produce smaller output files but requires Adobe Reader 6, released in 2003 or newer, to view created PDF files.",
      hidden: true,
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  async additionalProps(props) {
    const isJpg = this.formatTo === "jpg";

    props.imageWidth.hidden = !isJpg;
    props.imageHeight.hidden = !isJpg;
    props.type.hidden = !isJpg;
    props.cropElement.hidden = !isJpg;
    props.cropX.hidden = !isJpg;
    props.cropY.hidden = !isJpg;
    props.cropWidth.hidden = !isJpg;
    props.cropHeight.hidden = !isJpg;
    props.zoom.hidden = !isJpg;

    props.loadLazyContent.hidden = isJpg;
    props.viewportWidth.hidden = isJpg;
    props.viewportHeight.hidden = isJpg;
    props.respectViewport.hidden = isJpg;
    props.scale.hidden = isJpg;
    props.pageOrientation.hidden = isJpg;
    props.pageSize.hidden = isJpg;
    props.pageWidth.hidden = isJpg;
    props.pageHeight.hidden = isJpg;
    props.marginTop.hidden = isJpg;
    props.marginRight.hidden = isJpg;
    props.marginBottom.hidden = isJpg;
    props.marginLeft.hidden = isJpg;
    props.pageRange.hidden = isJpg;
    props.background.hidden = isJpg;
    props.fixedElements.hidden = isJpg;
    props.showElements.hidden = isJpg;
    props.avoidBreakElements.hidden = isJpg;
    props.breakBeforeElements.hidden = isJpg;
    props.breakAfterElements.hidden = isJpg;
    props.compressPDF.hidden = isJpg;

    return {};
  },
  async run({ $ }) {
    try {
      const data = new FormData();

      data.append("Url", this.url);
      if (this.fileName) data.append("FileName", this.fileName);
      if (this.timeout) data.append("Timeout", this.timeout);
      if (this.conversionDelay) data.append("ConversionDelay", this.conversionDelay);
      if (this.authUsername) data.append("AuthUsername", this.authUsername);
      if (this.authPassword) data.append("AuthPassword", this.authPassword);
      if (this.adBlock) data.append("AdBlock", `${this.adBlock}`);
      if (this.cookieConsentBlock) data.append("CookieConsentBlock", `${this.cookieConsentBlock}`);
      if (this.cookies) data.append("Cookies", this.cookies);
      if (this.javaScript) data.append("JavaScript", `${this.javaScript}`);
      if (this.waitElement) data.append("WaitElement", this.waitElement);
      if (this.userJs) data.append("UserJs", this.userJs);
      if (this.userCss) data.append("UserCss", this.userCss);
      if (this.hideElements) data.append("HideElements", this.hideElements);
      if (this.cssMediaType) data.append("CssMediaType", this.cssMediaType);

      if (this.formatTo === "jpg") {
        if (this.imageWidth) data.append("ImageWidth", this.imageWidth);
        if (this.imageHeight) data.append("ImageHeight", this.imageHeight);
        if (this.type) data.append("Type", this.type);
        if (this.cropElement) data.append("CropElement", this.cropElement);
        if (this.cropX) data.append("CropX", this.cropX);
        if (this.cropY) data.append("CropY", this.cropY);
        if (this.cropWidth) data.append("CropWidth", this.cropWidth);
        if (this.cropHeight) data.append("CropHeight", this.cropHeight);
        if (this.zoom) data.append("Zoom", this.zoom);
      } else {
        if (this.loadLazyContent) data.append("LoadLazyContent", `${this.loadLazyContent}`);
        if (this.viewportWidth) data.append("ViewportWidth", this.viewportWidth);
        if (this.viewportHeight) data.append("ViewportHeight", this.viewportHeight);
        if (this.respectViewport) data.append("RespectViewport", `${this.respectViewport}`);
        if (this.scale) data.append("Scale", this.scale);
        if (this.pageOrientation) data.append("PageOrientation", this.pageOrientation);
        if (this.pageSize) data.append("PageSize", this.pageSize);
        if (this.pageWidth) data.append("PageWidth", this.pageWidth);
        if (this.pageHeight) data.append("PageHeight", this.pageHeight);
        if (this.marginTop) data.append("MarginTop", this.marginTop);
        if (this.marginRight) data.append("MarginRight", this.marginRight);
        if (this.marginBottom) data.append("MarginBottom", this.marginBottom);
        if (this.marginLeft) data.append("MarginLeft", this.marginLeft);
        if (this.pageRange) data.append("PageRange", this.pageRange);
        if (this.background) data.append("Background", `${this.background}`);
        if (this.fixedElements) data.append("FixedElements", this.fixedElements);
        if (this.showElements) data.append("ShowElements", this.showElements);
        if (this.avoidBreakElements) data.append("AvoidBreakElements", this.avoidBreakElements);
        if (this.breakBeforeElements) data.append("BreakBeforeElements", this.breakBeforeElements);
        if (this.breakAfterElements) data.append("BreakAfterElements", this.breakAfterElements);
        if (this.compressPDF) data.append("CompressPDF", `${this.compressPDF}`);
      }

      const { Files } = await this.convertapi.convertWebToFormat({
        $,
        formatTo: this.formatTo,
        data,
        headers: data.getHeaders(),
        timeout: this.timeout
          ? 2000 * Number(this.timeout)
          : undefined,
      });

      await saveFile(Files);
      const filename = Files[0].FileName;

      $.export("$summary", `Successfully converted URL to ${this.formatTo} and saved in /tmp directory as **${filename}**.`);
      return {
        filepath: `/tmp/${filename}`,
      };
    } catch (e) {
      throw new Error(e);
    }
  },
};
