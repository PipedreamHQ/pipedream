import utils from "../../common/utils.mjs";
import component from "@pipedream/sftp/sources/watch-remote-directory/watch-remote-directory.mjs";

export default {
  ...component,
  props: utils.buildAppProps({
    component,
  }),
  key: "sftp_password_based_auth-watch-remote-directory",
  name: "New Remote Directory Watcher (Password Auth)",
  description: "Emit new events when files get created, changed or deleted from a remote directory. [See the docs](https://github.com/theophilusx/ssh2-sftp-client#orgfac43d1)",
  version: "0.1.2",
  type: "source",
};
