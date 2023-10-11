/* eslint-disable no-unused-vars */
import app from "../../linkedin_ads.app.mjs";

export default {
  props: {
    app,
  },
  methods: {
    getDateStr(date) {
      return [
        `day:${date.getDate()}`,
        `month:${date.getMonth() + 1}`,
        `year:${date.getFullYear()}`,
      ].join(",");
    },
    getDateRangeParam(startStr, endStr) {
      const { getDateStr } = this;
      const start = getDateStr(new Date(startStr));

      if (!endStr) {
        return `(start:(${start}))`;
      }

      const end = getDateStr(new Date(endStr));
      return `(start:(${start}),end:(${end}))`;
    },
    getListParam(list = []) {
      return `List(${list?.map(encodeURIComponent).join(",")})`;
    },
    getListParams(props = {}) {
      return Object.entries(props)
        .reduce((acc, [
          key,
          value,
        ]) => {
          if (
            typeof(value) === "function"
            || value === undefined
            || value === null
          ) {
            return acc;
          }
          return {
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
        paramsSerializer: (params) => {
          return Object.entries(params)
            .map(([
              key,
              value,
            ]) => `${key}=${value}`)
            .join("&");
        },
        ...args,
      });
    },
  },
};
