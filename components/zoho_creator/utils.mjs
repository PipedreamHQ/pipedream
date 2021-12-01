import constants from "./constants.mjs";

export default {
  computePageAndOffset({
    recordsCount = 0,
    pageSize = constants.RECORDS_PAGE_SIZE,
  }) {
    const page = 1 + Math.floor(recordsCount / pageSize);
    const offset = recordsCount % pageSize;
    return [
      page,
      offset,
    ];
  },
};
