import servicem8 from "../../servicem8.app.mjs";

const DOCS = "https://developer.servicem8.com/reference/produce_templated_document";

export default {
  key: "servicem8-produce-quote",
  name: "Produce Quote",
  description: `Generate a job quote (PDF, DOCX, or JPG). [See the documentation](${DOCS})`,
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    servicem8,
    jobUuid: {
      type: "string",
      label: "Job",
      useQuery: true,
      async options({
        $, prevContext, query,
      }) {
        return this.servicem8._uuidOptionsForResource({
          $: $ ?? this,
          resource: "job",
          prevContext,
          query,
        });
      },
      description: "Job to produce the quote for (search or paste UUID).",
    },
    outputFormat: {
      type: "string",
      label: "Output Format",
      description: "File format for the produced document",
      options: [
        {
          label: "PDF",
          value: "pdf",
        },
        {
          label: "DOCX",
          value: "docx",
        },
        {
          label: "JPG",
          value: "jpg",
        },
      ],
    },
    templateUuid: {
      type: "string",
      label: "Template UUID",
      description:
        "Optional. If you have multiple template designs, specify the template UUID. Omit to use the default Quote template.",
      optional: true,
    },
    storeToDiary: {
      type: "boolean",
      label: "Store to Job Diary",
      description: "Attach the produced document to the job diary",
      optional: true,
    },
  },
  async run({ $ }) {
    const res = await this.servicem8.produceTemplatedDocument({
      $,
      objectType: "Job",
      objectUUID: this.jobUuid,
      templateType: "Quote",
      templateUUID: this.templateUuid || undefined,
      outputFormat: this.outputFormat,
      storeToDiary: this.storeToDiary,
    });
    const contentType = res.headers["content-type"] || "";
    if (contentType.includes("application/json")) {
      const err = typeof res.data === "string"
        ? JSON.parse(res.data)
        : JSON.parse(Buffer.from(res.data).toString("utf8"));
      throw new Error(err.message || JSON.stringify(err));
    }
    const buffer = Buffer.from(res.data, "binary");
    const respContentType =
      res.headers["content-type"] ||
      (this.outputFormat === "pdf"
        ? "application/pdf"
        : this.outputFormat === "docx"
          ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          : "image/jpeg");
    $.export("$summary", `Produced Quote for job ${this.jobUuid}`);
    return {
      file: buffer.toString("base64"),
      contentType: respContentType,
      filename: `quote.${this.outputFormat}`,
      jobUuid: this.jobUuid,
    };
  },
};
