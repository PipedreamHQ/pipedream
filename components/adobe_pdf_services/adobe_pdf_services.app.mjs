import fs from "fs";
import {
  ExtractElementType,
  ExtractPDFJob,
  ExtractPDFParams,
  ExtractPDFResult,
  MimeType,
  PDFServices,
  ServicePrincipalCredentials,
} from "@adobe/pdfservices-node-sdk";

export default {
  type: "app",
  app: "adobe_pdf_services",
  propDefinitions: {
    filePath: {
      type: "string",
      label: "File Path",
      description: "The path to the pdf file saved to the `/tmp` directory (e.g. `/tmp/example.pdf`). [See the documentation](https://pipedream.com/docs/workflows/steps/code/nodejs/working-with-files/#the-tmp-directory).",
      format: "file-ref",
    },
    filename: {
      type: "string",
      label: "File Name",
      description: "Name of the new file to be placed in `/tmp` directory",
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  methods: {
    getCredentials() {
      return new ServicePrincipalCredentials({
        clientId: this.$auth.client_id,
        clientSecret: this.$auth.client_secret,
      });
    },
    getPDFServices() {
      const credentials = this.getCredentials();
      return new PDFServices({
        credentials,
      });
    },
    buildExtractPDFParamsText() {
      return new ExtractPDFParams({
        elementsToExtract: [
          ExtractElementType.TEXT,
        ],
      });
    },
    buildExtractPDFParamsTextAndTables() {
      return new ExtractPDFParams({
        elementsToExtract: [
          ExtractElementType.TEXT,
          ExtractElementType.TABLES,
        ],
      });
    },
    async extractPDF(filePath, type = "text", filename) {
      if (!filename) {
        throw new Error("filename is required");
      }

      const pdfServices = this.getPDFServices();

      const readStream = fs.createReadStream(filePath);
      const inputAsset = await pdfServices.upload({
        readStream,
        mimeType: MimeType.PDF,
      });

      const params = type === "text"
        ? this.buildExtractPDFParamsText()
        : this.buildExtractPDFParamsTextAndTables();
      const job = new ExtractPDFJob({
        inputAsset,
        params,
      });

      const pollingURL = await pdfServices.submit({
        job,
      });
      const pdfServicesResponse = await pdfServices.getJobResult({
        pollingURL,
        resultType: ExtractPDFResult,
      });

      const resultAsset = pdfServicesResponse.result.resource;
      const streamAsset = await pdfServices.getContent({
        asset: resultAsset,
      });

      const outputPath = `/tmp/${filename.endsWith(".zip")
        ? filename
        : `${filename}.zip`}`;
      await new Promise((resolve, reject) => {
        const writeStream = fs.createWriteStream(outputPath);
        streamAsset.readStream
          .pipe(writeStream)
          .on("finish", resolve)
          .on("error", reject);
      });

      await pdfServices.deleteAsset({
        asset: inputAsset,
      });

      return outputPath;
    },
  },
};
