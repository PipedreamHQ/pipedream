import postmark from "../../postmark.app.mjs";

export default {
  key: "postmark-list-sender-signatures",
  name: "List Sender Signatures",
  description: "Gets a list of sender signatures containing brief details associated with your account. [See the documentation](https://postmarkapp.com/developer/api/signatures-api#list-sender-signatures)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    postmark,
  },
  async run({ $ }) {
    const response = this.postmark.paginate({
      fn: this.postmark.listSenderSignatures,
      fieldList: "SenderSignatures",
    });

    const responseArray = [];

    for await (const item of response) {
      responseArray.push(item);
    }

    $.export("$summary", `Successfully fetched ${responseArray.length} sender signatures!`);
    return responseArray;
  },
};
