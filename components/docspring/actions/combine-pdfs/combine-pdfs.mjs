import { ConfigurationError } from "@pipedream/platform";
import docspring from "../../docspring.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "docspring-combine-pdfs",
  name: "Combine PDFs",
  description: "Merge PDFs into one combined PDF, in order: submissions' PDFs, other combined PDFs, templates' PDFs, custom files and PDFs at URLs."
    + " Returns the combined PDF, with its links in `files.pdf`."
    + " Use **Find Submissions** or **Generate PDF** for submission IDs and **Find Templates** for template IDs."
    + " [See the documentation](https://docspring.com/docs/api/#tag/combined-pdfs/post/combined_pdfs)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    docspring,
    sourcePdfs: {
      type: "string[]",
      label: "Source PDFs",
      description: "The PDFs to merge, in order. Each item is a JSON object with a `type` of `submission`, `combined_pdf`, `template`, `custom_file` or `url`,"
        + " and an `id` (or a `url` for `url`). Template sources also take `template_version` and `processed`."
        + " e.g. `{\"type\": \"submission\", \"id\": \"sub_1234567890abcdef01\"}`, `{\"type\": \"url\", \"url\": \"https://example.com/terms.pdf\"}`"
        + " or `{\"type\": \"template\", \"id\": \"tpl_1234567890abcdef01\", \"template_version\": \"1.2.0\"}`. One item can also be a JSON array of them.",
    },
    metadata: {
      propDefinition: [
        docspring,
        "metadata",
      ],
    },
    password: {
      propDefinition: [
        docspring,
        "password",
      ],
    },
    expiresIn: {
      propDefinition: [
        docspring,
        "expiresIn",
      ],
      description: "Seconds after the PDF is made until the combined PDF is deleted, up to 10 years (`315360000`), e.g. `86400` for a day."
        + " Leave blank to keep it until you expire it.",
    },
    wait: {
      propDefinition: [
        docspring,
        "wait",
      ],
      description: "`true` (the default) waits until the combined PDF is ready. `false` returns at once with a pending combined PDF:"
        + " get it later with **Get Combined PDF** or the **New Event (Instant)** trigger. e.g. `true`.",
    },
  },
  async run({ $ }) {
    const sources = utils.parseObjectArray(this.sourcePdfs, "Source PDFs");
    if (!sources) {
      throw new ConfigurationError("Add at least one source PDF");
    }
    const wait = utils.toBoolean(this.wait, "Wait for the PDF") ?? true;
    const combinedPdf = await this.docspring.createCombinedPdf({
      $,
      params: {
        wait,
      },
      data: utils.compact({
        source_pdfs: sources.map(utils.toSourcePdf),
        metadata: utils.parseObject(this.metadata, "Metadata"),
        password: this.password,
        expires_in: utils.toInteger(this.expiresIn, "Expires In"),
      }),
    });
    const failure = utils.failureMessage("combined_pdf", combinedPdf);
    if (failure) {
      throw new Error(failure);
    }
    $.export("$summary", `Combined ${sources.length} PDF(s) into combined PDF ${combinedPdf.id} (${combinedPdf.state})`);
    return combinedPdf;
  },
};
