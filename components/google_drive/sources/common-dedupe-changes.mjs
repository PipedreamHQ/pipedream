import { MAX_FILE_INTERVAL_ENTRIES } from "../common/constants.mjs";

export default {
  props: {
    intervalAlert: {
      type: "alert",
      alertType: "info",
      content: `This source can emit many events in quick succession while a file is being edited. By default, it will not emit another event for the same file for at least 1 minute.
\\
You can change or disable this minimum interval using the prop \`Minimum Interval Per File\`.`,
    },
    perFileInterval: {
      type: "integer",
      label: "Minimum Interval Per File",
      description: "How many minutes to wait until the same file can emit another event.\n\nIf set to `0`, this interval is disabled and all events will be emitted.",
      min: 0,
      max: 60,
      default: 3,
      optional: true,
    },
  },
  methods: {
    // Read once per run; flushFileIntervals() writes it back once
    _getFileIntervals() {
      if (!this._fileIntervals) {
        this._fileIntervals = this.db.get("fileIntervals") ?? {};
      }
      return this._fileIntervals;
    },
    _setFileIntervals(value) {
      this.db.set("fileIntervals", value);
    },
    filterByMinimumInterval(files) {
      const interval = this.perFileInterval;
      if (!interval) {
        return files;
      }

      const minTimestamp = Date.now() - (interval * 1000 * 60);
      const savedData = this._getFileIntervals();
      return files.filter(({ id }) => !savedData[id] || savedData[id] < minTimestamp);
    },
    recordFileEmits(fileIds) {
      if (!this.perFileInterval || !fileIds.length) {
        return;
      }

      const now = Date.now();
      const savedData = this._getFileIntervals();
      fileIds.forEach((id) => {
        savedData[id] = now;
      });
      this._fileIntervalsChanged = true;
    },
    flushFileIntervals() {
      if (this._fileIntervalsChanged) {
        const minTimestamp = Date.now() - (this.perFileInterval * 1000 * 60);
        const entries = Object.entries(this._getFileIntervals())
          .filter((entry) => entry[1] >= minTimestamp)
          .sort((a, b) => b[1] - a[1])
          .slice(0, MAX_FILE_INTERVAL_ENTRIES);
        this._setFileIntervals(Object.fromEntries(entries));
      }
      this.resetFileIntervals();
    },
    resetFileIntervals() {
      this._fileIntervals = null;
      this._fileIntervalsChanged = false;
    },
    checkMinimumInterval(files) {
      const filteredFiles = this.filterByMinimumInterval(files);
      this.recordFileEmits(filteredFiles.map(({ id }) => id));
      return filteredFiles;
    },
  },
};
