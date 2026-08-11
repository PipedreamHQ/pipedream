import fs from "fs";
import path from "path";
import { pipeline } from "node:stream/promises";
import {
  ExtractElementType,
  ExtractPDFJob,
  ExtractPDFParams,
  ExtractPDFResult,
  MimeType,
  PDFServices,
  ServicePrincipalCredentials,
} from "@adobe/pdfservices-node-sdk";
import {
  ConfigurationError, getFileStream,
} from "@pipedream/platform";

export default {
  type: "app",
  app: "adobe_pdf_services",
  propDefinitions: {
    filePath: {
      type: "string",
      label: "File Path",
      description: "The PDF to extract from. Either a file already saved to the `/tmp` directory (e.g. `/tmp/example.pdf`) [see the documentation](https://pipedream.com/docs/workflows/steps/code/nodejs/working-with-files/#the-tmp-directory), or a public URL to the PDF (e.g. `https://example.com/example.pdf`) — the URL is downloaded automatically before extraction.",
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
        throw new ConfigurationError("Filename is required");
      }
      if (path.basename(filename) !== filename) {
        throw new ConfigurationError("Filename must be a plain file name with no path separators or \"..\" segments");
      }

      const pdfServices = this.getPDFServices();

      const readStream = await getFileStream(filePath);
      let inputAsset;
      try {
        inputAsset = await pdfServices.upload({
          readStream,
          mimeType: MimeType.PDF,
        });
      } catch (uploadErr) {
        readStream.destroy();
        throw uploadErr;
      }

      const outputPath = `/tmp/${filename.endsWith(".zip")
        ? filename
        : `${filename}.zip`}`;

      try {
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

        await pipeline(streamAsset.readStream, fs.createWriteStream(outputPath));
      } finally {
        try {
          await pdfServices.deleteAsset({
            asset: inputAsset,
          });
        } catch (cleanupErr) {
          console.error("Failed to delete uploaded Adobe PDF Services input asset during cleanup:", cleanupErr);
        }
      }

      return outputPath;
    },
  },
};
