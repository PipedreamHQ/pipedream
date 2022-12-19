import base from "../common/base.mjs";

export default {
  ...base,
  key: "digitalocean_spaces-file-uploaded",
  name: "New File Uploaded",
  description: "Emit new event when a file is uploaded to a DigitalOcean Spaces bucket",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
};
