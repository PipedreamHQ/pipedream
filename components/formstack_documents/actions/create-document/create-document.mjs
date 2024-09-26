import formstackDocuments from "../../formstack_documents.app.mjs";
import fs from "fs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "formstack_documents-create-document",
  name: "Create Document",
  description: "Create a new document. [See documentation](https://www.webmerge.me/developers?page=documents)",
  version: "0.0.1",
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
      props.fileUrl = {
        type: "string",
        label: "File URL",
        description: "Public URL to the file",
        optional: true,
      };
      props.filePath = {
        type: "string",
        label: "File Path",
        description: "File path of a file previously downloaded in Pipedream E.g. (`/tmp/my-file.txt`). [Download a file to the `/tmp` directory](https://pipedream.com/docs/code/nodejs/http-requests/#download-a-file-to-the-tmp-directory)",
        optional: true,
      };
    }
    return props;
  },
  methods: {
    formatFilePath(path) {
      if (path.includes("/tmp/")) {
        return path;
      }
      return `/tmp/${path}`;
    },
  },
  async run({ $ }) {
    if (this.type !== "html" && !this.fileUrl && !this.filePath) {
      throw new ConfigurationError("Either File URL or File Path must be provided.");
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
    if (this.fileUrl) {
      data.file_url = this.fileUrl;
    }
    if (this.filePath) {
      data.file_contents = fs.readFileSync(this.formatFilePath(this.filePath), {
        encoding: "base64",
      });
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
