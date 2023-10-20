import { ConfigurationError } from "@pipedream/platform";
import app from "../../megaventory.app.mjs";

export default {
  props: {
    app,
    db: "$.service.db",
  },
  methods: {
    extractTimestamp(str) {
      const match = str.match(/\/Date\((\d+)-\d+\)\//);
      try {
        if (match) {
          return parseInt(match[1]);
        }
      } catch (error) {
        console.log("Error parsing date: ", error);
      }
      return Date.now();
    },
    timestampToDate(timestamp) {
      const date = new Date(timestamp);
      const day = ("0" + date.getDate()).slice(-2);
      const month = ("0" + (date.getMonth() + 1)).slice(-2);
      const year = date.getFullYear();
      const hours = ("0" + date.getHours()).slice(-2);
      const minutes = ("0" + date.getMinutes()).slice(-2);
      const seconds = ("0" + date.getSeconds()).slice(-2);
      return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    },
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
    },
  },
};
