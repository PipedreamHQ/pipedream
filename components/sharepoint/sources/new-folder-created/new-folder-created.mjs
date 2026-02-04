import common from "../common/common.mjs";

export default {
  ...common,
  key: "sharepoint-new-folder-created",
  name: "New Folder Created",
  description: "Emit new event when a new folder is created in Microsoft Sharepoint.",
  version: "0.0.4",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    siteId: {
      propDefinition: [
        common.props.sharepoint,
        "siteId",
      ],
    },
    driveId: {
      propDefinition: [
        common.props.sharepoint,
        "driveId",
        (c) => ({
          siteId: c.siteId,
        }),
      ],
    },
    folderId: {
      propDefinition: [
        common.props.sharepoint,
        "folderId",
        (c) => ({
          siteId: c.siteId,
          driveId: c.driveId,
        }),
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.folderId
        ? this.sharepoint.listDriveItemsInFolder
        : this.sharepoint.listDriveItems;
    },
    getArgs() {
      return {
        siteId: this.siteId,
        driveId: this.driveId,
        folderId: this.folderId,
        params: {
          orderby: "lastModifiedDateTime desc",
        },
      };
    },
    getTsField() {
      return "lastModifiedDateTime";
    },
    isSortedDesc() {
      return true;
    },
    isRelevant(item) {
      return !!item.folder;
    },
    generateMeta(item) {
      return {
        id: item.id,
        summary: `New Folder: ${item.name}`,
        ts: Date.parse(item.createdDateTime),
      };
    },
  },
};
