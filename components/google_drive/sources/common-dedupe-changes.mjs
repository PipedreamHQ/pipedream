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
      description: `How many minutes to wait until the same file can emit another event.
\\
If set to \`0\`, this interval is disabled and all events will be emitted.`,
      min: 0,
      max: 60,
      default: 1,
    },
  },
  methods: {
    _getFileIntervals() {
      return JSON.parse(this.db.get("fileIntervals") ?? "{}");
    },
    _setFileIntervals(value) {
      this.db.set("fileIntervals", JSON.stringify(value));
    },
    checkMinimumInterval(id) {
      const interval = this.perFileInterval;
      if (!interval) return true;

      const now = Date.now();
      const minTimestamp = now - (interval * 1000 * 60);

      const savedData = this._getFileIntervals();
      Object.entries(savedData).forEach(([
        key,
        value,
      ]) => {
        if (value < minTimestamp) delete savedData[key];
      });

      let shouldEmit = true;
      if (savedData[id]) {
        shouldEmit = false;
      }
      else {
        savedData[id] = now;
      }

      this._setFileIntervals(savedData);
      return shouldEmit;
    },
  },
};
