import kovapdf from "../../kovapdf.app.mjs";
import {
  getFileObject, MAX_FILE_BYTES,
} from "../../common/utils.mjs";

export default {
  key: "kovapdf-send-signature-request",
  name: "Send Document for Signature",
  description: "Send a PDF to one person to sign, with one signature box placed on the page you choose. The signer gets an email with a link to sign. Returns the new signature request with its ID, status and signers. Use **Get Signature Request** to follow its progress and **Download Document** to save the signed PDF. [See the documentation](https://www.kovapdf.com/developers/docs)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    kovapdf,
    file: {
      propDefinition: [
        kovapdf,
        "file",
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title the signer sees. It is also the email subject. Example: `Please sign the Q4 supply contract`",
    },
    signerName: {
      type: "string",
      label: "Signer Name",
      description: "The name of the person who signs. Example: `Jane Doe`",
    },
    signerEmail: {
      type: "string",
      label: "Signer Email",
      description: "The email address of the person who signs. Example: `jane@example.com`",
    },
    expiresInDays: {
      type: "integer",
      label: "Expires In Days",
      description: "How many days the signer has to sign, from 1 to 60. Defaults to 14. Example: `30`",
      default: 14,
      min: 1,
      max: 60,
    },
    message: {
      type: "string",
      label: "Message",
      description: "A short message for the signer. Example: `Please review and sign by Friday.`",
      optional: true,
    },
    idempotencyKey: {
      type: "string",
      label: "Idempotency Key",
      description: "Optional. Send the same key with the same request to retry safely within 24 hours: you get the first answer back and no second email is sent. Use a new key for each new request. Example: `6f1c2a8e-3d4b-4f7a-9a51-2b8f0c9e7d13`",
      optional: true,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "The page of the signature box, starting from 1. Example: `1`",
      default: 1,
      min: 1,
    },
    x: {
      type: "integer",
      label: "X",
      description: "The distance of the signature box from the left edge of the page, in points (72 points = 1 inch). Example: `72`",
      default: 72,
      min: 0,
    },
    y: {
      type: "integer",
      label: "Y",
      description: "The distance of the signature box from the bottom edge of the page, in points (72 points = 1 inch). Example: `72`",
      default: 72,
      min: 0,
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.kovapdf.createSignatureRequest({
      $,
      ...(this.idempotencyKey
        ? {
          headers: {
            "Idempotency-Key": this.idempotencyKey,
          },
        }
        : {}),
      data: {
        file: await getFileObject(this.file, MAX_FILE_BYTES.signRequest),
        spec: {
          title: this.title,
          message: this.message,
          sequential: true,
          expiresInDays: this.expiresInDays,
          signers: [
            {
              name: this.signerName,
              email: this.signerEmail,
              order: 1,
            },
          ],
          fields: [
            {
              signer: 0,
              kind: "SIGNATURE",
              page: this.page,
              x: this.x,
              y: this.y,
              width: 180,
              height: 48,
            },
          ],
        },
      },
    });
    $.export("$summary", `Successfully sent "${response.title}" for signature`);
    return response;
  },
};
