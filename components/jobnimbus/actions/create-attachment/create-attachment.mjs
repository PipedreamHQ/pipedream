import app from "../../jobnimbus.app.mjs";
import utils from "../../common/utils.mjs";
import { attachmentTypes } from "../../common/constants.mjs";
import {
  ConfigurationError, getFileStream,
} from "@pipedream/platform";

export default {
  key: "jobnimbus-create-attachment",
  version: "1.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  name: "Create Attachment",
  description: "Creates an attachment. [See the documentation](https://documenter.getpostman.com/view/3919598/S11PpG4x#5f3f485b-91f9-4ed9-912c-99a07987ac6c)",
  props: {
    app,
    file: {
      type: "string",
      label: "File Path or URL",
      description: "The file to upload. Provide a file URL or a path to a file in the `/tmp` directory.",
    },
    type: {
      type: "string",
      label: "Type",
      description: "The record type.",
      options: attachmentTypes,
    },
    customerIdFromContacts: { //There is no endpoint that can be customers fetched from.
      propDefinition: [
        app,
        "customerIdFromContacts",
      ],
      optional: true,
    },
    filename: {
      type: "string",
      label: "File Name",
      description: "Name of the file to be uploaded.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the file.",
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
  async run ({ $ }) {
    if (!this.file) {
      throw new ConfigurationError("The `File Path or URL` prop is required.");
    }

    const stream = await getFileStream(this.file);
    const fileData = await this.streamToBase64(stream);

    const data = {
      ...utils.extractProps(this, {
        customerIdFromContacts: "customer",
      }),
      data: fileData,
    };
    delete data.file;
    const resp = await this.app.createAttachment({
      $,
      data,
    });
    $.export("$summary", `Successfully created attachment with ID ${resp.jnid}`);
    return resp;
  },
};
