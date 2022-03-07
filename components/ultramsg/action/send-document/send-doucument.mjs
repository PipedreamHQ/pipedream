import ultramsg from "../../ultramsg.app.mjs";

export default {
  name: "Send a Document",
  description: "Send a document to a specified number. [See the docs here](https://docs.ultramsg.com/api/post/messages/document)",
  key: "ultramsg-send-document",
  version: "0.0.1",
  type: "action",
  props: {
    ultramsg,
    to: {
      propDefinition: [
        ultramsg,
        "to",
      ],
    },
    document: {
      type: "string",
      label: "Document",
      description: "Public URL of your document",
    },
    filename: {
      type: "string",
      label: "Filename",
      description: "The name of your file",
    },
  },
  async run({ $ }) {
    const {
      to,
      document,
      filename,
    } = this;

    const data = {
      to,
      document,
      filename,
    };
    const res = await this.ultramsg.sendDocument(data, $);
    $.export("$summary", `Document successfully sent to "${to}"`);

    return res;
  },
};
