import sinch from "../../sinch.app.mjs";
import { getFileStreamAndMetadata } from "@pipedream/platform";
import FormData from "form-data";

export default {
  key: "sinch-send-fax",
  name: "Send Fax",
  description: "Send a fax to a contact. [See the documentation](https://developers.sinch.com/docs/fax/api-reference/fax/tag/Faxes/#tag/Faxes/operation/sendFax)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    sinch,
    to: {
      type: "string",
      label: "To",
      description: "The phone number to send the fax to",
    },
    file: {
      type: "string",
      label: "File Path or URL",
      description: "Provide either a file URL or a path to a file in the /tmp directory (for example, /tmp/myFile.pdf).",
    },
    from: {
      type: "string",
      label: "From",
      description: "The phone number of the sender",
      optional: true,
    },
    headerText: {
      type: "string",
      label: "Header Text",
      description: "Text that will be displayed at the top of each page of the fax. 50 characters maximum.",
      optional: true,
    },
    retryDelaySeconds: {
      type: "integer",
      label: "Retry Delay Seconds",
      description: "The number of seconds to wait between retries if the fax is not yet completed",
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const data = new FormData();

    const {
      stream, metadata,
    } = await getFileStreamAndMetadata(this.file);

    data.append("file", stream, {
      contentType: metadata.contentType,
      knownLength: metadata.size,
      filename: metadata.name,
    });

    data.append("to", this.to);
    if (this.from) {
      data.append("from", this.from);
    }
    if (this.headerText) {
      data.append("headerText", this.headerText);
    }
    if (this.retryDelaySeconds) {
      data.append("retryDelaySeconds", this.retryDelaySeconds);
    }

    const response = await this.sinch.sendFax({
      $,
      data,
      headers: data.getHeaders(),
    });

    $.export("$summary", `Successfully sent fax to ${this.to}`);
    return response;
  },
};
