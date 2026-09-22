import { ConfigurationError } from "@pipedream/platform";
import common from "../common/base.mjs";
import { findMaxFolderId } from "../../common/additionalFolderProps.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "zoho_workdrive-new-folder",
  name: "New Folder",
  version: "0.1.2",
  description: "Emit new event when a new folder is created in a specific folder.",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    folderType: {
      propDefinition: [
        common.props.app,
        "folderType",
      ],
    },
    folderId: {
      propDefinition: [
        common.props.app,
        "parentId",
        ({
          teamId, folderType,
        }) => ({
          teamId,
          folderType,
        }),
      ],
      label: "Folder ID",
      description: "The unique ID of the folder. Select a folder to view its subfolders.",
      reloadProps: true,
    },
  },
  methods: {
    ...common.methods,
    async startEvent(maxResults = 0) {
      let folderId;
      if (this.manuallyEnterFolderId) {
        folderId = this.typedFolderId;
      } else {
        const num = findMaxFolderId(this);
        folderId = num > 0
          ? this[`folderId${num}`]
          : this.folderId;
      }

      if (!folderId) {
        throw new ConfigurationError("Please select a Folder ID or type in a Folder ID.");
      }

      const lastDate = this._getValidatedLastDate();
      let maxDate = lastDate;
      const items = this.app.paginate({
        fn: this.app.listFiles,
        maxResults,
        filter: "folder",
        sort: "created_time",
        folderId,
      });

      let responseArray = [];

      for await (const item of items) {
        const createdTime = item.attributes.created_time_in_millisecond;
        if (createdTime > lastDate) {
          responseArray.push(item);
          if (createdTime > maxDate) {
            maxDate = createdTime;
          }
        }
      }
      this._setLastDate(maxDate);

      for (const item of responseArray) {
        this.$emit(
          item,
          {
            id: item.id,
            summary: `A new folder with ID: "${item.id}" was created!`,
            ts: item.attributes.created_time_in_millisecond,
          },
        );
      }
    },
  },
  hooks: {
    async deploy() {
      await this.startEvent(25);
    },
  },
  sampleEmit,
};
