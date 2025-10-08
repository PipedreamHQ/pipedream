import utils from "../../common/utils.mjs";
import component from "@pipedream/sftp/actions/upload-file/upload-file.mjs";

export default {
  ...component,
  props: utils.buildAppProps({
    component,
  }),
  key: "sftp_password_based_auth-upload-file",
  name: "Upload File (Password Auth)",
  description: "Uploads a file or string in UTF-8 format to the SFTP server. [See the documentation](https://github.com/theophilusx/ssh2-sftp-client#org99d1b64)",
  version: "0.3.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
};
