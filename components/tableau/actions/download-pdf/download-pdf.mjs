import app from "../../tableau.app.mjs";
import fs from "fs";
import path from "path";

export default {
  key: "tableau-download-pdf",
  name: "Download PDF",
  description: "Downloads images of the sheets of a workbook as a PDF file. [See the documentation](https://help.tableau.com/current/api/rest_api/en-us/REST/rest_api_ref_workbooks_and_views.htm#download_workbook_pdf)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    siteId: {
      propDefinition: [
        app,
        "siteId",
      ],
    },
    workbookId: {
      propDefinition: [
        app,
        "workbookId",
        ({ siteId }) => ({
          siteId,
        }),
      ],
    },
    maxAge: {
      type: "integer",
      label: "Max Age",
      description: "The maximum number of minutes a workbook PDF will be cached before being refreshed. Minimum interval is one minute",
      optional: true,
      min: 1,
    },
    orientation: {
      type: "string",
      label: "Page Orientation",
      description: "The orientation of the pages in the PDF file produced",
      options: [
        "Portrait",
        "Landscape",
      ],
      default: "Portrait",
      optional: true,
    },
    pageType: {
      type: "string",
      label: "Page Type",
      description: "The type of page, which determines the page dimensions of the PDF file returned",
      options: [
        "A3",
        "A4",
        "A5",
        "B5",
        "Executive",
        "Folio",
        "Ledger",
        "Legal",
        "Letter",
        "Note",
        "Quarto",
        "Tabloid",
      ],
      default: "Legal",
      optional: true,
    },
    vizHeight: {
      type: "integer",
      label: "Viz Height",
      description: "The height of the rendered PDF image in pixels that, along with `Viz Width`, determines its resolution and aspect ratio",
      optional: true,
    },
    vizWidth: {
      type: "integer",
      label: "Viz Width",
      description: "The width of the rendered PDF image in pixels that, along with `Viz Height`, determines its resolution and aspect ratio",
      optional: true,
    },
    outputFilename: {
      type: "string",
      label: "Output Filename",
      description: "The filename for the downloaded PDF file, which will be saved to the `/tmp` folder",
      default: "workbook.pdf",
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  async run({ $ }) {
    const {
      siteId,
      workbookId,
      maxAge,
      orientation,
      pageType,
      vizHeight,
      vizWidth,
      outputFilename,
    } = this;

    const response = await this.app.downloadWorkbookPdf({
      $,
      siteId,
      workbookId,
      params: {
        "max-age-minutes": maxAge,
        orientation,
        "page-type": pageType,
        "viz-height": vizHeight,
        "viz-width": vizWidth,
      },
      responseType: "arraybuffer",
    });

    // Write the PDF to the /tmp folder
    const filename = outputFilename || "workbook.pdf";
    const filePath = path.join("/tmp", filename);

    await fs.promises.writeFile(filePath, Buffer.from(response));

    $.export("$summary", `Successfully downloaded workbook PDF to \`${filePath}\``);
    return {
      filePath,
      fileContent: response,
    };
  },
};
