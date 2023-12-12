import sftpApp from "../../sftp_password_based_auth.app.mjs";
import base from "../../../sftp/sources/watch-remote-directory/watch-remote-directory.mjs";

export default {
  ...base,
  key: "sftp_password_based_auth-watch-remote-directory",
  name: "New Remote Directory Watcher",
  description: "Emit new events when files get created, changed or deleted from a remote directory. [See the docs](https://github.com/theophilusx/ssh2-sftp-client#orgfac43d1)",
  version: "0.0.1",
  type: "source",
  props: {
    ...base.props,
    sftpApp,
  },
  methods: {
    ...base.methods,
    async connect() {
      return await this.sftpApp.connect();
    },
  },
};
