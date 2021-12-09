import {
  hooks,
  props,
  methods,
  run,
} from "../common/base.mjs";

export default {
  type: "source",
  key: "microsoft_onedrive-new-file",
  name: "New File (Instant)",
  description: "Emit new event when a new file is added to a specific drive in OneDrive",
  version: "0.0.2",
  dedupe: "unique",
  props,
  hooks: {
    ...hooks,
    async activate() {
      await hooks.activate.call(this);
      this._setLastCreatedTimestamp();
    },
  },
  methods: {
    ...methods,
    _getLastCreatedTimestamp() {
      return this.db.get("lastCreatedTimestamp") || 0;
    },
    _setLastCreatedTimestamp(lastCreatedTimestamp = Date.now()) {
      this.db.set("lastCreatedTimestamp", lastCreatedTimestamp);
    },
    _getMaxCreatedTimestamp() {
      return this.db.get("maxCreatedTimestamp") || 0;
    },
    _setMaxCreatedTimestamp(maxCreatedTimestamp = Date.now()) {
      this.db.set("maxCreatedTimestamp", maxCreatedTimestamp);
    },
    isItemTypeRelevant(driveItem) {
      return !driveItem.deleted;
    },
    isItemRelevant(driveItem) {
      // Drive items that were created prior to the latest cached creation time
      // are not relevant to this event source
      const { createdDateTime } = driveItem;
      const createdTimestamp =  Date.parse(createdDateTime);
      return createdTimestamp > this._getLastCreatedTimestamp() && !!(driveItem.file);
    },
    processEvent(driveItem) {
      const meta = this.generateMeta(driveItem);
      this.$emit(driveItem, meta);

      const { createdDateTime } = driveItem;
      const createdTimestamp = Date.parse(createdDateTime);
      if (createdTimestamp > this._getMaxCreatedTimestamp()) {
        this._setMaxCreatedTimestamp(createdTimestamp);
      }
    },
    postProcessEvent() {
      const maxCreatedTimestamp = this._getMaxCreatedTimestamp();
      this._setLastCreatedTimestamp(maxCreatedTimestamp);
    },
  },
  run,
};
