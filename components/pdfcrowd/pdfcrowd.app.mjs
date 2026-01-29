import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "pdfcrowd",
  propDefinitions: {
    url: {
      type: "string",
      label: "URL",
      description: "The URL to convert. Must be publicly accessible.",
      optional: true,
    },
    htmlString: {
      type: "string",
      label: "HTML Content",
      description: "Raw HTML content to convert to PDF.",
      optional: true,
    },
    outputFilename: {
      type: "string",
      label: "Output Filename",
      description: "The filename for the generated PDF.",
      default: "document.pdf",
      optional: true,
    },
    pageSize: {
      type: "string",
      label: "Page Size",
      description: "Set the output page size using standard formats (A4, Letter, A3, etc.)....",
      options: [
        "A0",
        "A1",
        "A2",
        "A3",
        "A4",
        "A5",
        "A6",
        "Letter",
      ],
      default: "A4",
      optional: true,
    },
    pageWidth: {
      type: "string",
      label: "Page Width",
      description: "Set custom page dimensions when standard sizes don't fit your needs....",
      default: "8.27in",
      optional: true,
    },
    pageHeight: {
      type: "string",
      label: "Page Height",
      description: "Set custom page height for specific formats like receipts, banners, or...",
      default: "11.7in",
      optional: true,
    },
    orientation: {
      type: "string",
      label: "Orientation",
      description: "Set the output page orientation to portrait or landscape. Use landscape...",
      options: [
        "landscape",
        "portrait",
      ],
      default: "portrait",
      optional: true,
    },
    marginTop: {
      type: "string",
      label: "Margin Top",
      description: "Control white space at the top of the page. Increase for header space,...",
      default: "0.4in",
      optional: true,
    },
    marginRight: {
      type: "string",
      label: "Margin Right",
      description: "Control white space on the right edge of the page. Increase for...",
      default: "0.4in",
      optional: true,
    },
    marginBottom: {
      type: "string",
      label: "Margin Bottom",
      description: "Control white space at the bottom of the page. Increase for footer...",
      default: "0.4in",
      optional: true,
    },
    marginLeft: {
      type: "string",
      label: "Margin Left",
      description: "Control white space on the left edge of the page. Increase for...",
      default: "0.4in",
      optional: true,
    },
    contentViewportWidth: {
      type: "string",
      label: "Content Viewport Width",
      description: "Set the viewport width for formatting the HTML content when generating...",
      options: [
        "balanced",
        "small",
        "medium",
        "large",
        "extra-large",
      ],
      default: "medium",
      optional: true,
    },
    customCss: {
      type: "string",
      label: "Custom CSS",
      description: "Apply custom CSS to the input HTML document to modify the visual...",
      optional: true,
    },
    customJavascript: {
      type: "string",
      label: "Custom JavaScript",
      description: "Run a custom JavaScript after the document is loaded and ready to...",
      optional: true,
    },
    elementToConvert: {
      type: "string",
      label: "Element To Convert",
      description: "Convert only the specified element from the main document and its...",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.pdfcrowd.com/convert/24.04";
    },
    _auth() {
      return {
        username: this.$auth.username,
        password: this.$auth.api_key,
      };
    },
    /**
     * Convert URL or HTML to PDF.
     * @param {Object} opts - Conversion options
     * @param {Object} [opts.$] - Pipedream context for axios
     * @param {string} [opts.url] - URL to convert (mutually exclusive with text/htmlString)
     * @param {string} [opts.text] - HTML content to convert (mutually exclusive with url)
     * @param {string} [opts.htmlString] - Alias for text (mutually exclusive with url)
     * @returns {Promise<{data: Buffer, headers: ConversionHeaders}>}
     * @typedef {Object} ConversionHeaders
     * @property {string} jobId - Unique job identifier (may be empty)
     * @property {number} pageCount - Number of pages in output (0 if unavailable)
     * @property {number} outputSize - Output file size in bytes (0 if unavailable)
     * @property {number} consumedCredits - Credits used (0 if unavailable)
     * @property {number} remainingCredits - Credits remaining (0 if unavailable)
     * @property {string} debugLogUrl - Debug log URL (empty if not enabled)
     * @throws {Error} If none or more than one input source is provided
     */
    async convert(opts = {}) {
      const {
        $,
        url,
        text,
        htmlString,
        ...params
      } = opts;

      // Validate exactly one input source is provided
      const htmlContent = text || htmlString;
      const hasUrl = Boolean(url);
      const hasHtml = Boolean(htmlContent);

      if (!hasUrl && !hasHtml) {
        throw new Error("Please provide either a URL or HTML Content to convert");
      }
      if (hasUrl && hasHtml) {
        throw new Error("Please provide either a URL or HTML Content, not both");
      }

      // Build form data
      const formData = new URLSearchParams();

      if (hasUrl) {
        formData.append("url", url);
      } else {
        formData.append("text", htmlContent);
      }

      // Add all other options
      for (const [
        key,
        value,
      ] of Object.entries(params)) {
        if (value !== undefined && value !== null && value !== "") {
          formData.append(key, String(value));
        }
      }

      // Using direct REST API instead of pdfcrowd npm package for tight integration
      // with Pipedream's axios wrapper, auth handling, and error formatting
      const response = await axios($ || this, {
        method: "POST",
        url: `${this._baseUrl()}/`,
        auth: this._auth(),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "pdfcrowd-pipedream/0.0.1",
        },
        data: formData.toString(),
        responseType: "arraybuffer",
        returnFullResponse: true,
      });

      return {
        data: response.data,
        headers: {
          jobId: response.headers["x-pdfcrowd-job-id"] || "",
          pageCount: parseInt(response.headers["x-pdfcrowd-pages"] || "0", 10),
          outputSize: parseInt(response.headers["x-pdfcrowd-output-size"] || "0", 10),
          consumedCredits: parseInt(response.headers["x-pdfcrowd-consumed-credits"] || "0", 10),
          remainingCredits: parseInt(response.headers["x-pdfcrowd-remaining-credits"] || "0", 10),
          debugLogUrl: response.headers["x-pdfcrowd-debug-log"] || "",
        },
      };
    },
  },
};
