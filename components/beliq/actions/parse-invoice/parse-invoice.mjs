import beliq from "../../beliq.app.mjs";
import { resolveDocument } from "../../common/io.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "beliq-parse-invoice",
  name: "Parse Invoice",
  description: "Read an XML or PDF e-invoice and return its content as a structured JSON invoice object: number, dates, seller, buyer, lines, VAT breakdown and totals. Use it to move a received invoice into a spreadsheet, database or accounting step. Takes pasted XML or a file, e.g. an uploaded Factur-X PDF or the `path` that **Convert Invoice** returns. Parsing does not check the rules; use **Validate Invoice** for that. Uses one document of quota. [See the documentation](https://docs.beliq.eu/api-reference/parse/)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    beliq,
    inputSource: {
      propDefinition: [
        beliq,
        "inputSource",
      ],
    },
    documentText: {
      propDefinition: [
        beliq,
        "documentText",
      ],
    },
    filePath: {
      propDefinition: [
        beliq,
        "filePath",
      ],
    },
    contentType: {
      propDefinition: [
        beliq,
        "contentType",
      ],
    },
    format: {
      propDefinition: [
        beliq,
        "parseFormat",
      ],
    },
    advanced: {
      propDefinition: [
        beliq,
        "advanced",
      ],
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
    },
  },
  async run({ $ }) {
    const {
      bytes, contentType,
    } = await resolveDocument(this);
    const result = await this.beliq.parseInvoice({
      document: bytes,
      format: this.format,
      contentType,
      advanced: parseObject(this.advanced, "Advanced (JSON)"),
    });
    const number = result?.invoice?.number;
    const format = result?.format
      ? `${result.format.toUpperCase()} `
      : "";
    $.export("$summary", number
      ? `Parsed ${format}invoice ${number}`
      : `Parsed the ${format}invoice document`);
    return result;
  },
};
