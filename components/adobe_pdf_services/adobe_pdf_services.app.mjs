import PDFServicesSdk from "@adobe/pdfservices-node-sdk";

export default {
  type: "app",
  app: "adobe_pdf_services",
  propDefinitions: {
    filePath: {
      type: "string",
      label: "File Path",
      description: "The path to the pdf file saved to the `/tmp` directory (e.g. `/tmp/example.pdf`). [See the documentation](https://pipedream.com/docs/workflows/steps/code/nodejs/working-with-files/#the-tmp-directory).",
    },
    filename: {
      type: "string",
      label: "File Name",
      description: "Name of the new file to be placed in `/tmp` directory",
    },
  },
  methods: {
    getCredentials() {
      return PDFServicesSdk.Credentials
        .servicePrincipalCredentialsBuilder()
        .withClientId(this.$auth.client_id)
        .withClientSecret(this.$auth.client_secret)
        .build();
    },
    getExecutionContext() {
      const credentials = this.getCredentials();
      return PDFServicesSdk.ExecutionContext.create(credentials);
    },
    buildExtractPDFOptionsText() {
      return new PDFServicesSdk.ExtractPDF.options.ExtractPdfOptions.Builder()
        .addElementsToExtract(PDFServicesSdk.ExtractPDF.options.ExtractElementType.TEXT)
        .build();
    },
    buildExtractPDFOptionsTextAndTables() {
      return new PDFServicesSdk.ExtractPDF.options.ExtractPdfOptions.Builder()
        .addElementsToExtract(PDFServicesSdk.ExtractPDF.options.ExtractElementType.TEXT,
          PDFServicesSdk.ExtractPDF.options.ExtractElementType.TABLES)
        .build();
    },
    async extractPDF(filePath, type = "text", filename) {
      const executionContext = this.getExecutionContext();
      const options = type === "text"
        ? this.buildExtractPDFOptionsText()
        : this.buildExtractPDFOptionsTextAndTables();
      const extractPDFOperation = PDFServicesSdk.ExtractPDF.Operation.createNew(),
        input = PDFServicesSdk.FileRef.createFromLocalFile(
          filePath,
          PDFServicesSdk.ExtractPDF.SupportedSourceFormat.pdf,
        );
      extractPDFOperation.setInput(input);
      extractPDFOperation.setOptions(options);
      await extractPDFOperation.execute(executionContext).then((result) => result.saveAsFile(`/tmp/${filename}`));
    },
  },
};
