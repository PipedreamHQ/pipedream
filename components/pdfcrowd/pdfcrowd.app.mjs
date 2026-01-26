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
    page_size: {
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
    page_width: {
      type: "string",
      label: "Page Width",
      description: "Set custom page dimensions when standard sizes don't fit your needs....",
      default: "8.27in",
      optional: true,
    },
    page_height: {
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
    margin_top: {
      type: "string",
      label: "Margin Top",
      description: "Control white space at the top of the page. Increase for header space,...",
      default: "0.4in",
      optional: true,
    },
    margin_right: {
      type: "string",
      label: "Margin Right",
      description: "Control white space on the right edge of the page. Increase for...",
      default: "0.4in",
      optional: true,
    },
    margin_bottom: {
      type: "string",
      label: "Margin Bottom",
      description: "Control white space at the bottom of the page. Increase for footer...",
      default: "0.4in",
      optional: true,
    },
    margin_left: {
      type: "string",
      label: "Margin Left",
      description: "Control white space on the left edge of the page. Increase for...",
      default: "0.4in",
      optional: true,
    },
    content_viewport_width: {
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
    custom_css: {
      type: "string",
      label: "Custom CSS",
      description: "Apply custom CSS to the input HTML document to modify the visual...",
      optional: true,
    },
    custom_javascript: {
      type: "string",
      label: "Custom JavaScript",
      description: "Run a custom JavaScript after the document is loaded and ready to...",
      optional: true,
    },
    element_to_convert: {
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
    async convert(opts = {}) {
      const {
        $,
        url,
        text,
        ...params
      } = opts;

      // Build form data
      const formData = new URLSearchParams();

      if (url) {
        formData.append("url", url);
      } else if (text) {
        formData.append("text", text);
      } else {
        throw new Error("Please provide a URL or HTML Content to convert");
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
          jobId: response.headers["x-pdfcrowd-job-id"],
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
