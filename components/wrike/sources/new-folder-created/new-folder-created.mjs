import base from "../common/webhooks.mjs";
import constants from "../common/constants.mjs";

export default {
  ...base,
  key: "wrike-new-folder-created",
  name: "New Folder Created",
  description: "Emit new event when a folder is created",
  type: "source",
  version: "0.0.1",
  props: {
    ...base.props,
    folderId: {
      propDefinition: [
        base.props.wrike,
        "folderId",
      ],
      description: "Receive notifications for folders in a folder and, optionally, in its subfolders. Leave blank to receive notifications for all folders in the account",
      optional: true,
      reloadProps: true,
    },
    spaceId: {
      propDefinition: [
        base.props.wrike,
        "spaceId",
      ],
      description: "Receive notifications for changes to folders within a space. Leave blank to receive notifications for all folders in the account",
      optional: true,
      reloadProps: true,
    },
    recursive: {
      type: "boolean",
      label: "Recursive",
      description: "Specifies whether hook should listen to events for subfolders or tasks anywhere in the hierarchy. Defaults to `false`",
      optional: true,
    },
  },
  hooks: {
    ...base.hooks,
    async deploy() {
      console.log("Retrieving historical events...");
      const folders = await this.wrike.listFolders({
        folderId: this.folderId,
        spaceId: this.spaceId,
      });
      for (const folder of folders.slice(-constants.DEPLOY_LIMIT)) {
        this.emitEvent(folder);
      }
    },
  },
  methods: {
    ...base.methods,
    eventTypes() {
      return [
        "FolderCreated",
      ];
    },
    async emitEvent(folder) {
      this.$emit(folder, {
        id: folder.id,
        summary: `New folder: ${folder.title}`,
        ts: folder.createdDate,
      });
    },
  },
  async run(event) {
    console.log("Webhook received");
    for (const data of event.body) {
      const folder = await this.wrike.getFolder({
        folderId: data.folderId,
      });
      this.emitEvent(folder);
    }
  },
};
