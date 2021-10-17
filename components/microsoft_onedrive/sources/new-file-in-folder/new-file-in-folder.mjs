import onedrive from "../../microsoft_onedrive.app.mjs";

import {
  hooks,
  props,
  methods,
  run,
} from "../common/base.mjs";

import { toSingleLineString } from "../common/utils.mjs";

export default {
  type: "source",
  key: "microsoft_onedrive-new-file-in-folder",
  name: "New File in Folder (Instant)",
  description: toSingleLineString(`
    Emit an event when a new file is added to a
    specific directory tree in a OneDrive drive
  `),
  version: "0.0.2",
  dedupe: "unique",
  props: {
    ...props,
    folder: {
      propDefinition: [
        onedrive,
        "folder",
      ],
    },
  },
  methods: {
    ...methods,
    getDeltaLinkParams() {
      return {
        folderId: this.folder,
      };
    },
  },
  hooks,
  run,
};
