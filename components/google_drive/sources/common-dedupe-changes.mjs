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
    _getFileIntervals() {
      return this.db.get("fileIntervals") ?? {};
    },
    _setFileIntervals(value) {
      this.db.set("fileIntervals", value);
    },
    checkMinimumInterval(files) {
      const interval = this.perFileInterval;
      if (!interval) return files;

      const now = Date.now();
      const minTimestamp = now - (interval * 1000 * 60);

      const savedData = this._getFileIntervals();
      Object.entries(savedData).forEach(([
        key,
        value,
      ]) => {
        if (value < minTimestamp) delete savedData[key];
      });

      const filteredFiles = files.filter(({ id }) => {
        const exists = !!savedData[id];
        if (!exists) {
          savedData[id] = now;
        }
        return !exists;
      });
      this._setFileIntervals(savedData);
      return filteredFiles;
    },
  },
};
