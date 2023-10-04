/* eslint-disable no-unused-vars */
import app from "../../linkedin_ads.app.mjs";

export default {
  props: {
    app,
  },
  methods: {
    getDateArray(date) {
      return [
        `day:${date.getDate() + 1}`,
        `month:${date.getMonth() + 1}`,
        `year:${date.getFullYear()}`,
      ];
    },
    getDateRangeParam(startStr, endStr) {
      const start = this.getDateArray(new Date(startStr)).join(",");

      if (!endStr) {
        return `(start:(${start}))`;
      }

      const end = this.getDateArray(new Date(endStr)).join(",");
      return `(start:(${start}),end:(${end}))`;
    },
    getListParam(list = []) {
      return `List(${list.map(encodeURIComponent).join(",")})`;
      // return `List(${list.map((id) => encodeURIComponent(`urn:li:person:${id}`))})`;
    },
    getListParams(props = {}) {
      return Object.entries(props)
        .reduce((acc, [
          key,
          value,
        ]) => {
          return value === undefined || value === null
            ? acc
            : {
              ...acc,
              [key]: this.getListParam(
                typeof(value) === "string"
                  ? JSON.parse(value)
                  : value,
              ),
            };
        }, {});
    },
    createReport(args = {}) {
      return this.app._makeRequest({
        path: "/adAnalytics",
        ...args,
      });
    },
  },
};
