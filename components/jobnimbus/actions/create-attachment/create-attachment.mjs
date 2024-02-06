import app from "../../jobnimbus.app.mjs";
import utils from "../../common/utils.mjs";
import { attachmentTypes } from "../../common/constants.mjs";
import { ConfigurationError } from "@pipedream/platform";
import fs from "fs";

export default {
  key: "jobnimbus-create-attachment",
  version: "0.0.1",
  type: "action",
  name: "Create Attachment",
  description: "Creates an attachment. [See the documentation](https://documenter.getpostman.com/view/3919598/S11PpG4x#5f3f485b-91f9-4ed9-912c-99a07987ac6c)",
  props: {
    app,
    filePath: {
      type: "string",
      label: "File Path",
      description: "The file to upload, please provide a valid file from `/tmp`. To upload a file to `/tmp` folder, please follow the doc [here](https://pipedream.com/docs/code/nodejs/working-with-files/#writing-a-file-to-tmp)",
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
  },
  async run ({ $ }) {
    const filePath = utils.isValidFile(this.filePath);
    if (!filePath) {
      throw new ConfigurationError("`File Path` must be a valid file path!");
    }
    const fileData = fs.readFileSync(filePath, {
      flag: "r",
      encoding: "base64",
    });
    const data = {
      ...utils.extractProps(this, {
        customerIdFromContacts: "customer",
      }),
      data: fileData,
    };
    delete data["filePath"];
    const resp = await this.app.createAttachment({
      $,
      data,
    });
    $.export("$summary", `Successfully created attachment with ID ${resp.jnid}`);
    return resp;
  },
};
