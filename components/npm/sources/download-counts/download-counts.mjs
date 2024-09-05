import app from "../../npm.app.mjs";

export default {
  key: "npm-download-counts",
  name: "New Download Counts",
  description: "Emit new event with the latest count of downloads for an npm package. [See the documentation](https://github.com/npm/registry/blob/main/docs/download-counts.md).",
  version: "0.1.0",
  type: "source",
  props: {
    app,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      description: "One day interval time is recommended because NPM only update metrics once a day. [See the documentation](https://github.com/npm/registry/blob/main/docs/download-counts.md#data-source).",
      default: {
        intervalSeconds: 60 * 60 * 24,
      },
    },
    period: {
      type: "string",
      label: "Period",
      description: "Select last-day, last-week or last-month.",
      optional: false,
      default: "last-day",
      options: [
        "last-day",
        "last-week",
        "last-month",
      ],
    },
    packageName: {
      type: "string",
      label: "Package",
      description: "Enter an npm package name. Leave blank for all",
      optional: true,
    },
  },
  methods: {
    getDownloadCounts({
      period, packageName, ...args
    } = {}) {
      const basePath = `/downloads/point/${encodeURIComponent(period)}`;
      return this.app.makeRequest({
        path: packageName
          ? `${basePath}/${encodeURIComponent(packageName)}`
          : basePath,
        ...args,
      });
    },
  },
  async run({ timestamp: ts }) {
    const {
      getDownloadCounts,
      period,
      packageName,
    } = this;

    const response = await getDownloadCounts({
      period,
      packageName,
    });

    this.$emit(response, {
      id: ts,
      summary: `New Download Count ${response.downloads}`,
      ts,
    });
  },
};
