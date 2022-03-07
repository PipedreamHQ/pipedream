import isEmpty from "lodash/isEmpty.js";
import isNil from "lodash/isNil.js";

export default {
  methods: {
    getNormalizedPath: (path, appendFinalBar) => {
      let normalizedPath = path?.value || path;

      // Check for empties path
      if (isNil(normalizedPath) || isEmpty(normalizedPath)) {
        normalizedPath = "/";
      }

      if (appendFinalBar && normalizedPath[normalizedPath.length - 1] !== "/") {
        normalizedPath += "/";
      }

      return normalizedPath;
    },
  },
};
