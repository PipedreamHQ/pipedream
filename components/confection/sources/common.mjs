import axios from "axios";
import confection from "../confection.app.mjs";
import dayjs from "dayjs";

export default {
  props: {
    confection,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 15 * 60,
      },
    },
    db: "$.service.db",
  },
  methods: {
    /**
     * Collect results from paginated Confection API
     *
     * @param {number} pages - Number of pages to retrieve
     * @param {object} firstPage - Result object from first page, to assign to
     * @param {string} url - Base Confection API URL
     */
    async pagination(pages, firstPage, url) {
      const output = firstPage;

      for (let counter = 2; counter <= pages; counter++) {
        const { data } = await axios.post(
          `${url}/page/${counter}`,
          {
            key: this.confection.$auth.secret_key,
          },
          {
            headers: {
              Accept: "application/json",
            },
          },
        );

        Object.assign(output, data.collection);
      }

      return output;
    },
  },
  async run(event) {
    const intervalSeconds = event.interval_seconds || 15 * 60;
    const timestamp = event.timestamp || dayjs().unix();
    const lastTimestamp =
      this.db.get("lastTimestamp") || timestamp - intervalSeconds;
    const url = this.getUrl(lastTimestamp, timestamp);
    const { data } = await axios.post(
      url,
      {
        key: this.confection.$auth.secret_key,
      },
      {
        headers: {
          Accept: "application/json",
        },
      },
    );

    this.db.set("lastTimestamp", timestamp);

    if (data.results_number === 0) {
      this.$emit([]);
    } else {
      const pageCount = Math.ceil(data.results_number / 50);
      const allResults = await this.pagination(
        this.confection.$auth.secret_key,
        pageCount,
        data.collection,
        url,
      );

      Object.entries(allResults).forEach(([
        key,
        value,
      ]) => {
        const id = `${key}-${value.updated_time}`;

        this.$emit(
          {
            ...value,
            UUID: key,
          },
          {
            id,
            summary: this.getSummary(key),
          },
        );
      });
    }
  },
};
