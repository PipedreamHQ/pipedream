import fs from "fs";
import FormData from "form-data";
import { ConfigurationError } from "@pipedream/platform";
import app from "../../virifi.app.mjs";

export default {
  key: "virifi-certify-document",
  name: "Certify Document",
  description: "Triggers the process for sending a PDF document for certification. For this operation, the user must provide the PDF document. In addition, the user can optionally specify the authenticators for this document. [See the documentation](https://virifi.io/open/api-guide)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    folderName: {
      type: "string",
      label: "Folder Name",
      description: "The name of the folder where the document will be stored.",
    },
    digitalTwin: {
      propDefinition: [
        app,
        "digitalTwin",
      ],
    },
    totalDoc: {
      type: "integer",
      label: "Total Doc",
      description: "The total number of documents.",
      reloadProps: true,
      default: 1,
    },
  },
  additionalProps() {
    const { totalDoc } = this;

    if (totalDoc > 5) {
      throw new ConfigurationError("The maximum number of documents is 5.");
    }

    return Array.from({
      length: totalDoc,
    }).reduce((acc, _, index) => {
      return Object.assign(acc, {
        [`doc${index}`]: {
          type: "string",
          label: `File Path Document ${index + 1}`,
          description: "The document to be sent for certification. This should be the path to the file saved to the `/tmp` directory (e.g. `/tmp/example.pdf`). [See the documentation](https://pipedream.com/docs/workflows/steps/code/nodejs/working-with-files/#the-tmp-directory).",
        },
      });
    }, {});
  },
  methods: {
    certifyDocument(args = {}) {
      return this.app.post({
        path: "/certify-document",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      certifyDocument,
      folderName,
      digitalTwin,
      totalDoc,
      ...props
    } = this;

    const form = new FormData();
    form.append("folderName", folderName);
    form.append("digitalTwin", String(digitalTwin));
    form.append("totalDoc", String(totalDoc));

    Array.from({
      length: totalDoc,
    }).forEach((_, index) => {
      const value = fs.createReadStream(props[`doc${index}`]);
      form.append(`doc${index}`, value);
    });

    const response = await certifyDocument({
      $,
      data: form,
      headers: form.getHeaders(),
    });

    $.export("$summary", "Document certified successfully");
    return response;
  },
};
