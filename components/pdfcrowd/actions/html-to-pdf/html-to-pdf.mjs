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
    pageSize: {
      propDefinition: [
        pdfcrowd,
        "pageSize",
      ],
    },
    pageWidth: {
      propDefinition: [
        pdfcrowd,
        "pageWidth",
      ],
    },
    pageHeight: {
      propDefinition: [
        pdfcrowd,
        "pageHeight",
      ],
    },
    orientation: {
      propDefinition: [
        pdfcrowd,
        "orientation",
      ],
    },
    marginTop: {
      propDefinition: [
        pdfcrowd,
        "marginTop",
      ],
    },
    marginRight: {
      propDefinition: [
        pdfcrowd,
        "marginRight",
      ],
    },
    marginBottom: {
      propDefinition: [
        pdfcrowd,
        "marginBottom",
      ],
    },
    marginLeft: {
      propDefinition: [
        pdfcrowd,
        "marginLeft",
      ],
    },
    contentViewportWidth: {
      propDefinition: [
        pdfcrowd,
        "contentViewportWidth",
      ],
    },
    customCss: {
      propDefinition: [
        pdfcrowd,
        "customCss",
      ],
    },
    customJavascript: {
      propDefinition: [
        pdfcrowd,
        "customJavascript",
      ],
    },
    elementToConvert: {
      propDefinition: [
        pdfcrowd,
        "elementToConvert",
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
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  additionalProps() {
    if (!this.showExpertOptions) {
      return {};
    }
    return {
      noMargins: {
        type: "boolean",
        label: "No Margins",
        description: "Disable all page margins to use the entire page area. Use this for...",
        optional: true,
      },
      printPageRange: {
        type: "string",
        label: "Print Page Range",
        description: "Set the page range to print when you only need specific pages from the...",
        optional: true,
      },
      contentViewportHeight: {
        type: "string",
        label: "Content Viewport Height",
        description: "Set the viewport height for formatting the HTML content when generating...",
        options: [
          "auto",
          "large",
        ],
        optional: true,
      },
      contentFitMode: {
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
      removeBlankPages: {
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
      headerUrl: {
        type: "string",
        label: "Header URL",
        description: "Load an HTML code from the specified URL and use it as the page header.",
        optional: true,
      },
      headerHtml: {
        type: "string",
        label: "Header HTML",
        description: "Set the HTML header content with custom styling and dynamic page...",
        optional: true,
      },
      headerHeight: {
        type: "string",
        label: "Header Height",
        description: "Set the header height to allocate space for header content and prevent...",
        optional: true,
      },
      zipHeaderFilename: {
        type: "string",
        label: "Zip Header Filename",
        description: "Set the file name of the header HTML document stored in the input...",
        optional: true,
      },
      footerUrl: {
        type: "string",
        label: "Footer URL",
        description: "Load an HTML code from the specified URL and use it as the page footer.",
        optional: true,
      },
      footerHtml: {
        type: "string",
        label: "Footer HTML",
        description: "Set the HTML footer content with custom styling and dynamic page...",
        optional: true,
      },
      footerHeight: {
        type: "string",
        label: "Footer Height",
        description: "Set the footer height to allocate space for footer content and prevent...",
        optional: true,
      },
      zipFooterFilename: {
        type: "string",
        label: "Zip Footer Filename",
        description: "Set the file name of the footer HTML document stored in the input...",
        optional: true,
      },
      noHeaderFooterHorizontalMargins: {
        type: "boolean",
        label: "No Header Footer Horizontal Margins",
        description: "Disable horizontal page margins for header and footer. The...",
        optional: true,
      },
      excludeHeaderOnPages: {
        type: "string",
        label: "Exclude Header On Pages",
        description: "The page header content is not printed on the specified pages. To...",
        optional: true,
      },
      excludeFooterOnPages: {
        type: "string",
        label: "Exclude Footer On Pages",
        description: "The page footer content is not printed on the specified pages. To...",
        optional: true,
      },
      headerFooterScaleFactor: {
        type: "integer",
        label: "Header Footer Scale Factor",
        description: "Set the scaling factor (zoom) for the header and footer.",
        optional: true,
      },
      pageNumberingOffset: {
        type: "integer",
        label: "Page Numbering Offset",
        description: "Set the numbering offset for page numbers in header/footer HTML to...",
        optional: true,
      },
      pageWatermarkUrl: {
        type: "string",
        label: "Page Watermark URL",
        description: "Load a file from the specified URL and apply the file as a watermark to...",
        optional: true,
      },
      multipageWatermarkUrl: {
        type: "string",
        label: "Multipage Watermark URL",
        description: "Load a file from the specified URL and apply each page of the file as a...",
        optional: true,
      },
      pageBackgroundUrl: {
        type: "string",
        label: "Page Background URL",
        description: "Load a file from the specified URL and apply the file as a background...",
        optional: true,
      },
      multipageBackgroundUrl: {
        type: "string",
        label: "Multipage Background URL",
        description: "Load a file from the specified URL and apply each page of the file as a...",
        optional: true,
      },
      pageBackgroundColor: {
        type: "string",
        label: "Page Background Color",
        description: "Set a solid background color for all pages, filling the entire page...",
        optional: true,
      },
      usePrintMedia: {
        type: "boolean",
        label: "Use Print Media",
        description: "Use the print version of the page if available via `@media` print CSS...",
        optional: true,
      },
      noBackground: {
        type: "boolean",
        label: "No Background",
        description: "Do not print the background graphics to create printer-friendly PDFs....",
        optional: true,
      },
      disableJavascript: {
        type: "boolean",
        label: "Disable JavaScript",
        description: "Do not execute JavaScript during conversion. Use this to improve...",
        optional: true,
      },
      disableImageLoading: {
        type: "boolean",
        label: "Disable Image Loading",
        description: "Do not load images during conversion to create text-only PDFs. Use this...",
        optional: true,
      },
      disableRemoteFonts: {
        type: "boolean",
        label: "Disable Remote Fonts",
        description: "Disable loading fonts from remote sources. Use this to speed up...",
        optional: true,
      },
      loadIframes: {
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
      blockAds: {
        type: "boolean",
        label: "Block Ads",
        description: "Automatically block common advertising networks and tracking scripts...",
        optional: true,
      },
      defaultEncoding: {
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
      httpAuthUserName: {
        type: "string",
        label: "HTTP Auth User Name",
        description: "Set the HTTP authentication user name. Required to access protected web...",
        optional: true,
      },
      httpAuthPassword: {
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
      verifySslCertificates: {
        type: "boolean",
        label: "Verify SSL Certificates",
        description: "Enforce SSL certificate validation for secure connections, preventing...",
        optional: true,
      },
      failOnMainUrlError: {
        type: "boolean",
        label: "Fail On Main URL Error",
        description: "Abort the conversion if the HTTP status code of the main URL is greater...",
        optional: true,
      },
      failOnAnyUrlError: {
        type: "boolean",
        label: "Fail On Any URL Error",
        description: "Abort the conversion if any sub-request (images, stylesheets, scripts)...",
        optional: true,
      },
      cssPageRuleMode: {
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
      onLoadJavascript: {
        type: "string",
        label: "On Load JavaScript",
        description: "Run a custom JavaScript right after the document is loaded. The script...",
        optional: true,
      },
      customHttpHeader: {
        type: "string",
        label: "Custom HTTP Header",
        description: "Set a custom HTTP header to be included in all requests made by the...",
        optional: true,
      },
      javascriptDelay: {
        type: "integer",
        label: "JavaScript Delay",
        description: "Wait the specified number of milliseconds to finish all JavaScript...",
        optional: true,
      },
      elementToConvertMode: {
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
      waitForElement: {
        type: "string",
        label: "Wait For Element",
        description: "Wait for the specified element in a source document. Use this when...",
        optional: true,
      },
      autoDetectElementToConvert: {
        type: "boolean",
        label: "Auto Detect Element To Convert",
        description: "The main HTML element for conversion is detected automatically. Use...",
        optional: true,
      },
      readabilityEnhancements: {
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
      scaleFactor: {
        type: "integer",
        label: "Scale Factor",
        description: "Set the scaling factor (zoom) for the main page area to fit content...",
        optional: true,
      },
      jpegQuality: {
        type: "integer",
        label: "JPEG Quality",
        description: "Set the quality of embedded JPEG images to balance file size and visual...",
        optional: true,
      },
      convertImagesToJpeg: {
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
      imageDpi: {
        type: "integer",
        label: "Image DPI",
        description: "Set the DPI of images in PDF to control resolution and file size. Use...",
        optional: true,
      },
      enablePDFForms: {
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
      userPassword: {
        type: "string",
        label: "User Password",
        description: "Protect the PDF with a user password to restrict who can open and view...",
        secret: true,
        optional: true,
      },
      ownerPassword: {
        type: "string",
        label: "Owner Password",
        description: "Protect the PDF with an owner password for administrative control. This...",
        secret: true,
        optional: true,
      },
      noPrint: {
        type: "boolean",
        label: "No Print",
        description: "Disallow printing of the output PDF to protect sensitive content. Use...",
        optional: true,
      },
      noModify: {
        type: "boolean",
        label: "No Modify",
        description: "Disallow modification of the output PDF to maintain document integrity....",
        optional: true,
      },
      noCopy: {
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
      pageLayout: {
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
      pageMode: {
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
      initialZoomType: {
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
      initialPage: {
        type: "integer",
        label: "Initial Page",
        description: "Display the specified page when the document is opened.",
        optional: true,
      },
      initialZoom: {
        type: "integer",
        label: "Initial Zoom",
        description: "Specify the initial page zoom in percents when the document is opened.",
        optional: true,
      },
      hideToolbar: {
        type: "boolean",
        label: "Hide Toolbar",
        description: "Hide the viewer's toolbar when the PDF is opened to provide a cleaner,...",
        optional: true,
      },
      hideMenubar: {
        type: "boolean",
        label: "Hide Menubar",
        description: "Hide the viewer's menu bar when the PDF is opened for a cleaner...",
        optional: true,
      },
      hideWindowUi: {
        type: "boolean",
        label: "Hide Window UI",
        description: "Hide user interface elements like scroll bars and navigation controls...",
        optional: true,
      },
      fitWindow: {
        type: "boolean",
        label: "Fit Window",
        description: "Resize the PDF viewer window to fit the size of the first displayed...",
        optional: true,
      },
      centerWindow: {
        type: "boolean",
        label: "Center Window",
        description: "Position the PDF viewer window in the center of the screen when opened....",
        optional: true,
      },
      displayTitle: {
        type: "boolean",
        label: "Display Title",
        description: "Display the title of the HTML document in the PDF viewer's title bar...",
        optional: true,
      },
      rightToLeft: {
        type: "boolean",
        label: "Right To Left",
        description: "Set the predominant reading order for text to right-to-left. This...",
        optional: true,
      },
      debugLog: {
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
      httpProxy: {
        type: "string",
        label: "HTTP Proxy",
        description: "A proxy server used by the conversion process for accessing the source...",
        optional: true,
      },
      httpsProxy: {
        type: "string",
        label: "HTTPS Proxy",
        description: "A proxy server used by the conversion process for accessing the source...",
        optional: true,
      },
      layoutDpi: {
        type: "integer",
        label: "Layout DPI",
        description: "Set the internal DPI resolution used for positioning of PDF contents....",
        optional: true,
      },
      mainDocumentCssAnnotation: {
        type: "boolean",
        label: "Main Document CSS Annotation",
        description: "Add special CSS classes to the main document's body element. This...",
        optional: true,
      },
      headerFooterCssAnnotation: {
        type: "boolean",
        label: "Header Footer CSS Annotation",
        description: "Add special CSS classes to the header/footer's body element. This...",
        optional: true,
      },
      conversionConfig: {
        type: "string",
        label: "Conversion Config",
        description: "Configure conversion via JSON. The configuration defines various page...",
        optional: true,
      },
      converterVersion: {
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

    // Helper to convert snake_case to camelCase
    const snakeToCamel = (str) => str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

    // Build conversion options
    const conversionOpts = {
      $,
    };

    if (inputUrl) {
      conversionOpts.url = inputUrl;
    } else {
      conversionOpts.text = inputHtml;
    }

    // Basic conversion options (snake_case for API)
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

    // Expert conversion options (snake_case for API)
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

    // Add basic options (map from camelCase props to snake_case API params)
    for (const apiParam of basicOptions) {
      const propName = snakeToCamel(apiParam);
      if (isSet(this[propName])) {
        conversionOpts[apiParam] = this[propName];
      }
    }

    // Add expert options if enabled (map from camelCase props to snake_case API params)
    if (this.showExpertOptions) {
      for (const apiParam of expertOptions) {
        const propName = snakeToCamel(apiParam);
        if (isSet(this[propName])) {
          conversionOpts[apiParam] = this[propName];
        }
      }
    }

    const result = await this.pdfcrowd.convert(conversionOpts);

    // Save PDF to tmp directory (sanitize filename to prevent path traversal)
    let filename = path.basename(this.outputFilename || "document.pdf").trim();
    if (!filename || filename === "." || filename === "..") {
      filename = "document.pdf";
    }
    const tmpPath = path.join("/tmp", filename);
    fs.writeFileSync(tmpPath, Buffer.from(result.data));

    $.export("$summary", `Successfully converted to PDF: ${filename}`);

    return {
      filePath: tmpPath,
      filename,
      jobId: result.headers?.jobId ?? "",
      pageCount: result.headers?.pageCount ?? 0,
      outputSize: result.headers?.outputSize ?? 0,
      consumedCredits: result.headers?.consumedCredits ?? 0,
      remainingCredits: result.headers?.remainingCredits ?? 0,
      debugLogUrl: result.headers?.debugLogUrl ?? "",
    };
  },
};
