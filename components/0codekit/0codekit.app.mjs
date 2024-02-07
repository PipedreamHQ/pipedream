import { axios } from "@pipedream/platform";
import Jimp from "jimp";
import jsQR from "jsqr";
import {
  PDFDocument, PDFRawStream, PDFDict, PDFName,
} from "pdf-lib";

export default {
  type: "app",
  app: "qr_pdf_app",
  propDefinitions: {
    imageUrl: {
      type: "string",
      label: "Image URL",
      description: "The URL of the image containing the QR code to be read",
    },
    pdfUrl: {
      type: "string",
      label: "PDF URL",
      description: "The URL of the PDF to be compressed",
    },
    quality: {
      type: "integer",
      label: "Compression Quality",
      description: "The compression level for the PDF",
      optional: true,
      default: 75,
    },
  },
  methods: {
    async readQrCode({ imageUrl }) {
      const image = await Jimp.read(imageUrl);
      const {
        data, width, height,
      } = image.bitmap;
      const qrCode = jsQR(data, width, height);
      return qrCode
        ? qrCode.data
        : null;
    },
    async compressPdf({
      pdfUrl, quality,
    }) {
      const existingPdfBytes = await axios(this, {
        method: "GET",
        url: pdfUrl,
        responseType: "arraybuffer",
      });

      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const pages = pdfDoc.getPages();

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const contentStream = page.node.Contents;
        const dict = contentStream.dict;

        const newDict = PDFDict.withContext(dict.context);
        dict.forEach((key, value) => {
          if (key !== PDFName.of("Length")) {
            newDict.set(PDFName.of(key), value);
          }
        });

        const rawStream = PDFRawStream.of(newDict, contentStream.encodedBytes);
        rawStream.compressTo = quality;
        page.node.set(PDFName.of("Contents"), rawStream);
      }

      const compressedPdfBytes = await pdfDoc.save({
        useObjectStreams: false,
      });
      return compressedPdfBytes;
    },
  },
};
