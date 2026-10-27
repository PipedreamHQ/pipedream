import { ConfigurationError } from "@pipedream/platform";
import app from "../../pdfgate.app.mjs";
import {
  DOCS_URL,
  GENERATE_TIMEOUT_MS,
  MEDIA_TYPE_OPTIONS,
  ORIENTATION_OPTIONS,
  PAGE_SIZE_OPTIONS,
} from "../../common/constants.mjs";
import {
  buildCommonFields, omitBlank, parseObject,
} from "../../common/utils.mjs";

export default {
  key: "pdfgate-generate-pdf",
  name: "Generate PDF",
  description: `Generate a PDF from a public URL or raw HTML. [See the documentation](${DOCS_URL})`,
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    url: {
      type: "string",
      label: "URL",
      description: "Public URL whose rendered content should be converted to PDF. Required if **HTML Content** is not provided.",
      optional: true,
    },
    html: {
      type: "string",
      label: "HTML Content",
      description: "Raw HTML markup to convert to PDF. Required if **URL** is not provided.",
      optional: true,
    },
    preSignedUrlExpiresIn: {
      propDefinition: [
        app,
        "preSignedUrlExpiresIn",
      ],
    },
    pageSizeType: {
      type: "string",
      label: "Page Size",
      description: "PDF page size.",
      optional: true,
      options: PAGE_SIZE_OPTIONS,
    },
    orientation: {
      type: "string",
      label: "Orientation",
      description: "Page orientation.",
      optional: true,
      options: ORIENTATION_OPTIONS,
    },
    width: {
      type: "integer",
      label: "Custom Width (px)",
      description: "Custom PDF width in pixels. Must be used together with **Custom Height**. If used, it overrides **Page Size**.",
      optional: true,
    },
    height: {
      type: "integer",
      label: "Custom Height (px)",
      description: "Custom PDF height in pixels. Must be used together with **Custom Width**. If used, it overrides **Page Size**.",
      optional: true,
    },
    enableFormFields: {
      type: "boolean",
      label: "Enable Fillable Form Fields",
      description: "If true, HTML input fields are rendered as interactive PDF form fields. Supports text, checkbox, textarea, select, email, number, date/time, radio, and `pdfgate-signature-field`.",
      optional: true,
    },
    header: {
      type: "string",
      label: "Header HTML",
      description: "HTML snippet rendered as the page header on every PDF page. **Margin Top** must also be set so the header has enough space to appear.",
      optional: true,
    },
    footer: {
      type: "string",
      label: "Footer HTML",
      description: "HTML snippet rendered as the page footer on every PDF page. **Margin Bottom** must also be set to make space for the footer, for example `80px` or `2cm`.",
      optional: true,
    },
    marginTop: {
      type: "string",
      label: "Margin Top",
      description: "Top margin of the generated PDF. Use CSS-style length values such as `20px`, `1cm`, `10mm`, or `0.5in`.",
      optional: true,
    },
    marginBottom: {
      type: "string",
      label: "Margin Bottom",
      description: "Bottom margin of the generated PDF. Use CSS-style length values such as `20px`, `1cm`, `10mm`, or `0.5in`.",
      optional: true,
    },
    marginLeft: {
      type: "string",
      label: "Margin Left",
      description: "Left margin of the generated PDF. Use CSS-style length values such as `20px`, `1cm`, `10mm`, or `0.5in`.",
      optional: true,
    },
    marginRight: {
      type: "string",
      label: "Margin Right",
      description: "Right margin of the generated PDF. Use CSS-style length values such as `20px`, `1cm`, `10mm`, or `0.5in`.",
      optional: true,
    },
    timeout: {
      type: "integer",
      label: "Render Timeout (milliseconds)",
      description: "Maximum wait time for the HTML to render.",
      optional: true,
    },
    javascript: {
      type: "string",
      label: "Inject JavaScript",
      description: "JavaScript code executed on the page before PDF capture.",
      optional: true,
    },
    css: {
      type: "string",
      label: "Inject CSS",
      description: "CSS rules injected into the page before PDF capture.",
      optional: true,
    },
    emulateMediaType: {
      type: "string",
      label: "Emulate Media Type",
      description: "Force a specific CSS media type.",
      optional: true,
      options: MEDIA_TYPE_OPTIONS,
    },
    waitForSelector: {
      type: "string",
      label: "Wait For CSS Selector",
      description: "Waits for a CSS selector to load before generating the PDF. Times out after 30 seconds.",
      optional: true,
    },
    clickSelector: {
      type: "string",
      label: "Click CSS Selector",
      description: "Waits for and clicks a CSS selector before generating the PDF.",
      optional: true,
    },
    clickSelectorChainSetup: {
      type: "object",
      label: "Click Selector Chain Setup",
      description: "Advanced click setup. When provided, **Click CSS Selector** is ignored. Example: `{\"ignoreFailingChains\":true,\"chains\":[{\"selectors\":[\"#cookieDialog\"]},{\"selectors\":[\".popupClose\"]}]}`",
      optional: true,
    },
    waitForNetworkIdle: {
      type: "boolean",
      label: "Wait For Network Idle",
      description: "If true, waits until there are no active network connections in the page before generating the PDF.",
      optional: true,
    },
    delay: {
      type: "integer",
      label: "Render Delay (milliseconds)",
      description: "Adds a delay before generating the PDF. Max 20000 (20 seconds). Useful for async content.",
      optional: true,
      max: 20000,
    },
    loadImages: {
      type: "boolean",
      label: "Load Images",
      description: "If true, waits for all images to finish loading before generating the PDF.",
      optional: true,
    },
    scale: {
      type: "string",
      label: "Page Scale",
      description: "Page scale factor. Accepts values between `0.1` and `2`.",
      optional: true,
    },
    pageRanges: {
      type: "string",
      label: "Page Ranges",
      description: "Pages to include, e.g. `1-5` or `1,3,5`. If empty, all pages are included.",
      optional: true,
    },
    printBackground: {
      type: "boolean",
      label: "Print Backgrounds",
      description: "If true, background graphics are included in the PDF.",
      optional: true,
    },
    userAgent: {
      type: "string",
      label: "User Agent",
      description: "Custom User-Agent string used when fetching the page.",
      optional: true,
    },
    httpHeaders: {
      type: "object",
      label: "HTTP Headers",
      description: "Custom HTTP headers sent when fetching the page, as key/value pairs.",
      optional: true,
    },
    authenticationUsername: {
      type: "string",
      label: "Authentication Username",
      description: "HTTP Basic authentication username used when fetching the page.",
      optional: true,
    },
    authenticationPassword: {
      type: "string",
      label: "Authentication Password",
      description: "HTTP Basic authentication password used when fetching the page.",
      optional: true,
      secret: true,
    },
    viewportWidth: {
      type: "integer",
      label: "Viewport Width",
      description: "Browser viewport width in pixels before rendering.",
      optional: true,
    },
    viewportHeight: {
      type: "integer",
      label: "Viewport Height",
      description: "Browser viewport height in pixels before rendering.",
      optional: true,
    },
    metadata: {
      propDefinition: [
        app,
        "metadata",
      ],
    },
  },
  methods: {
    buildRequestBody() {
      if (!this.url && !this.html) {
        throw new ConfigurationError("Either **URL** or **HTML Content** must be provided.");
      }

      const body = {
        jsonResponse: true,
        ...omitBlank({
          url: this.url,
          html: this.html,
          pageSizeType: this.pageSizeType,
          orientation: this.orientation,
          width: this.width,
          height: this.height,
          enableFormFields: this.enableFormFields,
          header: this.header,
          footer: this.footer,
          timeout: this.timeout,
          javascript: this.javascript,
          css: this.css,
          emulateMediaType: this.emulateMediaType,
          waitForSelector: this.waitForSelector,
          clickSelector: this.clickSelector,
          clickSelectorChainSetup: parseObject(this.clickSelectorChainSetup, "Click Selector Chain Setup"),
          waitForNetworkIdle: this.waitForNetworkIdle,
          delay: this.delay,
          loadImages: this.loadImages,
          scale: this.scale !== undefined && this.scale !== null && this.scale !== ""
            ? Number(this.scale)
            : undefined,
          pageRanges: this.pageRanges,
          printBackground: this.printBackground,
          userAgent: this.userAgent,
          httpHeaders: parseObject(this.httpHeaders, "HTTP Headers"),
        }),
        ...buildCommonFields(this),
      };

      const margin = omitBlank({
        top: this.marginTop,
        bottom: this.marginBottom,
        left: this.marginLeft,
        right: this.marginRight,
      });
      if (Object.keys(margin).length) {
        body.margin = margin;
      }

      const viewport = omitBlank({
        width: this.viewportWidth,
        height: this.viewportHeight,
      });
      if (Object.keys(viewport).length) {
        body.viewport = viewport;
      }

      if (this.authenticationUsername) {
        body.authentication = {
          username: this.authenticationUsername,
          password: this.authenticationPassword ?? "",
        };
      }

      if (body.scale !== undefined && Number.isNaN(body.scale)) {
        throw new ConfigurationError("**Page Scale** must be a number between 0.1 and 2.");
      }

      return body;
    },
  },
  async run({ $ }) {
    const response = await this.app.generatePdf({
      $,
      data: this.buildRequestBody(),
      timeout: GENERATE_TIMEOUT_MS,
    });
    $.export("$summary", `Successfully generated PDF with ID ${response.id}`);
    return response;
  },
};
