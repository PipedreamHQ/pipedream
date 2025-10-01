import formstackDocuments from "../../formstack_documents.app.mjs";
import {
  ConfigurationError, getFileStream,
} from "@pipedream/platform";

export default {
  key: "formstack_documents-create-document",
  name: "Create Document",
  description: "Create a new document. [See documentation](https://www.webmerge.me/developers?page=documents)",
  version: "1.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    formstackDocuments,
    name: {
      type: "string",
      label: "Name",
      description: "The document name",
    },
    type: {
      propDefinition: [
        formstackDocuments,
        "documentType",
      ],
      reloadProps: true,
    },
    output: {
      propDefinition: [
        formstackDocuments,
        "documentOutput",
      ],
    },
    folder: {
      type: "string",
      label: "Folder",
      description: "The name of the folder to save the document in. If folder doesn't exist, one will be created.",
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.type === "html") {
      props.html = {
        type: "string",
        label: "HTML",
        description: "The HTML of the document",
      };
      props.width = {
        type: "string",
        label: "Width",
        description: "The width of the document (inches)",
        optional: true,
      };
      props.height = {
        type: "string",
        label: "Height",
        description: "The height of the document (inches)",
        optional: true,
      };
    } else {
      props.file = {
        type: "string",
        label: "File Path or URL",
        description: "Provide a file URL or a path to a file in the `/tmp` directory.",
      };
    }
    return props;
  },
  methods: {
    streamToBase64(stream) {
      return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("end", () => {
          const buffer = Buffer.concat(chunks);
          resolve(buffer.toString("base64"));
        });
        stream.on("error", reject);
      });
    },
  },
  async run({ $ }) {
    if (this.type !== "html" && !this.file) {
      throw new ConfigurationError("The File field is required for the selected document type.");
    }

    const data = {
      name: this.name,
      type: this.type,
      output: this.output,
      folder: this.folder,
    };

    if (this.type === "html") {
      data.html = this.html;
      data.size_width = this.width;
      data.size_height = this.height;
    }

    if (this.file) {
      const stream = await getFileStream(this.file);
      data.file_contents = await this.streamToBase64(stream);
    }

    const response = await this.formstackDocuments.createDocument({
      data,
      $,
    });

    if (response) {
      $.export("$summary", `Successfully created document with ID ${response.id}.`);
    }

    return response;
  },
};
