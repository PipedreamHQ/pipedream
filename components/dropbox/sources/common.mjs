import dropbox from "../dropbox.app.mjs";

export default {
  props: {
    dropbox,
    db: "$.service.db",
    path: {
      propDefinition: [
        dropbox,
        "pathFolder",
      ],
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
  hooks: {
    async activate() {
      await this.dropbox.initState(this);
    },
  },
  methods: {
    getMeta(id, summary) {
      return {
        id,
        summary,
        tz: Date.now(),
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
