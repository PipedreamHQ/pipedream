import pdfcrowd from "../../pdfcrowd.app.mjs";
import fs from "fs";
import path from "path";

export default {
  key: "pdfcrowd-html-to-pdf",
  name: "Convert HTML to PDF",
  description: "Convert URL or HTML to PDF. [See docs](https://pdfcrowd.com/api/)",
  version: "0.1.0",
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
        description: "Disable all page margins to use the entire page area. Use this for full-bleed designs where content should extend to the page edges, such as posters, certificates, or branded materials.",
        optional: true,
      },
      printPageRange: {
        type: "string",
        label: "Print Page Range",
        description: "Set the page range to print when you only need specific pages from the conversion. Use this to extract individual pages (e.g., `2`), specific ranges (e.g., `3-7`), or combinations (e.g., `1,4-6,last`). Supports special strings like `odd`, `even`, and `last`.",
        optional: true,
      },
      contentViewportHeight: {
        type: "string",
        label: "Content Viewport Height",
        description: "Set the viewport height for formatting the HTML content when generating a PDF. Use `auto` for standard pages, or `large` to enforce loading of lazy-loaded images and affect vertical positioning of absolutely positioned elements.",
        options: [
          "auto",
          "large",
        ],
        optional: true,
      },
      contentFitMode: {
        type: "string",
        label: "Content Fit Mode",
        description: "Specify the mode for fitting the HTML content to the print area by upscaling or downscaling it. Use `auto` for automatic mode, `smart-scaling` to fit more content, `no-scaling` for pixel-perfect output, `viewport-width` or `content-width` to fit width, or `single-page` to fit entire content on one page.",
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
        description: "Specify which blank pages to exclude from the output document to create cleaner PDFs. Use `trailing` to remove empty pages at the end, `all` to remove blank pages throughout the document, or `none` to keep all pages.",
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
        description: "Set the HTML header content with custom styling and dynamic page numbers. Use CSS classes like `pdfcrowd-page-number` and `pdfcrowd-page-count` for dynamic content. Ideal for reports, invoices, and professional documents.",
        optional: true,
      },
      headerHeight: {
        type: "string",
        label: "Header Height",
        description: "Set the header height to allocate space for header content and prevent overlap with main content. Increase this if your header text is getting cut off. Value must be specified in inches `in`, millimeters `mm`, centimeters `cm`, pixels `px`, or points `pt`.",
        optional: true,
      },
      zipHeaderFilename: {
        type: "string",
        label: "Zip Header Filename",
        description: "Set the file name of the header HTML document stored in the input archive. Use this method if the input archive contains multiple HTML documents.",
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
        description: "Set the HTML footer content with custom styling and dynamic page numbers. Use CSS classes like `pdfcrowd-page-number` and `pdfcrowd-page-count` for dynamic content. Ideal for contracts, reports, and official documents.",
        optional: true,
      },
      footerHeight: {
        type: "string",
        label: "Footer Height",
        description: "Set the footer height to allocate space for footer content and prevent overlap with main content. Increase this if your footer text is getting cut off. Value must be specified in inches `in`, millimeters `mm`, centimeters `cm`, pixels `px`, or points `pt`.",
        optional: true,
      },
      zipFooterFilename: {
        type: "string",
        label: "Zip Footer Filename",
        description: "Set the file name of the footer HTML document stored in the input archive. Use this method if the input archive contains multiple HTML documents.",
        optional: true,
      },
      noHeaderFooterHorizontalMargins: {
        type: "boolean",
        label: "No Header Footer Horizontal Margins",
        description: "Disable horizontal page margins for header and footer. The header/footer contents width will be equal to the physical page width.",
        optional: true,
      },
      excludeHeaderOnPages: {
        type: "string",
        label: "Exclude Header On Pages",
        description: "The page header content is not printed on the specified pages. To remove the entire header area, use the conversion config. Specify as a comma-separated list of page numbers (e.g., `1,-1` for first and last page).",
        optional: true,
      },
      excludeFooterOnPages: {
        type: "string",
        label: "Exclude Footer On Pages",
        description: "The page footer content is not printed on the specified pages. To remove the entire footer area, use the conversion config. Specify as a comma-separated list of page numbers (e.g., `1,-1` for first and last page).",
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
        description: "Set the numbering offset for page numbers in header/footer HTML to continue page numbering from a previous document. For example, set to 10 if you've already generated pages 1-10, and the next section will start at page 11.",
        optional: true,
      },
      pageWatermarkUrl: {
        type: "string",
        label: "Page Watermark URL",
        description: "Load a file from the specified URL and apply the file as a watermark to each page of the output PDF. A watermark can be either a PDF or an image. If a multi-page file is used, the first page is used as the watermark.",
        optional: true,
      },
      multipageWatermarkUrl: {
        type: "string",
        label: "Multipage Watermark URL",
        description: "Load a file from the specified URL and apply each page of the file as a watermark to the corresponding page of the output PDF. A watermark can be either a PDF or an image.",
        optional: true,
      },
      pageBackgroundUrl: {
        type: "string",
        label: "Page Background URL",
        description: "Load a file from the specified URL and apply the file as a background to each page of the output PDF. A background can be either a PDF or an image. If a multi-page file is used, the first page is used as the background.",
        optional: true,
      },
      multipageBackgroundUrl: {
        type: "string",
        label: "Multipage Background URL",
        description: "Load a file from the specified URL and apply each page of the file as a background to the corresponding page of the output PDF. A background can be either a PDF or an image.",
        optional: true,
      },
      pageBackgroundColor: {
        type: "string",
        label: "Page Background Color",
        description: "Set a solid background color for all pages, filling the entire page area including margins. Format as RGB (e.g., `FF0000` for red) or RGBA (e.g., `00ff0080` for 50% transparent green) hexadecimal.",
        optional: true,
      },
      usePrintMedia: {
        type: "boolean",
        label: "Use Print Media",
        description: "Use the print version of the page if available via `@media` print CSS rules. Enable this when converting websites that have print-optimized styles. Many sites hide navigation, ads, and sidebars in print mode.",
        optional: true,
      },
      noBackground: {
        type: "boolean",
        label: "No Background",
        description: "Do not print the background graphics to create printer-friendly PDFs. Use this when documents will be physically printed to save ink costs and improve readability. Removes background colors, images, and patterns while preserving text.",
        optional: true,
      },
      disableJavascript: {
        type: "boolean",
        label: "Disable JavaScript",
        description: "Do not execute JavaScript during conversion. Use this to improve conversion speed when JavaScript is not needed, prevent dynamic content changes, or avoid security risks from untrusted scripts. Note: lazy-loaded images and AJAX content will not load.",
        optional: true,
      },
      disableImageLoading: {
        type: "boolean",
        label: "Disable Image Loading",
        description: "Do not load images during conversion to create text-only PDFs. Use this to significantly speed up conversion, reduce file size, or create accessible text-focused documents.",
        optional: true,
      },
      disableRemoteFonts: {
        type: "boolean",
        label: "Disable Remote Fonts",
        description: "Disable loading fonts from remote sources. Use this to speed up conversion by avoiding font download delays, ensure consistent rendering with system fonts, or work around font loading failures.",
        optional: true,
      },
      loadIframes: {
        type: "string",
        label: "Load Iframes",
        description: "Specifies how iframes are handled during conversion. Use `all` to include all embedded content (videos, maps, widgets), `same-origin` to include only content from the same domain for security, or `none` to exclude all iframes for faster conversion.",
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
        description: "Automatically block common advertising networks and tracking scripts during conversion, producing cleaner PDFs with faster conversion times. Ideal for converting news sites, blogs, or any ad-heavy content.",
        optional: true,
      },
      defaultEncoding: {
        type: "string",
        label: "Default Encoding",
        description: "Specify the character encoding when the HTML lacks proper charset declaration or has incorrect encoding. Set to `utf-8` for modern content, `iso-8859-1` for Western European legacy pages, or other encodings for specific regional content.",
        optional: true,
      },
      locale: {
        type: "string",
        label: "Locale",
        description: "Set the locale for the conversion to control regional formatting of dates, times, and numbers. For example, set to `en-US` for MM/DD/YYYY dates or `de-DE` for DD.MM.YYYY dates. Essential for financial reports, invoices, or localized content.",
        optional: true,
      },
      httpAuthUserName: {
        type: "string",
        label: "HTTP Auth User Name",
        description: "Set the HTTP authentication user name. Required to access protected web pages or staging environments.",
        optional: true,
      },
      httpAuthPassword: {
        type: "string",
        label: "HTTP Auth Password",
        description: "Set the HTTP authentication password. Required to access protected web pages or staging environments.",
        secret: true,
        optional: true,
      },
      cookies: {
        type: "string",
        label: "Cookies",
        description: "Set HTTP cookies to be included in all requests made by the converter to access authenticated or session-based content. Format as semicolon-separated name=value pairs (e.g., `session=abc123;token=xyz`).",
        optional: true,
      },
      verifySslCertificates: {
        type: "boolean",
        label: "Verify SSL Certificates",
        description: "Enforce SSL certificate validation for secure connections, preventing conversions from sites with invalid certificates. When disabled, allows conversion from any HTTPS site including development servers with self-signed certificates.",
        optional: true,
      },
      failOnMainUrlError: {
        type: "boolean",
        label: "Fail On Main URL Error",
        description: "Abort the conversion if the HTTP status code of the main URL is greater than or equal to 400 (client/server errors). Use this in automated workflows to catch broken URLs or authentication failures early.",
        optional: true,
      },
      failOnAnyUrlError: {
        type: "boolean",
        label: "Fail On Any URL Error",
        description: "Abort the conversion if any sub-request (images, stylesheets, scripts) fails with HTTP 400+ errors. Use this for strict quality control when all assets must load successfully.",
        optional: true,
      },
      cssPageRuleMode: {
        type: "string",
        label: "CSS Page Rule Mode",
        description: "Specifies behavior in the presence of CSS `@page` rules to control which settings take precedence. Use `default` to prioritize API settings over CSS rules, `mode1` for backward compatibility, or `mode2` to respect CSS @page rules for print-optimized HTML.",
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
        description: "Run a custom JavaScript right after the document is loaded. The script is intended for early DOM manipulation (add/remove elements, update CSS). In addition to standard browser APIs, the custom JavaScript code can use helper functions from the PDFCrowd JavaScript library.",
        optional: true,
      },
      customHttpHeader: {
        type: "string",
        label: "Custom HTTP Header",
        description: "Set a custom HTTP header to be included in all requests made by the converter. Use this to pass authentication tokens, add tracking headers, or provide API keys. Format as `name:value` (e.g., `X-My-Client-ID:k2017-12345`).",
        optional: true,
      },
      javascriptDelay: {
        type: "integer",
        label: "JavaScript Delay",
        description: "Wait the specified number of milliseconds to finish all JavaScript after the document is loaded. Use this to ensure lazy-loaded images, AJAX content, or animations complete before conversion. Default is 200ms.",
        optional: true,
      },
      elementToConvertMode: {
        type: "string",
        label: "Element To Convert Mode",
        description: "Control how CSS styles are applied when converting only part of a page. `cut-out` extracts the element into a new document root. `remove-siblings` keeps the element in its original DOM position but deletes other elements. `hide-siblings` keeps all elements but hides non-selected ones.",
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
        description: "Wait for the specified element in a source document. Use this when specific dynamic content must be ready before conversion. The element is specified by one or more CSS selectors (e.g., `#main-content`, `.data-loaded`). If the element is not found, the conversion fails.",
        optional: true,
      },
      autoDetectElementToConvert: {
        type: "boolean",
        label: "Auto Detect Element To Convert",
        description: "The main HTML element for conversion is detected automatically. Use this when you want to extract article or main content without knowing the exact CSS selector, automatically excluding navigation and sidebars.",
        optional: true,
      },
      readabilityEnhancements: {
        type: "string",
        label: "Readability Enhancements",
        description: "Automatically enhance the input HTML to improve readability by removing clutter and reformatting content. Use `none` for no changes, or `readability-v1` through `readability-v4` for progressively aggressive cleanup algorithms. Higher versions may remove some content.",
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
        description: "Set the scaling factor (zoom) for the main page area to fit content better. Use values below 100 to shrink oversized content, or above 100 to enlarge small content. Accepted range is 10-500, default is 100.",
        optional: true,
      },
      jpegQuality: {
        type: "integer",
        label: "JPEG Quality",
        description: "Set the quality of embedded JPEG images to balance file size and visual quality. Use 100 for archival documents, 70-85 for web distribution, or 50-60 when file size is more important than image clarity. Accepted range is 1-100.",
        optional: true,
      },
      convertImagesToJpeg: {
        type: "string",
        label: "Convert Images To JPEG",
        description: "Specify which image types will be converted to JPEG to reduce PDF file size. Use `opaque` to convert only non-transparent images (safe for most documents), `all` to convert everything (transparent areas become white), or `none` to preserve original formats.",
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
        description: "Set the DPI of images in PDF to control resolution and file size. Use 300 for professional printing, 150 for everyday documents, 96 for screen-only viewing, or 0 to preserve original image resolution. This only downscales - it will not upscale low-resolution images.",
        optional: true,
      },
      enablePdfForms: {
        type: "boolean",
        label: "Enable PDF Forms",
        description: "Convert HTML forms to fillable PDF forms that users can complete in PDF readers. Use this to create interactive PDFs from HTML forms. Ideal for creating fillable applications, surveys, or order forms that work offline.",
        optional: true,
      },
      linearize: {
        type: "boolean",
        label: "Linearize",
        description: "Create linearized PDF. This is also known as Fast Web View. Use this to optimize PDFs for progressive download, allowing users to start viewing the first page while the rest downloads.",
        optional: true,
      },
      encrypt: {
        type: "boolean",
        label: "Encrypt",
        description: "Encrypt the PDF to prevent search engines from indexing the contents and add an extra layer of security. Use this for confidential documents, internal reports, or any content you do not want appearing in search results.",
        optional: true,
      },
      userPassword: {
        type: "string",
        label: "User Password",
        description: "Protect the PDF with a user password to restrict who can open and view the document. Recipients must enter this password to view the PDF. Combine with permission flags to restrict what users can do after opening.",
        secret: true,
        optional: true,
      },
      ownerPassword: {
        type: "string",
        label: "Owner Password",
        description: "Protect the PDF with an owner password for administrative control. This password allows changing permissions, passwords, and document restrictions - like a master key. Use different user and owner passwords to give recipients restricted access while retaining full control.",
        secret: true,
        optional: true,
      },
      noPrint: {
        type: "boolean",
        label: "No Print",
        description: "Disallow printing of the output PDF to protect sensitive content. Use this for confidential documents, copyrighted materials, or preview versions you want to restrict.",
        optional: true,
      },
      noModify: {
        type: "boolean",
        label: "No Modify",
        description: "Disallow modification of the output PDF to maintain document integrity. Use this for official documents, contracts, or records that should not be altered after creation. Prevents recipients from editing content, adding annotations, or extracting pages.",
        optional: true,
      },
      noCopy: {
        type: "boolean",
        label: "No Copy",
        description: "Disallow text and graphics extraction from the output PDF to protect copyrighted content. Use this for ebooks, proprietary documents, or materials where you want to prevent easy copying and redistribution.",
        optional: true,
      },
      title: {
        type: "string",
        label: "Title",
        description: "Set the title of the PDF that appears in PDF reader title bars and document properties. Use descriptive titles for better organization and searchability. This metadata also improves accessibility for screen readers.",
        optional: true,
      },
      subject: {
        type: "string",
        label: "Subject",
        description: "Set the subject of the PDF to categorize or summarize the document content. Use this to add searchable metadata for document management systems, improve organization in large PDF libraries, or provide context about the document's purpose.",
        optional: true,
      },
      author: {
        type: "string",
        label: "Author",
        description: "Set the author of the PDF for attribution and document tracking. Use this to identify who created the document, important for official documents, reports, or publications. This metadata appears in PDF properties.",
        optional: true,
      },
      keywords: {
        type: "string",
        label: "Keywords",
        description: "Associate keywords with the document to improve searchability in document management systems. Use relevant terms that describe the content. Separate multiple keywords with commas (e.g., `software developer, Unix, databases`).",
        optional: true,
      },
      extractMetaTags: {
        type: "boolean",
        label: "Extract Meta Tags",
        description: "Extract meta tags (author, keywords and description) from the input HTML and automatically populate PDF metadata. Use this when converting web pages that already have proper HTML meta tags, saving you from manually setting title, author, and keywords.",
        optional: true,
      },
      pageLayout: {
        type: "string",
        label: "Page Layout",
        description: "Control how pages appear when the PDF opens in viewers. `single-page` for focused reading one page at a time, `one-column` for continuous scrolling like a web page, `two-column-left` for book-like layouts with odd pages on left, or `two-column-right` for magazines.",
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
        description: "Control the initial display mode when the PDF opens. `full-screen` for presentations and kiosk displays, `thumbnails` for long documents where visual page navigation is helpful, or `outlines` for structured documents with bookmarks/table of contents.",
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
        description: "Hide the viewer's toolbar when the PDF is opened to provide a cleaner, more focused reading experience. Use this for presentations, kiosk displays, or immersive reading where you want minimal UI distractions.",
        optional: true,
      },
      hideMenubar: {
        type: "boolean",
        label: "Hide Menubar",
        description: "Hide the viewer's menu bar when the PDF is opened for a cleaner interface. Use this for kiosk mode, presentations, or embedded PDFs where you want to minimize UI elements.",
        optional: true,
      },
      hideWindowUi: {
        type: "boolean",
        label: "Hide Window UI",
        description: "Hide user interface elements like scroll bars and navigation controls when the PDF opens. Use this for presentation mode, digital signage, or embedded PDFs where you want the most minimal interface possible.",
        optional: true,
      },
      fitWindow: {
        type: "boolean",
        label: "Fit Window",
        description: "Resize the PDF viewer window to fit the size of the first displayed page when opened. Use this to ensure the PDF opens at an appropriate size rather than filling the entire screen. Particularly useful for small documents, forms, or certificates.",
        optional: true,
      },
      centerWindow: {
        type: "boolean",
        label: "Center Window",
        description: "Position the PDF viewer window in the center of the screen when opened. Use this with window resizing to create a professional, centered display for forms, certificates, or small documents.",
        optional: true,
      },
      displayTitle: {
        type: "boolean",
        label: "Display Title",
        description: "Display the title of the HTML document in the PDF viewer's title bar instead of the filename. Use this to show more descriptive titles when PDFs are opened, particularly useful when the filename is cryptic or auto-generated.",
        optional: true,
      },
      rightToLeft: {
        type: "boolean",
        label: "Right To Left",
        description: "Set the predominant reading order for text to right-to-left. This option has no direct effect on the document's contents or page numbering but can be used to determine the relative positioning of pages when displayed side by side or printed n-up.",
        optional: true,
      },
      dataString: {
        type: "string",
        label: "Data String",
        description: "Set the input data for template rendering. The data format can be JSON, XML, YAML, or CSV. Use Jinja2 syntax in your HTML template to render the data (e.g., `{{recipient}}`).",
        optional: true,
      },
      dataFormat: {
        type: "string",
        label: "Data Format",
        description: "Specify the input data format. Use `auto` for automatic detection or explicitly set to `json`, `xml`, `yaml`, or `csv` when format is known.",
        options: [
          "auto",
          "json",
          "xml",
          "yaml",
          "csv",
        ],
        optional: true,
      },
      dataIgnoreUndefined: {
        type: "boolean",
        label: "Data Ignore Undefined",
        description: "Ignore undefined variables in the HTML template. The default mode is strict so any undefined variable causes the conversion to fail. You can use `{% if variable is defined %}` to check if the variable is defined.",
        optional: true,
      },
      dataAutoEscape: {
        type: "boolean",
        label: "Data Auto Escape",
        description: "Auto escape HTML symbols in the input data before placing them into the output. This prevents XSS vulnerabilities and ensures special characters like `<`, `>`, and `&` are properly escaped.",
        optional: true,
      },
      dataTrimBlocks: {
        type: "boolean",
        label: "Data Trim Blocks",
        description: "Auto trim whitespace around each template command block.",
        optional: true,
      },
      dataOptions: {
        type: "string",
        label: "Data Options",
        description: "Set the advanced data options as comma-separated `key=value` pairs: `csv_delimiter` - The CSV data delimiter (default is `,`), `xml_remove_root` - Remove the root XML element from the input data, `data_root` - The name of the root element inserted into the input data (default is `data`).",
        optional: true,
      },
      debugLog: {
        type: "boolean",
        label: "Debug Log",
        description: "Turn on debug logging to troubleshoot conversion issues. Details about the conversion process, including resource loading, rendering steps, and error messages are stored in the debug log. The URL of the log is returned in the response.",
        optional: true,
      },
      tag: {
        type: "string",
        label: "Tag",
        description: "Tag the conversion with a custom value for tracking and analytics. Use this to categorize conversions by customer ID, document type, or business unit. The tag appears in conversion statistics. Maximum 32 characters.",
        optional: true,
      },
      httpProxy: {
        type: "string",
        label: "HTTP Proxy",
        description: "A proxy server used by the conversion process for accessing the source URLs with HTTP scheme. This can help circumvent regional restrictions or provide limited access to your intranet. Format: `DOMAIN_OR_IP_ADDRESS:PORT`.",
        optional: true,
      },
      httpsProxy: {
        type: "string",
        label: "HTTPS Proxy",
        description: "A proxy server used by the conversion process for accessing the source URLs with HTTPS scheme. This can help circumvent regional restrictions or provide limited access to your intranet. Format: `DOMAIN_OR_IP_ADDRESS:PORT`.",
        optional: true,
      },
      layoutDpi: {
        type: "integer",
        label: "Layout DPI",
        description: "Set the internal DPI resolution used for positioning of PDF contents. It can help in situations where there are small inaccuracies in the PDF. Use values that are a multiple of 72, such as 288 or 360. Accepted range is 72-600, default is 300.",
        optional: true,
      },
      mainDocumentCssAnnotation: {
        type: "boolean",
        label: "Main Document CSS Annotation",
        description: "Add special CSS classes to the main document's body element. This allows applying custom styling based on these classes: `pdfcrowd-page-X` (current page number), `pdfcrowd-page-odd`, and `pdfcrowd-page-even`.",
        optional: true,
      },
      headerFooterCssAnnotation: {
        type: "boolean",
        label: "Header Footer CSS Annotation",
        description: "Add special CSS classes to the header/footer's body element. This allows applying custom styling based on these classes: `pdfcrowd-page-X`, `pdfcrowd-page-count-X`, `pdfcrowd-page-first`, `pdfcrowd-page-last`, `pdfcrowd-page-odd`, and `pdfcrowd-page-even`.",
        optional: true,
      },
      conversionConfig: {
        type: "string",
        label: "Conversion Config",
        description: "Configure conversion via JSON. The configuration defines various page settings for individual PDF pages or ranges of pages, giving control over each page's size, header, footer, margins, and orientation. If a JSON configuration is provided, the settings in the JSON will take precedence over the global options.",
        optional: true,
      },
      converterVersion: {
        type: "string",
        label: "Converter Version",
        description: "Set the converter version. Different versions may produce different output results due to algorithm changes and improvements. Use this to ensure consistent output or to access version-specific features.",
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

    // Basic conversion options (camelCase prop names)
    const basicOptions = [
      "pageSize",
      "pageWidth",
      "pageHeight",
      "orientation",
      "marginTop",
      "marginRight",
      "marginBottom",
      "marginLeft",
      "contentViewportWidth",
      "customCss",
      "customJavascript",
      "elementToConvert",
    ];

    // Expert conversion options (camelCase prop names)
    const expertOptions = [
      "noMargins",
      "printPageRange",
      "contentViewportHeight",
      "contentFitMode",
      "removeBlankPages",
      "headerUrl",
      "headerHtml",
      "headerHeight",
      "zipHeaderFilename",
      "footerUrl",
      "footerHtml",
      "footerHeight",
      "zipFooterFilename",
      "noHeaderFooterHorizontalMargins",
      "excludeHeaderOnPages",
      "excludeFooterOnPages",
      "headerFooterScaleFactor",
      "pageNumberingOffset",
      "pageWatermarkUrl",
      "multipageWatermarkUrl",
      "pageBackgroundUrl",
      "multipageBackgroundUrl",
      "pageBackgroundColor",
      "usePrintMedia",
      "noBackground",
      "disableJavascript",
      "disableImageLoading",
      "disableRemoteFonts",
      "loadIframes",
      "blockAds",
      "defaultEncoding",
      "locale",
      "httpAuthUserName",
      "httpAuthPassword",
      "cookies",
      "verifySslCertificates",
      "failOnMainUrlError",
      "failOnAnyUrlError",
      "cssPageRuleMode",
      "onLoadJavascript",
      "customHttpHeader",
      "javascriptDelay",
      "elementToConvertMode",
      "waitForElement",
      "autoDetectElementToConvert",
      "readabilityEnhancements",
      "scaleFactor",
      "jpegQuality",
      "convertImagesToJpeg",
      "imageDpi",
      "enablePdfForms",
      "linearize",
      "encrypt",
      "userPassword",
      "ownerPassword",
      "noPrint",
      "noModify",
      "noCopy",
      "title",
      "subject",
      "author",
      "keywords",
      "extractMetaTags",
      "pageLayout",
      "pageMode",
      "initialZoomType",
      "initialPage",
      "initialZoom",
      "hideToolbar",
      "hideMenubar",
      "hideWindowUi",
      "fitWindow",
      "centerWindow",
      "displayTitle",
      "rightToLeft",
      "dataString",
      "dataFormat",
      "dataIgnoreUndefined",
      "dataAutoEscape",
      "dataTrimBlocks",
      "dataOptions",
      "debugLog",
      "tag",
      "httpProxy",
      "httpsProxy",
      "layoutDpi",
      "mainDocumentCssAnnotation",
      "headerFooterCssAnnotation",
      "conversionConfig",
      "converterVersion",
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
    let filename = path.basename(this.outputFilename || "document.pdf").trim();
    if (!filename || filename === "." || filename === "..") {
      filename = "document.pdf";
    }
    const pdfBuffer = Buffer.from(result.data);
    const tmpPath = path.join("/tmp", filename);

    // Try to save to /tmp for same-step usage, but don't fail if it errors
    let savedFilePath = null;
    try {
      await fs.promises.writeFile(tmpPath, pdfBuffer);
      savedFilePath = tmpPath;
    } catch (err) {
      // File write failed (disk space, permissions, etc.) - fileData is still available
      console.error(`Could not save to ${tmpPath}: ${err.message}. Use fileData instead.`, err);
    }

    $.export("$summary", `Successfully converted to PDF: ${filename}`);

    // Pipedream has a 6MB payload limit. Base64 adds ~33% overhead,
    // so skip fileData for files > 4MB to avoid hitting the limit.
    const MAX_BASE64_SIZE = 4 * 1024 * 1024; // 4MB
    const includeFileData = pdfBuffer.length <= MAX_BASE64_SIZE;

    // Return both filePath (for same-step usage) and fileData (base64 for cross-step usage)
    // Note: In Pipedream, files in /tmp may not persist between workflow steps.
    // Use fileData with Buffer.from(fileData, "base64") in subsequent steps.
    return {
      filePath: savedFilePath,
      filename,
      fileData: includeFileData
        ? pdfBuffer.toString("base64")
        : null,
      fileDataSkipped: !includeFileData,
      fileSize: pdfBuffer.length,
      jobId: result.headers?.jobId ?? "",
      pageCount: result.headers?.pageCount ?? 0,
      outputSize: result.headers?.outputSize ?? 0,
      consumedCredits: result.headers?.consumedCredits ?? 0,
      remainingCredits: result.headers?.remainingCredits ?? 0,
      debugLogUrl: result.headers?.debugLogUrl ?? "",
    };
  },
};
