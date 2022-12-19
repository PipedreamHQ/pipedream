import base from "../common/base.mjs";

export default {
  ...base,
  key: "digitalocean_spaces-file-deleted",
  name: "File Deleted",
  description: "Emit new event when a file is deleted from a DigitalOcean Spaces bucket",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
};
