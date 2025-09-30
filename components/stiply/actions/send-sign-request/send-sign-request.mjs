import stiply from "../../stiply.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "stiply-send-sign-request",
  name: "Send Sign Request",
  description: "Send a sign request to a recipient. [See the documentation](https://app.stiply.nl/api-documentation/v2#tag/sign-requests/operation/SendSignRequest)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    stiply,
    title: {
      type: "string",
      label: "Title",
      description: "The title of the sign request",
    },
    fileUrls: {
      type: "string[]",
      label: "File URLs",
      description: "The URLs of the files to be signed",
    },
    signers: {
      type: "string[]",
      label: "Signers",
      description: "An array of objects representing the signers of the sign request. Example: `[{ \"email\": \"test@example.com\", \"name\": \"John Doe\" }]`. [See the documentation](https://app.stiply.nl/api-documentation/v2#tag/sign-requests/operation/SendSignRequest) for more information about signer properties.",
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "The subject of the e-mail to the signers",
      optional: true,
    },
    message: {
      type: "string",
      label: "Message",
      description: "The message to the signers. The message can have some basic HTML tags.",
      optional: true,
    },
    signingSequenceType: {
      type: "string",
      label: "Signing Sequence Type",
      description: "Choose if all signers can sign in parallel or sequential",
      options: [
        "sequential",
        "parallel",
      ],
      optional: true,
    },
    term: {
      type: "string",
      label: "Term",
      description: "2 digit code representing the sign term (1d = one day, 2w = two weeks, 3m = three months). When omitted, the account's configured default term will be used.",
      optional: true,
    },
    externalKey: {
      type: "string",
      label: "External Key",
      description: "A key for your internal use so you don't have to save the Stiply sign request key in your local database. However, your external key has to be unique.",
      optional: true,
    },
    comment: {
      type: "string",
      label: "Comment",
      description: "A comment for internal use",
      optional: true,
    },
    callbackUrl: {
      type: "string",
      label: "Callback URL",
      description: "An URL to be called by Stiply when the last signer has signed the document. Please note that key={sign_request_key},external_key={external_key} and sign_request_id={sign_request_id} shall be added to the call back url querystring. The URL will be called using a GET request. When the callback responses with an error status code, the callback is retried 12 times using an exponential backoff algoritm.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.stiply.sendSignRequest({
      $,
      data: {
        title: this.title,
        subject: this.subject,
        message: this.message,
        signing_sequence_type: this.signingSequenceType,
        term: this.term,
        external_key: this.externalKey,
        comment: this.comment,
        call_back_url: this.callbackUrl,
        file_urls: this.fileUrls,
        signers: parseObject(this.signers),
      },
    });
    $.export("$summary", `Sign request with ID; ${response.data.id} sent successfully`);
    return response;
  },
};
