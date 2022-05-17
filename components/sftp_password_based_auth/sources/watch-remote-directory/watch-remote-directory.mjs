import sftpPasswordBasedAuthApp from "../../sftp_password_based_auth.app.mjs";
import base from "../../../sftp/sources/common/base.mjs";

export default {
  key: "sftp_password_based_auth-watch-remote-directory",
  name: "New Remote Directory Watcher",
  description: "Emit new events when files get created, changed or deleted from a remote directory. [See the docs](https://github.com/theophilusx/ssh2-sftp-client#orgfac43d1)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    sftpPasswordBasedAuthApp,
    ...base.props,
  },
  methods: {
    ...base.methods,
  },
  async run() {
    this.validateRootDirectory(this.rootDirectory);

    const sftp = await this.sftpPasswordBasedAuthApp.connect();

    let directories = [
      {
        path: this.rootDirectory,
      },
    ];
    directories = directories.concat(
      await this.listDirectoriesDeep(sftp, this.rootDirectory, this.maxDepth, 0),
    );

    const currentFiles = await this.listAllFilesFromDirectories(sftp, directories);
    const previousFiles = this.getFiles();
    const filesChangesWithEvent = this.getChangesWithEvent(currentFiles, previousFiles);
    this.emitEvents(filesChangesWithEvent);

    this.setFiles(currentFiles);
    await sftp.end();
  },
};
