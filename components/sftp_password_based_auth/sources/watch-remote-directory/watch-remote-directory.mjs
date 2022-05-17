/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-description */
/* eslint-disable pipedream/required-properties-type */
import sftpApp from "../../sftp_password_based_auth.app.mjs";
import base from "../../../sftp/sources/watch-remote-directory/watch-remote-directory.mjs";

export default {
  ...base,
  key: "sftp_password_based_auth-watch-remote-directory",
  version: "0.0.1",
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
