import puppeteer from "../../puppeteer.app.mjs";
import constants from "../../common/constants.mjs";
import common from "../common/common.mjs";
import fs from "fs";

export default {
  ...common,
  key: "puppeteer-get-pdf",
  name: "Get PDF",
  description:
    "Generate a PDF of a page using Puppeteer. [See the documentation](https://pptr.dev/api/puppeteer.page.pdf)",
  version: "1.0.2",
  type: "action",
  props: {
    puppeteer,
    ...common.props,
    downloadPath: {
      type: "string",
      label: "Download Path",
      description:
        "Download the PDF to the `/tmp` directory with the specified filename",
      optional: true,
    },
    displayHeaderFooter: {
      type: "boolean",
      label: "Display Header Footer",
      description: "Whether to show the header and footer.",
      optional: true,
      default: false,
    },
    footerTemplate: {
      type: "string",
      label: "Footer Template",
      description: "HTML template for the print footer.",
      optional: true,
    },
    format: {
      type: "string",
      label: "Format",
      description: "The paper format of the PDF",
      options: constants.PAPER_FORMAT,
      optional: true,
    },
    headerTemplate: {
      type: "string",
      label: "Header Template",
      description:
        "HTML template for the print header. Should be valid HTML with the following classes used to inject values into them: `date` - formatted print date, `title` - document title, `url` - document location, `pageNumber` - current page number, `totalPages` - total pages in the document.",
      optional: true,
    },
    height: {
      type: "string",
      label: "Height",
      description:
        "Sets the height of paper. You can pass in a number or a string with a unit.",
      optional: true,
    },
    landscape: {
      type: "boolean",
      label: "Landscape",
      description: "Whether to print in landscape orientation.",
      optional: true,
      default: false,
    },
    marginBottom: {
      type: "string",
      label: "Bottom Margin",
      description: "Margin for the bottom of the page",
      optional: true,
    },
    marginLeft: {
      type: "string",
      label: "Left Margin",
      description: "Margin for the left side of the page",
      optional: true,
    },
    marginRight: {
      type: "string",
      label: "Right Margin",
      description: "Margin for the right side of the page",
      optional: true,
    },
    marginTop: {
      type: "string",
      label: "Top Margin",
      description: "Margin for the top of the page",
      optional: true,
    },
    omitBackground: {
      type: "boolean",
      label: "Omit Background",
      description:
        "Hides default white background and allows generating pdfs with transparency.",
      optional: true,
      default: false,
    },
    pageRanges: {
      type: "string",
      label: "Page Ranges",
      description: "Paper ranges to print, e.g. 1-5, 8, 11-13.",
      optional: true,
    },
    preferCSSPageSize: {
      type: "boolean",
      label: "Prefer CSS Page Size",
      description:
        "Give any CSS @page size declared in the page priority over what is declared in the width or height or format option.",
      optional: true,
      default: false,
    },
    printBackground: {
      type: "boolean",
      label: "Print Background",
      description: "Set to true to print background graphics.",
      optional: true,
      default: false,
    },
    scale: {
      type: "string",
      label: "Scale",
      description:
        "Scales the rendering of the web page. Amount must be between 0.1 and 2.",
      optional: true,
    },
    timeout: {
      type: "integer",
      label: "Timeout",
      description: "Timeout in milliseconds. Pass 0 to disable timeout.",
      optional: true,
      default: 30000,
    },
    width: {
      type: "string",
      label: "Width",
      description:
        "Sets the width of paper. You can pass in a number or a string with a unit.",
      optional: true,
    },
  },
  methods: {
    async downloadToTMP(pdf) {
      const path = this.downloadPath.includes("/tmp")
        ? this.downloadPath
        : `/tmp/${this.downloadPath}`;
      fs.writeFileSync(path, pdf);
      return path;
    },
  },
  async run({ $ }) {
    const options = {
      displayHeaderFooter: this.displayHeaderFooter,
      footerTemplate: this.footerTemplate,
      format: this.format,
      headerTemplate: this.headerTemplate,
      height: this.height,
      landscape: this.landscape,
      margin: {
        bottom: this.marginBottom,
        left: this.marginLeft,
        right: this.marginRight,
        top: this.marginTop,
      },
      omitBackground: this.omitBackground,
      pageRanges: this.pageRanges,
      preferCSSPageSize: this.preferCSSPageSize,
      printBackground: this.printBackground,
      scale: this.scale
        ? parseFloat(this.scale)
        : undefined,
      timeout: this.timeout,
      width: this.width,
    };

    const url = this.normalizeUrl();
    const browser = await this.puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    const pdf = await page.pdf(options);
    await browser.close();

    const filePath =
      pdf && this.downloadPath
        ? await this.downloadToTMP(pdf)
        : undefined;

    if (pdf) {
      $.export("$summary", `Successfully generated PDF from ${url}`);
    }

    return filePath
      ? {
        pdf,
        filePath,
      }
      : pdf;
  },
};
