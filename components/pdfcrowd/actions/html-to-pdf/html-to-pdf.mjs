import pdfcrowd from "../../pdfcrowd.app.mjs";
import fs from "fs";
import path from "path";

export default {
  key: "pdfcrowd-html-to-pdf",
  name: "Convert HTML to PDF",
  description: "Convert URL or HTML to PDF. [See docs](https://pdfcrowd.com/api/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    pdfcrowd,
    url: {
      propDefinition: [
        pdfcrowd,
        "url",
      ],
    },
    htmlString: {
      propDefinition: [
        pdfcrowd,
        "htmlString",
      ],
    },
    outputFilename: {
      propDefinition: [
        pdfcrowd,
        "outputFilename",
      ],
    },
    page_size: {
      propDefinition: [
        pdfcrowd,
        "page_size",
      ],
    },
    page_width: {
      propDefinition: [
        pdfcrowd,
        "page_width",
      ],
    },
    page_height: {
      propDefinition: [
        pdfcrowd,
        "page_height",
      ],
    },
    orientation: {
      propDefinition: [
        pdfcrowd,
        "orientation",
      ],
    },
    margin_top: {
      propDefinition: [
        pdfcrowd,
        "margin_top",
      ],
    },
    margin_right: {
      propDefinition: [
        pdfcrowd,
        "margin_right",
      ],
    },
    margin_bottom: {
      propDefinition: [
        pdfcrowd,
        "margin_bottom",
      ],
    },
    margin_left: {
      propDefinition: [
        pdfcrowd,
        "margin_left",
      ],
    },
    content_viewport_width: {
      propDefinition: [
        pdfcrowd,
        "content_viewport_width",
      ],
    },
    custom_css: {
      propDefinition: [
        pdfcrowd,
        "custom_css",
      ],
    },
    custom_javascript: {
      propDefinition: [
        pdfcrowd,
        "custom_javascript",
      ],
    },
    element_to_convert: {
      propDefinition: [
        pdfcrowd,
        "element_to_convert",
      ],
    },
    // Expert mode options
    showExpertOptions: {
      type: "boolean",
      label: "Show Expert Options",
      description: "Enable to show advanced conversion options",
      default: false,
      optional: true,
      reloadProps: true,
    },
  },
  additionalProps() {
    if (!this.showExpertOptions) {
      return {};
    }
    return {
      no_margins: {
        type: "boolean",
        label: "No Margins",
        description: "Disable all page margins to use the entire page area. Use this for...",
        optional: true,
      },
      print_page_range: {
        type: "string",
        label: "Print Page Range",
        description: "Set the page range to print when you only need specific pages from the...",
        optional: true,
      },
      content_viewport_height: {
        type: "string",
        label: "Content Viewport Height",
        description: "Set the viewport height for formatting the HTML content when generating...",
        options: [
          "auto",
          "large",
        ],
        optional: true,
      },
      content_fit_mode: {
        type: "string",
        label: "Content Fit Mode",
        description: "Specify the mode for fitting the HTML content to the print area by...",
        options: [
          "auto",
          "smart-scaling",
          "no-scaling",
          "viewport-width",
          "content-width",
          "single-page",
          "single-page-ratio",
        ],
        optional: true,
      },
      remove_blank_pages: {
        type: "string",
        label: "Remove Blank Pages",
        description: "Specify which blank pages to exclude from the output document to create...",
        options: [
          "trailing",
          "all",
          "none",
        ],
        optional: true,
      },
      header_url: {
        type: "string",
        label: "Header URL",
        description: "Load an HTML code from the specified URL and use it as the page header.",
        optional: true,
      },
      header_html: {
        type: "string",
        label: "Header HTML",
        description: "Set the HTML header content with custom styling and dynamic page...",
        optional: true,
      },
      header_height: {
        type: "string",
        label: "Header Height",
        description: "Set the header height to allocate space for header content and prevent...",
        optional: true,
      },
      zip_header_filename: {
        type: "string",
        label: "Zip Header Filename",
        description: "Set the file name of the header HTML document stored in the input...",
        optional: true,
      },
      footer_url: {
        type: "string",
        label: "Footer URL",
        description: "Load an HTML code from the specified URL and use it as the page footer.",
        optional: true,
      },
      footer_html: {
        type: "string",
        label: "Footer HTML",
        description: "Set the HTML footer content with custom styling and dynamic page...",
        optional: true,
      },
      footer_height: {
        type: "string",
        label: "Footer Height",
        description: "Set the footer height to allocate space for footer content and prevent...",
        optional: true,
      },
      zip_footer_filename: {
        type: "string",
        label: "Zip Footer Filename",
        description: "Set the file name of the footer HTML document stored in the input...",
        optional: true,
      },
      no_header_footer_horizontal_margins: {
        type: "boolean",
        label: "No Header Footer Horizontal Margins",
        description: "Disable horizontal page margins for header and footer. The...",
        optional: true,
      },
      exclude_header_on_pages: {
        type: "string",
        label: "Exclude Header On Pages",
        description: "The page header content is not printed on the specified pages. To...",
        optional: true,
      },
      exclude_footer_on_pages: {
        type: "string",
        label: "Exclude Footer On Pages",
        description: "The page footer content is not printed on the specified pages. To...",
        optional: true,
      },
      header_footer_scale_factor: {
        type: "integer",
        label: "Header Footer Scale Factor",
        description: "Set the scaling factor (zoom) for the header and footer.",
        optional: true,
      },
      page_numbering_offset: {
        type: "integer",
        label: "Page Numbering Offset",
        description: "Set the numbering offset for page numbers in header/footer HTML to...",
        optional: true,
      },
      page_watermark_url: {
        type: "string",
        label: "Page Watermark URL",
        description: "Load a file from the specified URL and apply the file as a watermark to...",
        optional: true,
      },
      multipage_watermark_url: {
        type: "string",
        label: "Multipage Watermark URL",
        description: "Load a file from the specified URL and apply each page of the file as a...",
        optional: true,
      },
      page_background_url: {
        type: "string",
        label: "Page Background URL",
        description: "Load a file from the specified URL and apply the file as a background...",
        optional: true,
      },
      multipage_background_url: {
        type: "string",
        label: "Multipage Background URL",
        description: "Load a file from the specified URL and apply each page of the file as a...",
        optional: true,
      },
      page_background_color: {
        type: "string",
        label: "Page Background Color",
        description: "Set a solid background color for all pages, filling the entire page...",
        optional: true,
      },
      use_print_media: {
        type: "boolean",
        label: "Use Print Media",
        description: "Use the print version of the page if available via `@media` print CSS...",
        optional: true,
      },
      no_background: {
        type: "boolean",
        label: "No Background",
        description: "Do not print the background graphics to create printer-friendly PDFs....",
        optional: true,
      },
      disable_javascript: {
        type: "boolean",
        label: "Disable JavaScript",
        description: "Do not execute JavaScript during conversion. Use this to improve...",
        optional: true,
      },
      disable_image_loading: {
        type: "boolean",
        label: "Disable Image Loading",
        description: "Do not load images during conversion to create text-only PDFs. Use this...",
        optional: true,
      },
      disable_remote_fonts: {
        type: "boolean",
        label: "Disable Remote Fonts",
        description: "Disable loading fonts from remote sources. Use this to speed up...",
        optional: true,
      },
      load_iframes: {
        type: "string",
        label: "Load Iframes",
        description: "Specifies how iframes are handled during conversion. Use `\"all\"` to...",
        options: [
          "all",
          "same-origin",
          "none",
        ],
        optional: true,
      },
      block_ads: {
        type: "boolean",
        label: "Block Ads",
        description: "Automatically block common advertising networks and tracking scripts...",
        optional: true,
      },
      default_encoding: {
        type: "string",
        label: "Default Encoding",
        description: "Specify the character encoding when the HTML lacks proper charset...",
        optional: true,
      },
      locale: {
        type: "string",
        label: "Locale",
        description: "Set the locale for the conversion to control regional formatting of...",
        optional: true,
      },
      http_auth_user_name: {
        type: "string",
        label: "HTTP Auth User Name",
        description: "Set the HTTP authentication user name. Required to access protected web...",
        optional: true,
      },
      http_auth_password: {
        type: "string",
        label: "HTTP Auth Password",
        description: "Set the HTTP authentication password. Required to access protected web...",
        secret: true,
        optional: true,
      },
      cookies: {
        type: "string",
        label: "Cookies",
        description: "Set HTTP cookies to be included in all requests made by the converter...",
        optional: true,
      },
      verify_ssl_certificates: {
        type: "boolean",
        label: "Verify SSL Certificates",
        description: "Enforce SSL certificate validation for secure connections, preventing...",
        optional: true,
      },
      fail_on_main_url_error: {
        type: "boolean",
        label: "Fail On Main URL Error",
        description: "Abort the conversion if the HTTP status code of the main URL is greater...",
        optional: true,
      },
      fail_on_any_url_error: {
        type: "boolean",
        label: "Fail On Any URL Error",
        description: "Abort the conversion if any sub-request (images, stylesheets, scripts)...",
        optional: true,
      },
      css_page_rule_mode: {
        type: "string",
        label: "CSS Page Rule Mode",
        description: "Specifies behavior in the presence of CSS `@page` rules to control...",
        options: [
          "default",
          "mode1",
          "mode2",
        ],
        optional: true,
      },
      on_load_javascript: {
        type: "string",
        label: "On Load JavaScript",
        description: "Run a custom JavaScript right after the document is loaded. The script...",
        optional: true,
      },
      custom_http_header: {
        type: "string",
        label: "Custom HTTP Header",
        description: "Set a custom HTTP header to be included in all requests made by the...",
        optional: true,
      },
      javascript_delay: {
        type: "integer",
        label: "JavaScript Delay",
        description: "Wait the specified number of milliseconds to finish all JavaScript...",
        optional: true,
      },
      element_to_convert_mode: {
        type: "string",
        label: "Element To Convert Mode",
        description: "Control how CSS styles are applied when converting only part of a page....",
        options: [
          "cut-out",
          "remove-siblings",
          "hide-siblings",
        ],
        optional: true,
      },
      wait_for_element: {
        type: "string",
        label: "Wait For Element",
        description: "Wait for the specified element in a source document. Use this when...",
        optional: true,
      },
      auto_detect_element_to_convert: {
        type: "boolean",
        label: "Auto Detect Element To Convert",
        description: "The main HTML element for conversion is detected automatically. Use...",
        optional: true,
      },
      readability_enhancements: {
        type: "string",
        label: "Readability Enhancements",
        description: "Automatically enhance the input HTML to improve readability by removing...",
        options: [
          "none",
          "readability-v1",
          "readability-v2",
          "readability-v3",
          "readability-v4",
        ],
        optional: true,
      },
      scale_factor: {
        type: "integer",
        label: "Scale Factor",
        description: "Set the scaling factor (zoom) for the main page area to fit content...",
        optional: true,
      },
      jpeg_quality: {
        type: "integer",
        label: "JPEG Quality",
        description: "Set the quality of embedded JPEG images to balance file size and visual...",
        optional: true,
      },
      convert_images_to_jpeg: {
        type: "string",
        label: "Convert Images To JPEG",
        description: "Specify which image types will be converted to JPEG to reduce PDF file...",
        options: [
          "none",
          "opaque",
          "all",
        ],
        optional: true,
      },
      image_dpi: {
        type: "integer",
        label: "Image DPI",
        description: "Set the DPI of images in PDF to control resolution and file size. Use...",
        optional: true,
      },
      enable_pdf_forms: {
        type: "boolean",
        label: "Enable PDF Forms",
        description: "Convert HTML forms to fillable PDF forms that users can complete in PDF...",
        optional: true,
      },
      linearize: {
        type: "boolean",
        label: "Linearize",
        description: "Create linearized PDF. This is also known as Fast Web View. Use this to...",
        optional: true,
      },
      encrypt: {
        type: "boolean",
        label: "Encrypt",
        description: "Encrypt the PDF to prevent search engines from indexing the contents...",
        optional: true,
      },
      user_password: {
        type: "string",
        label: "User Password",
        description: "Protect the PDF with a user password to restrict who can open and view...",
        secret: true,
        optional: true,
      },
      owner_password: {
        type: "string",
        label: "Owner Password",
        description: "Protect the PDF with an owner password for administrative control. This...",
        secret: true,
        optional: true,
      },
      no_print: {
        type: "boolean",
        label: "No Print",
        description: "Disallow printing of the output PDF to protect sensitive content. Use...",
        optional: true,
      },
      no_modify: {
        type: "boolean",
        label: "No Modify",
        description: "Disallow modification of the output PDF to maintain document integrity....",
        optional: true,
      },
      no_copy: {
        type: "boolean",
        label: "No Copy",
        description: "Disallow text and graphics extraction from the output PDF to protect...",
        optional: true,
      },
      title: {
        type: "string",
        label: "Title",
        description: "Set the title of the PDF that appears in PDF reader title bars and...",
        optional: true,
      },
      subject: {
        type: "string",
        label: "Subject",
        description: "Set the subject of the PDF to categorize or summarize the document...",
        optional: true,
      },
      author: {
        type: "string",
        label: "Author",
        description: "Set the author of the PDF for attribution and document tracking. Use...",
        optional: true,
      },
      keywords: {
        type: "string",
        label: "Keywords",
        description: "Associate keywords with the document to improve searchability in...",
        optional: true,
      },
      extract_meta_tags: {
        type: "boolean",
        label: "Extract Meta Tags",
        description: "Extract meta tags (author, keywords and description) from the input...",
        optional: true,
      },
      page_layout: {
        type: "string",
        label: "Page Layout",
        description: "Control how pages appear when the PDF opens in viewers that respect...",
        options: [
          "single-page",
          "one-column",
          "two-column-left",
          "two-column-right",
        ],
        optional: true,
      },
      page_mode: {
        type: "string",
        label: "Page Mode",
        description: "Control the initial display mode when the PDF opens. `\"full-screen\"`...",
        options: [
          "full-screen",
          "thumbnails",
          "outlines",
        ],
        optional: true,
      },
      initial_zoom_type: {
        type: "string",
        label: "Initial Zoom Type",
        description: "Control how the PDF is initially zoomed when opened.",
        options: [
          "fit-width",
          "fit-height",
          "fit-page",
        ],
        optional: true,
      },
      initial_page: {
        type: "integer",
        label: "Initial Page",
        description: "Display the specified page when the document is opened.",
        optional: true,
      },
      initial_zoom: {
        type: "integer",
        label: "Initial Zoom",
        description: "Specify the initial page zoom in percents when the document is opened.",
        optional: true,
      },
      hide_toolbar: {
        type: "boolean",
        label: "Hide Toolbar",
        description: "Hide the viewer's toolbar when the PDF is opened to provide a cleaner,...",
        optional: true,
      },
      hide_menubar: {
        type: "boolean",
        label: "Hide Menubar",
        description: "Hide the viewer's menu bar when the PDF is opened for a cleaner...",
        optional: true,
      },
      hide_window_ui: {
        type: "boolean",
        label: "Hide Window UI",
        description: "Hide user interface elements like scroll bars and navigation controls...",
        optional: true,
      },
      fit_window: {
        type: "boolean",
        label: "Fit Window",
        description: "Resize the PDF viewer window to fit the size of the first displayed...",
        optional: true,
      },
      center_window: {
        type: "boolean",
        label: "Center Window",
        description: "Position the PDF viewer window in the center of the screen when opened....",
        optional: true,
      },
      display_title: {
        type: "boolean",
        label: "Display Title",
        description: "Display the title of the HTML document in the PDF viewer's title bar...",
        optional: true,
      },
      right_to_left: {
        type: "boolean",
        label: "Right To Left",
        description: "Set the predominant reading order for text to right-to-left. This...",
        optional: true,
      },
      debug_log: {
        type: "boolean",
        label: "Debug Log",
        description: "Turn on debug logging to troubleshoot conversion issues. Details about...",
        optional: true,
      },
      tag: {
        type: "string",
        label: "Tag",
        description: "Tag the conversion with a custom value for tracking and analytics. Use...",
        optional: true,
      },
      http_proxy: {
        type: "string",
        label: "HTTP Proxy",
        description: "A proxy server used by the conversion process for accessing the source...",
        optional: true,
      },
      https_proxy: {
        type: "string",
        label: "HTTPS Proxy",
        description: "A proxy server used by the conversion process for accessing the source...",
        optional: true,
      },
      layout_dpi: {
        type: "integer",
        label: "Layout DPI",
        description: "Set the internal DPI resolution used for positioning of PDF contents....",
        optional: true,
      },
      main_document_css_annotation: {
        type: "boolean",
        label: "Main Document CSS Annotation",
        description: "Add special CSS classes to the main document's body element. This...",
        optional: true,
      },
      header_footer_css_annotation: {
        type: "boolean",
        label: "Header Footer CSS Annotation",
        description: "Add special CSS classes to the header/footer's body element. This...",
        optional: true,
      },
      conversion_config: {
        type: "string",
        label: "Conversion Config",
        description: "Configure conversion via JSON. The configuration defines various page...",
        optional: true,
      },
      converter_version: {
        type: "string",
        label: "Converter Version",
        description: "Set the converter version. Different versions may produce different...",
        options: [
          "24.04",
          "20.10",
          "18.10",
        ],
        optional: true,
      },
    };
  },
  async run({ $ }) {
    const inputUrl = (this.url || "").trim();
    const inputHtml = (this.htmlString || "").trim();

    if (!inputUrl && !inputHtml) {
      throw new Error("Please provide a URL or HTML Content to convert");
    }
    if (inputUrl && inputHtml) {
      throw new Error("Please provide either a URL or HTML Content, not both");
    }

    // Helper to check if value is set
    const isSet = (v) => v !== undefined && v !== null && v !== "";

    // Build conversion options
    const conversionOpts = {
      $,
    };

    if (inputUrl) {
      conversionOpts.url = inputUrl;
    } else {
      conversionOpts.text = inputHtml;
    }

    // Basic conversion options
    const basicOptions = [
      "page_size",
      "page_width",
      "page_height",
      "orientation",
      "margin_top",
      "margin_right",
      "margin_bottom",
      "margin_left",
      "content_viewport_width",
      "custom_css",
      "custom_javascript",
      "element_to_convert",
    ];

    // Expert conversion options
    const expertOptions = [
      "no_margins",
      "print_page_range",
      "content_viewport_height",
      "content_fit_mode",
      "remove_blank_pages",
      "header_url",
      "header_html",
      "header_height",
      "zip_header_filename",
      "footer_url",
      "footer_html",
      "footer_height",
      "zip_footer_filename",
      "no_header_footer_horizontal_margins",
      "exclude_header_on_pages",
      "exclude_footer_on_pages",
      "header_footer_scale_factor",
      "page_numbering_offset",
      "page_watermark_url",
      "multipage_watermark_url",
      "page_background_url",
      "multipage_background_url",
      "page_background_color",
      "use_print_media",
      "no_background",
      "disable_javascript",
      "disable_image_loading",
      "disable_remote_fonts",
      "load_iframes",
      "block_ads",
      "default_encoding",
      "locale",
      "http_auth_user_name",
      "http_auth_password",
      "cookies",
      "verify_ssl_certificates",
      "fail_on_main_url_error",
      "fail_on_any_url_error",
      "css_page_rule_mode",
      "on_load_javascript",
      "custom_http_header",
      "javascript_delay",
      "element_to_convert_mode",
      "wait_for_element",
      "auto_detect_element_to_convert",
      "readability_enhancements",
      "scale_factor",
      "jpeg_quality",
      "convert_images_to_jpeg",
      "image_dpi",
      "enable_pdf_forms",
      "linearize",
      "encrypt",
      "user_password",
      "owner_password",
      "no_print",
      "no_modify",
      "no_copy",
      "title",
      "subject",
      "author",
      "keywords",
      "extract_meta_tags",
      "page_layout",
      "page_mode",
      "initial_zoom_type",
      "initial_page",
      "initial_zoom",
      "hide_toolbar",
      "hide_menubar",
      "hide_window_ui",
      "fit_window",
      "center_window",
      "display_title",
      "right_to_left",
      "debug_log",
      "tag",
      "http_proxy",
      "https_proxy",
      "layout_dpi",
      "main_document_css_annotation",
      "header_footer_css_annotation",
      "conversion_config",
      "converter_version",
    ];

    // Add basic options
    for (const opt of basicOptions) {
      if (isSet(this[opt])) {
        conversionOpts[opt] = this[opt];
      }
    }

    // Add expert options if enabled
    if (this.showExpertOptions) {
      for (const opt of expertOptions) {
        if (isSet(this[opt])) {
          conversionOpts[opt] = this[opt];
        }
      }
    }

    const result = await this.pdfcrowd.convert(conversionOpts);

    // Save PDF to tmp directory (sanitize filename to prevent path traversal)
    const filename = path.basename(this.outputFilename || "document.pdf");
    const tmpPath = path.join("/tmp", filename);
    fs.writeFileSync(tmpPath, Buffer.from(result.data));

    $.export("$summary", `Successfully converted to PDF: ${filename}`);

    return {
      filePath: tmpPath,
      filename,
      jobId: result.headers.jobId,
      pageCount: result.headers.pageCount,
      outputSize: result.headers.outputSize,
      consumedCredits: result.headers.consumedCredits,
      remainingCredits: result.headers.remainingCredits,
      debugLogUrl: result.headers.debugLogUrl,
    };
  },
};
