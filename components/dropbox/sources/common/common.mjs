import dropbox from "../../dropbox.app.mjs";

export default {
  props: {
    dropbox,
    db: "$.service.db",
    path: {
      propDefinition: [
        dropbox,
        "path",
        () => ({
          filter: ({ metadata: { metadata: { [".tag"]: type } } }) => type === "folder",
        }),
      ],
      description: "Type the folder name to search for it in the user's Dropbox.",
    },
    recursive: {
      propDefinition: [
        dropbox,
        "recursive",
      ],
    },
    dropboxApphook: {
      type: "$.interface.apphook",
      appProp: "dropbox",
      static: [],
    },
  },
  methods: {
    _getDropboxState() {
      return this.db.get("dropbox_state");
    },
    _setDropboxState(state) {
      this.db.set("dropbox_state", state);
    },
    async getHistoricalEvents(fileTypes = []) {
      const files = await this.dropbox.listFilesFolders({
        path: this.dropbox.getPath(this.path),
        recursive: this.recursive,
        include_media_info: this.includeMediaInfo,
      });
      let count = 0;
      for (const file of files) {
        if (!fileTypes.includes(file[".tag"])) {
          continue;
        }
        if (this.includeLink) {
          file.link = await this.getTemporaryLink(file);
        }
        this.$emit(file, this.getMeta(file.id, file.path_display || file.id));
        count++;
        if (count >= 25) {
          break;
        }
      }
    },
    getMeta(id, summary) {
      return {
        id,
        summary,
        ts: Date.now(),
      };
    },
    async isNewFile(update, lastFileModTime) {
      try {
        const dpx = await this.dropbox.sdk();
        let revisions = await dpx.filesListRevisions({
          path: update.id,
          mode: {
            ".tag": "id",
          },
          limit: 10,
        });
        if (revisions.result) {
          revisions = revisions.result;
        }
        if (revisions.entries.length > 1) {
          const oldest = revisions.entries.pop();
          if (lastFileModTime && lastFileModTime >= oldest.client_modified) {
            return false;
          }
        }
        return true;
      } catch (err) {
        console.log(err);
        this.dropbox.normalizeError(err);
      }
    },
    async getMediaInfo(update) {
      try {
        const dpx = await this.dropbox.sdk();
        const info = await dpx.filesGetMetadata({
          path: update.path_lower,
          include_media_info: true,
        });
        if (info.result) {
          return info.result;
        }
        return update;
      } catch (err) {
        console.log(err);
        this.dropbox.normalizeError(err);
      }
    },
    async getTemporaryLink(update) {
      try {
        const dpx = await this.dropbox.sdk();
        let response = await dpx.filesGetTemporaryLink({
          path: update.path_lower,
        });
        if (response.result) {
          response = response.result;
        }
        const { link } = response;
        return link;
      } catch (err) {
        // returning null because not all files supports download links,
        // but the source should still emit update events to those files
        if (err?.error?.error_summary?.startsWith("unsupported_file")) {
          return null;
        }
        console.log(err);
        this.dropbox.normalizeError(err);
      }
    },
  },
};
