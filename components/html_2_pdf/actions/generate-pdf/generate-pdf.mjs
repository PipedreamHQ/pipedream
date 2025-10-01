import { ConfigurationError } from "@pipedream/platform";
import fs from "fs";
import {
  PAGE_SIZE_OPTIONS, UNIT_OPTIONS,
} from "../../common/constants.mjs";
import html2Pdf from "../../html_2_pdf.app.mjs";

export default {
  key: "html_2_pdf-generate-pdf",
  name: "Generate PDF",
  description: "Creates a PDF from a URL or HTML string. [See the documentation](https://www.html2pdf.co.uk/api-documentation)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    html2Pdf,
    url: {
      type: "string",
      label: "URL",
      description: "The URL you want to convert to PDF.",
      optional: true,
    },
    html: {
      type: "string",
      label: "HTML",
      description: "The HTML you want to convert to PDF.",
      optional: true,
    },
    header: {
      type: "string",
      label: "Header",
      description: "Header in HTML format.",
      optional: true,
    },
    footer: {
      type: "string",
      label: "Footer",
      description: "Footer in HTML format.",
      optional: true,
    },
    pageOffset: {
      type: "integer",
      label: "Page Offset",
      description: "Number to offset your page number",
      optional: true,
    },
    pageSize: {
      type: "string",
      label: "Page Size",
      description: "The standard page formats.",
      optional: true,
      options: PAGE_SIZE_OPTIONS,
    },
    orientation: {
      type: "string",
      label: "Orientation",
      description: "The page orientation.",
      optional: true,
      options: [
        "portrait",
        "landscape",
      ],
    },
    width: {
      type: "string",
      label: "Width",
      description: "Custom width (overrides 'Page Size').",
      optional: true,
    },
    height: {
      type: "string",
      label: "Height",
      description: "Custom height (overrides 'Page Size').",
      optional: true,
    },
    top: {
      type: "string",
      label: "Top Margin",
      description: "You need one if you want to display a header.",
      optional: true,
    },
    bottom: {
      type: "string",
      label: "Bottom Margin",
      description: "You need one if you want to display a footer.",
      optional: true,
    },
    left: {
      type: "string",
      label: "Left",
      description: "Left margin.",
      optional: true,
    },
    right: {
      type: "string",
      label: "Right",
      description: "Right margin.",
      optional: true,
    },
    unit: {
      type: "string",
      label: "Unit",
      description: "Unit for the custom width, height and margins.",
      optional: true,
      options: UNIT_OPTIONS,
    },
    cssMediaType: {
      type: "string",
      label: "CSS Media Type",
      description: "The layout CSS media type.",
      options: [
        "print",
        "screen",
      ],
      optional: true,
    },
    optimizeLayout: {
      type: "boolean",
      label: "Optimize Layout",
      description: "Set this to **true** if you want us to auto-optimize your layout. This helps static items on your page to only show up once, instead of on every page.",
      optional: true,
    },
    lazyLoad: {
      type: "boolean",
      label: "Lazy Load",
      description: "Set this to **true** if you want our software to wait for content to lazy load.",
      optional: true,
    },
    waitTime: {
      type: "integer",
      label: "Wait Time",
      description: "**Time in milliseconds** that you want our software to wait after the page is loaded. You typically use this when you have long running JavaScript for graphs and tables.",
      optional: true,
    },
    css: {
      type: "string",
      label: "CSS",
      description: "Use custom CSS to overwrite the default styles of your page.",
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  async run({ $ }) {
    if ((!this.url && !this.html) || (this.url && this.html)) {
      throw new ConfigurationError("You must provide either URL or HTML.");
    }
    const response = await this.html2Pdf.createPdf({
      $,
      responseType: "arraybuffer",
      params: {
        url: this.url,
        html: this.html,
        header: this.header,
        footer: this.footer,
        page_offset: this.pageOffset,
        page_size: this.pageSize,
        orientation: this.orientation,
        width: this.width,
        height: this.height,
        top: this.top,
        bottom: this.bottom,
        left: this.left,
        right: this.right,
        unit: this.unit,
        css_media_type: this.cssMediaType,
        optimize_layout: this.optimizeLayout,
        lazy_load: this.lazyLoad,
        wait_time: this.waitTime,
        css: this.css,
      },
    });

    const filePath = `/tmp/${Date.now()}.pdf`;
    fs.writeFileSync(filePath, response);

    $.export("$summary", "Generated PDF is saved at");
    $.export("file_path", filePath);
    return filePath;
  },
};
