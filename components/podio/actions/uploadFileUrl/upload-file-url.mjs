import common from "../common/common-item.mjs";
import app from "../../podio.app.mjs";

const props = common.props;
delete props.itemId;

export default {
  type: "action",
  key: "podio-upload-file-url",
  version: "0.0.6",
  name: "Upload a file url ",
  description: "Upload a new file item url. [See the Sample](https://github.com/podio/podio-rb/blob/6c77c92792c3ae79d487a997909122e90e544bf1/lib/podio/models/file_attachment.rb#L62)",
  props: {
    app,
    orgId: {
        propDefinition: [
          app,
          "orgId",
        ],
    },
    fileUrl: {
        type: "string",
        label: "File url",
        description: "The file url to upload",
      },
  },
  async run ({ $ }) {
    const resp = await this.app.uploadFileUrl({
      $,
      data: {
       url: this.fileUrl
      },
    });
    $.export("$summary", `The File Url has been uploaded successfully.`);
    return resp;
  },
};
