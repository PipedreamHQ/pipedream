const quickbooks = require("../../quickbooks.app");
const fs = require("fs");
const { promisify } = require("util");
const stream = require("stream");

module.exports = {
  name: "Download PDF",
  description: "Download an invoice, bill, purchase order or other QuickBooks entity as a PDF and save it in [Pipedream's temporary file system](https://pipedream.com/docs/workflows/steps/code/nodejs/working-with-files/#the-tmp-directory) for use in a later step.",
  key: "quickbooks-download-pdf",
  version: "0.0.1",
  type: "action",
  props: {
    quickbooks,
    entity: {
      type: "string",
      label: "Document Type",
      description: null,
      options: [
        "CreditMemo",
        "Estimate",
        "Invoice",
        "Payment",
        "PurchaseOrder",
        "RefundReceipt",
        "SalesReceipt",
      ],
    },
    id: {
      type: "string",
      label: "Record ID",
      description: "Use the 'Id' property of the record's JSON object or open the record for editing in Quickbooks Online to find its ID in the URL after 'txnId=', e.g. 'https://app.qbo.intuit.com/app/invoice?txnId=22743'",
    },
    fileName: {
      type: "string",
      label: "File Name (Optional)",
      description: "The name to give the PDF when it is stored in the /tmp directory, e.g. `myFile.pdf`. If no file name is provided, the PDF will be named using the record ID, e.g. '22743.pdf'",
      optional: true,
    },
  },
  methods: {
    async downloadPDF($, entity, id, fileName) {
      const file = await this.quickbooks.getPDF($, entity, id);

      const filePath = "/tmp/" + fileName;
      const pipeline = promisify(stream.pipeline);
      await pipeline(
        file,
        fs.createWriteStream(filePath),
      );
      return filePath;
    },
  },
  async run({ $ }) {
    const fileName = this.fileName || this.id;
    const fileNameWithExtension = fileName.endsWith(".pdf")
      ? fileName
      : fileName + ".pdf";

    const filePath = await this.downloadPDF($, this.entity, this.id, fileNameWithExtension);
    $.export("file_path", filePath);
    $.export("file_name", fileNameWithExtension);
    $.export("$summary", `Successfully downloaded file: ${fileNameWithExtension}`);
  },
};
