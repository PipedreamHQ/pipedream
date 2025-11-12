import common from "../common/polling.mjs";

export default {
  ...common,
  key: "dotsimple-new-file-uploaded",
  name: "New File Uploaded",
  description: "Emit new event when a new file is uploaded. [See the documentation](https://help.dotsimple.io/en/articles/67-media-files).",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourcesFn() {
      return this.app.listMediaFiles;
    },
    generateMeta(resource) {
      return {
        id: resource.uuid,
        summary: `New File: ${resource.uuid}`,
        ts: Date.parse(resource.created_at),
      };
    },
  },
};
