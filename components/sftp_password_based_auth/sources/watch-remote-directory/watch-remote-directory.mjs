import sftpPasswordBasedAuthApp from "../../sftp_password_based_auth.app.mjs";
import ftp from "basic-ftp";

export default {
  key: "github-new-watcher",
  name: "New remote directory watcher",
  description: "Emit new events when files has changed on a remote directory.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    sftpPasswordBasedAuthApp,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 5,
      },
    },
    db: "$.service.db",
    rootDirectory: {
      label: "Root directory",
      description: "Root watched directory. example: `/public`",
      type: "string",
      default: "/",
    },
    deepSearch: {
      label: "Deep search",
      description: "Watch subdirectories",
      type: "boolean",
      default: false,
    },
    secure: {
      label: "Secure",
      description: "Explicit FTPS over TLS.",
      type: "boolean",
      default: true,
    },
    port: {
      label: "Port",
      description: "The port of the FTP server.",
      type: "string",
      options: [
        "21",
        "22",
      ],
    },
  },
  methods: {
    storeFileList(files) {
      this.db.set("files", files);
    },
    getFilesFromStore() {
      return this.db.get("files") || [];
    },
    getChangesWithEvent(currentFiles, previousFiles) {
      const fileChanges = [];
      // deleted file detection;
      for (const prvFile of previousFiles) {
        const file = currentFiles.find((p) => p.path === prvFile.path);
        if (!file) {
          fileChanges.push({
            ...prvFile,
            event: "deleted",
          });
        }
      }
      // created, updated file detection;
      for (const file of currentFiles) {
        const prvFile = previousFiles.find((p) => p.path === file.path);
        if (prvFile) {
          // unchanged files (checking size and last update time)
          if (prvFile.size === file.size && prvFile.modifiedAt === file.modifiedAt) {
            continue;
          }
          // file has changed
          fileChanges.push({
            ...file,
            event: "updated",
          });
          continue;
        }
        // new file detection
        if (!prvFile) {
          fileChanges.push({
            ...file,
            event: "created",
          });
          continue;
        }
      }
      return fileChanges;
    },
    async listDirectories(client, parent) {
      const files = await client.list(parent);
      let directories = files
        .filter((file) => file.type === 2)
        .map((directory) => {
          return {
            ...directory,
            parent,
            path: `${parent}/${directory.name}`,
          };
        });
      return directories;
    },
    async listDirectoriesDeep(client, parent) {
      const rootDirectories = await this.listDirectories(client, parent);
      let childrenDirectories = [];
      for (const item of rootDirectories) {
        const path = `${parent}/${item.name}`;
        childrenDirectories = [
          ...childrenDirectories,
          ...(await this.listDirectoriesDeep(client, path)),
        ];
      }
      return [
        ...rootDirectories,
        ...childrenDirectories,
      ];
    },
    async listAllFilesFromDirectories(client, directories) {
      let allFiles = [];
      for (const directory of directories) {
        const listingResult = await client.list(directory.path);
        const files = listingResult
          .filter((file) => file.type === 1)
          .map((file) => {
            return {
              ...file,
              directory: directory.path,
              path: `${directory.path}/${file.name}`,
            };
          });
        allFiles = [
          ...allFiles,
          ...files,
        ];
      }
      return allFiles;
    },
  },
  async run() {
    const {
      host,
      username,
      password,
    } = this.sftpPasswordBasedAuthApp.$auth;
    const config = {
      host,
      user: username,
      password,
      secure: this.secure,
      port: this.port,
    };

    // connecting
    const client = new ftp.Client();
    await client.access(config);

    // listing
    let directories = [
      {
        path: this.rootDirectory,
      },
    ];
    if (this.deepSearch) {
      directories = directories.concat(await this.listDirectoriesDeep(client, this.rootDirectory));
    } else {
      directories = directories.concat(await this.listDirectories(client, this.rootDirectory));
    }
    const currentFiles = await this.listAllFilesFromDirectories(client, directories);
    const previousFiles = this.getFilesFromStore();
    const filesChangesWithEvent = this.getChangesWithEvent(currentFiles, previousFiles);

    for (const fileChangeEvent of filesChangesWithEvent) {
      this.$emit(fileChangeEvent, {
        id: `${fileChangeEvent.path}|${fileChangeEvent.size}|${fileChangeEvent.modifiedAt}`,
        summary: `${fileChangeEvent.event} ${fileChangeEvent.path}`,
        ts: new Date(fileChangeEvent.modifiedAt),
      });
    }

    this.storeFileList(currentFiles);
    client.close();
  },
};
