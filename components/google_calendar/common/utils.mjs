import constants from "./constants.mjs";

const DATE_INPUT_REGEX = /^(\d{4})-(\d{2})-(\d{2})(?:T([01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d+)?(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)?)?$/;

export default {
  buildConferenceData({
    url, name,
  }) {
    const host = url.hostname.toLowerCase();
    const provider = constants.CONFERENCE_NAMES_BY_DOMAIN.find(
      ({ domain }) => host === domain || host.endsWith(`.${domain}`),
    );
    return {
      conferenceSolution: {
        key: {
          type: constants.CONFERENCE_SOLUTION_TYPE_ADD_ON,
        },
        name: name?.trim()
          || provider?.name
          || constants.DEFAULT_CONFERENCE_NAME,
      },
      entryPoints: [
        {
          entryPointType: constants.CONFERENCE_ENTRY_POINT_TYPE_VIDEO,
          uri: url.href,
        },
      ],
    };
  },
  isPositiveInteger(value) {
    const number = Number(value);
    return Number.isInteger(number) && number > 0;
  },
  isValidDateInput(value) {
    const match = DATE_INPUT_REGEX.exec(value);
    if (!match) {
      return false;
    }
    const [
      , year,
      month,
      day,
    ] = match.map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.getUTCFullYear() === year
      && date.getUTCMonth() === month - 1
      && date.getUTCDate() === day;
  },
  filterEmptyValues(obj) {
    if (!obj) {
      return obj;
    }
    return Object.entries(obj)
      .reduce((reduction,
        [
          key,
          value,
        ]) => {
        if (value === undefined || value === null || (typeof value === "string" && !value.trim())) {
          return reduction;
        }
        return {
          ...reduction,
          [key]: value,
        };
      }, {});
  },
  parseObject(obj) {
    if (!obj) return undefined;

    if (Array.isArray(obj)) {
      return obj.map((item) => {
        if (typeof item === "string") {
          try {
            return JSON.parse(item);
          } catch (e) {
            return item;
          }
        }
        return item;
      });
    }
    if (typeof obj === "string") {
      try {
        return JSON.parse(obj);
      } catch (e) {
        return obj;
      }
    }
    return obj;
  },
};
