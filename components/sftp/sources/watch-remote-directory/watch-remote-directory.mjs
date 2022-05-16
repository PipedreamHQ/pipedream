import sftpApp from "../../sftp.app.mjs";
import Client from "ssh2-sftp-client";

export default {
  key: "sftp-new-watcher",
  name: "New remote directory watcher",
  description: "Emit new events when files get created, changes it's contents or gets deleted on a remote directory.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    sftpApp,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 5,
      },
    },
    db: "$.service.db",
    rootDirectory: {
      label: "Root directory",
      description: "Root directory to be watched. example: `/public`",
      type: "string",
      default: "/",
    },
    maxDepth: {
      label: "Maximum watcher depth",
      description: "Watch all subdirectories within of the root directory, considering the selected maximum depth.",
      type: "integer",
      min: 0,
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
          if (prvFile.size === file.size && prvFile.modifyTime === file.modifyTime) {
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
    async listDirectories(sftp, parent, currDepth) {
      const files = await sftp.list(parent);
      let directories = files
        .filter((file) => file.type === "d")
        .map((directory) => {
          return {
            ...directory,
            parent,
            path: `${parent}/${directory.name}`,
            depth: currDepth,
          };
        });
      return directories;
    },
    async listDirectoriesDeep(sftp, parent, maxDepth, currDepth) {
      if (currDepth > maxDepth) {
        return [];
      }
      const nextDepth = currDepth + 1;
      const rootDirectories = await this.listDirectories(sftp, parent, currDepth);
      let childrenDirectories = [];
      for (const item of rootDirectories) {
        const path = `${parent}/${item.name}`;
        childrenDirectories = [
          ...childrenDirectories,
          ...(await this.listDirectoriesDeep(sftp, path, maxDepth, nextDepth)),
        ];
      }
      return [
        ...rootDirectories,
        ...childrenDirectories,
      ];
    },
    async listAllFilesFromDirectories(sftp, directories) {
      let allFiles = [];
      for (const directory of directories) {
        const listingResult = await sftp.list(directory.path);
        const files = listingResult
          .filter((file) => file.type !== "d")
          .map((file) => {
            return {
              ...file,
              directory: directory.path,
              path: `${directory.path}/${file.name}`,
              depth: directory.depth || 0,
            };
          });
        allFiles = [
          ...allFiles,
          ...files,
        ];
      }
      return allFiles;
    },
    validateRootDirectory(rootDirectory) {
      if (!rootDirectory) {
        console.log("Must provide root directory");
        return false;
      }
      if (!rootDirectory.startsWith("/")) {
        console.log("The root directory must to be the absolute path and start with a slash, such as: '/public'");
        return false;
      }
      return true;
    },
  },
  async run() {
    if (!this.validateRootDirectory(this.rootDirectory)) {
      return;
    }

    const {
      host,
      username,
      privateKey,
    } = this.sftpApp.$auth;

    const config = {
      host,
      username,
      privateKey,
    };

    const sftp = new Client();
    await sftp.connect(config);

    let directories = [
      {
        path: this.rootDirectory,
      },
    ];
    directories = directories.concat(
      await this.listDirectoriesDeep(sftp, this.rootDirectory, this.maxDepth, 0),
    );

    const currentFiles = await this.listAllFilesFromDirectories(sftp, directories);
    const previousFiles = this.getFilesFromStore();
    const filesChangesWithEvent = this.getChangesWithEvent(currentFiles, previousFiles);

    for (const fileChangeEvent of filesChangesWithEvent) {
      this.$emit(fileChangeEvent, {
        id: `${fileChangeEvent.event}|${fileChangeEvent.path}|${fileChangeEvent.size}|${fileChangeEvent.modifyTime}`,
        summary: `${fileChangeEvent.event} ${fileChangeEvent.path}`,
        ts: new Date(fileChangeEvent.modifyTime),
      });
    }

    this.storeFileList(currentFiles);
    await sftp.end();
  },
};
