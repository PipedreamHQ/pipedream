import FormData from "form-data";
import { getFileStreamAndMetadata } from "@pipedream/platform";
import app from "../../onlinecheckwriter.app.mjs";

export default {
  key: "onlinecheckwriter-mail-pdf-document",
  name: "Mail PDF Document",
  description: "Mails a PDF document to a destination. [See the documentation](https://apiv3.onlinecheckwriter.com/#878daf05-e36e-44a2-bce8-15f24d72f82e).",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    documentTitle: {
      type: "string",
      label: "Document Title",
      description: "The title of the document.",
      optional: true,
    },
    filePath: {
      type: "string",
      label: "File Path or URL",
      description: "The PDF file to upload. Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.pdf`)",
    },
    shippingTypeId: {
      optional: false,
      propDefinition: [
        app,
        "shippingTypeId",
      ],
    },
    senderName: {
      type: "string",
      label: "Sender Name",
      description: "The name of the sender.",
      optional: true,
    },
    senderCompany: {
      type: "string",
      label: "Sender Company",
      description: "The company of the sender.",
      optional: true,
    },
    senderAddress1: {
      type: "string",
      label: "Sender Address 1",
      description: "The first line of the sender's address.",
      optional: true,
    },
    senderAddress2: {
      type: "string",
      label: "Sender Address 2",
      description: "The second line of the sender's address.",
      optional: true,
    },
    senderCity: {
      type: "string",
      label: "Sender City",
      description: "The city of the sender.",
      optional: true,
    },
    senderState: {
      type: "string",
      label: "Sender State",
      description: "The state of the sender.",
      optional: true,
    },
    senderZip: {
      type: "string",
      label: "Sender Zip",
      description: "The zip code of the sender.",
      optional: true,
    },
    senderPhone: {
      type: "string",
      label: "Sender Phone",
      description: "The phone number of the sender.",
      optional: true,
    },
    senderEmail: {
      type: "string",
      label: "Sender Email",
      description: "The email address of the sender.",
      optional: true,
    },
    destinationName: {
      type: "string",
      label: "Destination Name",
      description: "The name of the recipient.",
    },
    destinationCompany: {
      type: "string",
      label: "Destination Company",
      description: "The company of the recipient.",
      optional: true,
    },
    destinationAddress1: {
      type: "string",
      label: "Destination Address 1",
      description: "The first line of the recipient's address.",
    },
    destinationAddress2: {
      type: "string",
      label: "Destination Address 2",
      description: "The second line of the recipient's address.",
      optional: true,
    },
    destinationCity: {
      type: "string",
      label: "Destination City",
      description: "The city of the recipient.",
    },
    destinationState: {
      type: "string",
      label: "Destination State",
      description: "The state of the recipient. Use 2 characters Eg. `Tx` instead of `Texas` for example.",
    },
    destinationZip: {
      type: "string",
      label: "Destination Zip",
      description: "The zip code of the recipient.",
    },
    destinationPhone: {
      type: "string",
      label: "Destination Phone",
      description: "The phone number of the recipient.",
      optional: true,
    },
    destinationEmail: {
      type: "string",
      label: "Destination Email",
      description: "The email address of the recipient.",
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  methods: {
    mailPdfDocument(args = {}) {
      return this.app.post({
        path: "/documentmailing/mail",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      mailPdfDocument,
      documentTitle,
      filePath,
      shippingTypeId,
      senderName,
      senderCompany,
      senderAddress1,
      senderAddress2,
      senderCity,
      senderState,
      senderZip,
      senderPhone,
      senderEmail,
      destinationName,
      destinationCompany,
      destinationAddress1,
      destinationAddress2,
      destinationCity,
      destinationState,
      destinationZip,
      destinationPhone,
      destinationEmail,
    } = this;

    const data = new FormData();
    const {
      stream, metadata,
    } = await getFileStreamAndMetadata(filePath);
    data.append("document_details[file]", stream, {
      contentType: metadata.contentType,
      knownLength: metadata.size,
      filename: metadata.name,
    });
    data.append("document_details[title]", documentTitle || "");
    data.append("shipping[shippingTypeId]", shippingTypeId || "");
    data.append("destination[name]", destinationName || "");
    data.append("destination[company]", destinationCompany || "");
    data.append("destination[address1]", destinationAddress1 || "");
    data.append("destination[address2]", destinationAddress2 || "");
    data.append("destination[city]", destinationCity || "");
    data.append("destination[state]", destinationState || "");
    data.append("destination[zip]", destinationZip || "");
    data.append("destination[phone]", destinationPhone || "");
    data.append("destination[email]", destinationEmail || "");
    data.append("from_address[name]", senderName || "");
    data.append("from_address[company]", senderCompany || "");
    data.append("from_address[address1]", senderAddress1 || "");
    data.append("from_address[address2]", senderAddress2 || "");
    data.append("from_address[city]", senderCity || "");
    data.append("from_address[state]", senderState || "");
    data.append("from_address[zip]", senderZip || "");
    data.append("from_address[phone]", senderPhone || "");
    data.append("from_address[email]", senderEmail || "");
    const response = await mailPdfDocument({
      $,
      data,
      headers: data.getHeaders(),
    });

    $.export("$summary", "Successfully generated and mailed PDF document");
    return response;
  },
};
