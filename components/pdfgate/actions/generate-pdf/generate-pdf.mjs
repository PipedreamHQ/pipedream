import { ConfigurationError } from "@pipedream/platform";
import app from "../../pdfgate.app.mjs";
import {
  DOCS_URLS,
  GENERATE_TIMEOUT_MS,
  MEDIA_TYPE_OPTIONS,
  ORIENTATION_OPTIONS,
  PAGE_SIZE_OPTIONS,
} from "../../common/constants.mjs";
import {
  buildCommonFields, omitBlank, parseObject, toNumber,
} from "../../common/utils.mjs";

export default {
  key: "pdfgate-generate-pdf",
  name: "Generate PDF",
  description: `Render a PDF from a public URL or raw HTML and store it as a PDFGate document. Use it to create invoices, reports or agreements; the returned \`id\` feeds **Compress PDF**, **Watermark PDF**, **Protect PDF**, **Flatten PDF**, **Extract PDF Form Data** and **Create Envelope**. Set **Pre-Signed URL Expiry** to also get a \`fileUrl\` download link. [See the documentation](${DOCS_URLS.generatePdf})`,
  version: "0.0.1",
  type: "action",
  ai: "optimized",
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
      description: "Public URL whose rendered content is converted to PDF, e.g. `https://example.com/invoices/123`. Required if **HTML Content** is empty.",
      optional: true,
    },
    html: {
      type: "string",
      label: "HTML Content",
      description: "Raw HTML markup to convert to PDF, e.g. `<html><body><h1>Invoice #123</h1></body></html>`. Required if **URL** is empty.",
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
      description: "PDF page size, e.g. `a4` or `letter`.",
      optional: true,
      options: PAGE_SIZE_OPTIONS,
    },
    orientation: {
      type: "string",
      label: "Orientation",
      description: "Page orientation, e.g. `portrait` or `landscape`.",
      optional: true,
      options: ORIENTATION_OPTIONS,
    },
    width: {
      type: "integer",
      label: "Custom Width (px)",
      description: "Custom PDF width in pixels, e.g. `800`. Must be used together with **Custom Height**; when set, it overrides **Page Size**.",
      optional: true,
    },
    height: {
      type: "integer",
      label: "Custom Height (px)",
      description: "Custom PDF height in pixels, e.g. `1200`. Must be used together with **Custom Width**; when set, it overrides **Page Size**.",
      optional: true,
    },
    enableFormFields: {
      type: "boolean",
      label: "Enable Fillable Form Fields",
      description: `If \`true\`, HTML inputs become interactive PDF form fields (text, checkbox, textarea, select, email, number, date/time, radio) and \`<pdfgate-signature-field>\` elements become signature fields, which **Create Envelope** requires. Example: \`true\`. [See the form field reference](${DOCS_URLS.formFields})`,
      optional: true,
    },
    header: {
      type: "string",
      label: "Header HTML",
      description: "HTML snippet rendered as the header on every page, e.g. `<div style=\"font-size:10px\">Acme Inc.</div>`. Set **Margin Top** as well so the header has room.",
      optional: true,
    },
    footer: {
      type: "string",
      label: "Footer HTML",
      description: "HTML snippet rendered as the footer on every page, e.g. `<div style=\"font-size:10px\">Page <span class=\"pageNumber\"></span></div>`. Set **Margin Bottom** as well, for example `80px`, so the footer has room.",
      optional: true,
    },
    marginTop: {
      type: "string",
      label: "Margin Top",
      description: "Top margin as a CSS length, e.g. `20px`, `1cm`, `10mm` or `0.5in`.",
      optional: true,
    },
    marginBottom: {
      type: "string",
      label: "Margin Bottom",
      description: "Bottom margin as a CSS length, e.g. `20px`, `1cm`, `10mm` or `0.5in`.",
      optional: true,
    },
    marginLeft: {
      type: "string",
      label: "Margin Left",
      description: "Left margin as a CSS length, e.g. `20px`, `1cm`, `10mm` or `0.5in`.",
      optional: true,
    },
    marginRight: {
      type: "string",
      label: "Margin Right",
      description: "Right margin as a CSS length, e.g. `20px`, `1cm`, `10mm` or `0.5in`.",
      optional: true,
    },
    timeout: {
      type: "integer",
      label: "Render Timeout (milliseconds)",
      description: "Maximum time to wait for the page to render, e.g. `30000`. Increase it for slow pages.",
      optional: true,
    },
    javascript: {
      type: "string",
      label: "Inject JavaScript",
      description: "JavaScript executed on the page before capture, e.g. `document.querySelector('.banner').remove();`.",
      optional: true,
    },
    css: {
      type: "string",
      label: "Inject CSS",
      description: "CSS injected into the page before capture, e.g. `.no-print { display: none; }`.",
      optional: true,
    },
    emulateMediaType: {
      type: "string",
      label: "Emulate Media Type",
      description: "CSS media type to emulate, e.g. `print` to apply print stylesheets or `screen`.",
      optional: true,
      options: MEDIA_TYPE_OPTIONS,
    },
    waitForSelector: {
      type: "string",
      label: "Wait For CSS Selector",
      description: "CSS selector that must appear before capture, e.g. `#invoice-total`. Times out after 30 seconds.",
      optional: true,
    },
    clickSelector: {
      type: "string",
      label: "Click CSS Selector",
      description: "CSS selector to wait for and click before capture, e.g. `#accept-cookies`.",
      optional: true,
    },
    clickSelectorChainSetup: {
      type: "object",
      label: "Click Selector Chain Setup",
      description: "Advanced sequence of clicks; when set, **Click CSS Selector** is ignored. Example: `{\"ignoreFailingChains\":true,\"chains\":[{\"selectors\":[\"#cookieDialog\"]},{\"selectors\":[\".popupClose\"]}]}`",
      optional: true,
    },
    waitForNetworkIdle: {
      type: "boolean",
      label: "Wait For Network Idle",
      description: "If `true`, waits until the page has no active network connections before capture. Example: `true`. Avoid on pages with long-polling requests.",
      optional: true,
    },
    delay: {
      type: "integer",
      label: "Render Delay (milliseconds)",
      description: "Extra wait before capture for asynchronous content, e.g. `2000`. Maximum `20000`.",
      optional: true,
      max: 20000,
    },
    loadImages: {
      type: "boolean",
      label: "Load Images",
      description: "If `true`, waits for all images to finish loading before capture. Example: `true`.",
      optional: true,
    },
    scale: {
      type: "string",
      label: "Page Scale",
      description: "Page scale factor between `0.1` and `2`, e.g. `0.8` to fit more content per page.",
      optional: true,
    },
    pageRanges: {
      type: "string",
      label: "Page Ranges",
      description: "Pages to include, e.g. `1-5` or `1,3,5`. Empty includes all pages.",
      optional: true,
    },
    printBackground: {
      type: "boolean",
      label: "Print Backgrounds",
      description: "If `true`, background colours and images are included. Example: `true`.",
      optional: true,
    },
    userAgent: {
      type: "string",
      label: "User Agent",
      description: "Custom User-Agent header sent when fetching **URL**, e.g. `Mozilla/5.0 (compatible; PDFGate/1.0)`.",
      optional: true,
    },
    httpHeaders: {
      type: "object",
      label: "HTTP Headers",
      description: "Extra HTTP headers sent when fetching **URL**, e.g. `{\"X-Api-Key\":\"abc123\",\"Accept-Language\":\"en\"}`.",
      optional: true,
    },
    authenticationUsername: {
      type: "string",
      label: "Authentication Username",
      description: "HTTP Basic authentication username used when fetching **URL**, e.g. `reports`.",
      optional: true,
    },
    authenticationPassword: {
      type: "string",
      label: "Authentication Password",
      description: "HTTP Basic authentication password used when fetching **URL**, e.g. `s3cret-Passw0rd`.",
      optional: true,
      secret: true,
    },
    viewportWidth: {
      type: "integer",
      label: "Viewport Width",
      description: "Browser viewport width in pixels before rendering, e.g. `1280`.",
      optional: true,
    },
    viewportHeight: {
      type: "integer",
      label: "Viewport Height",
      description: "Browser viewport height in pixels before rendering, e.g. `800`.",
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
          scale: toNumber(this.scale, "Page Scale", 0.1, 2),
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
