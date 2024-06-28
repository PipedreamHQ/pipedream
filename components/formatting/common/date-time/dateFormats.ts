import sugar from "sugar";

interface DateFormat {
  value: string;
  inputFn?: (s: string) => Date;
  outputFn: (d: Date) => string | number;
}

export const DEFAULT_FORMAT_VALUE = "2006-01-22T23:04:05+0000";

export const DEFAULT_INPUT_FUNCTION: DateFormat["inputFn"] = (str) => {
  const num = Number(str);
  return sugar.Date.create(num * 1000 || str);
};

// https://tc39.es/ecma402/#table-datetimeformat-components

const DATE_FORMATS: DateFormat[] = [
  {
    value: "Sun Jan 22 23:04:05 +0000 2006",
    outputFn(dateObj) {
      return sugar.Date.format(dateObj, "%a %b %d %H:%M:%S {ZZ} %Y");
    },
  },
  {
    value: "January 22 2006 23:04:05",
    outputFn(dateObj) {
      return sugar.Date.format(dateObj, "%B %d %Y %H:%M:%S");
    },
  },
  {
    value: "January 22 2006",
    outputFn(dateObj) {
      return sugar.Date.format(dateObj, "%B %d %Y");
    },
  },
  {
    value: "Jan 22 2006",
    outputFn(dateObj) {
      return sugar.Date.format(dateObj, "%b %d %Y");
    },
  },
  {
    value: "2006-01-22T23:04:05",
    outputFn(dateObj) {
      return [
        sugar.Date.format(dateObj, "%Y-%m-%d"),
        "T",
        sugar.Date.format(dateObj, "%H:%M:%S"),
      ].join("");
    },
  },
  {
    value: "2006-01-22T23:04:05+0000",
    outputFn(dateObj) {
      return [
        sugar.Date.format(dateObj, "%Y-%m-%d"),
        "T",
        sugar.Date.format(dateObj, "%H:%M:%S{ZZ}"),
      ].join("");
    },
  },
  {
    value: "2006-01-22 23:04:05 +0000",
    outputFn(dateObj) {
      return sugar.Date.format(dateObj, "%Y-%m-%d %H:%M:%S {ZZ}");
    },
  },
  {
    value: "2006-01-22 23:04",
    outputFn(dateObj) {
      return sugar.Date.format(dateObj, "%Y-%m-%d %H:%M");
    },
  },
  {
    value: "2006-01-22",
    outputFn(dateObj) {
      return sugar.Date.format(dateObj, "%Y-%m-%d");
    },
  },
  {
    value: "01-22-2006",
    outputFn(dateObj) {
      return sugar.Date.format(dateObj, "%m-%d-%Y");
    },
  },
  {
    value: "01/22/2006",
    outputFn(dateObj) {
      return sugar.Date.format(dateObj, "%m/%d/%Y");
    },
  },
  {
    value: "01/22/06",
    outputFn(dateObj) {
      return sugar.Date.format(dateObj, "%m/%d/{yy}");
    },
  },
  {
    value: "22-01-2006",
    inputFn(str) {
      const [
        day,
        month,
        year,
      ] = str.split("-");
      return sugar.Date.create(`${year}-${month}-${day}`, {
        fromUTC: true,
      });
    },

    outputFn(dateObj) {
      return sugar.Date.format(dateObj, "%d-%m-%Y");
    },
  },
  {
    value: "22/01/2006",
    inputFn(str) {
      const [
        day,
        month,
        year,
      ] = str.split("/");
      return sugar.Date.create(`${year}-${month}-${day}`, {
        fromUTC: true,
      });
    },
    outputFn(dateObj) {
      return sugar.Date.format(dateObj, "%d/%m/%Y");
    },
  },
  {
    value: "22/01/06",
    inputFn(str) {
      const [
        day,
        month,
        year,
      ] = str.split("/");
      return sugar.Date.create(`${Number(year) + 2000}-${month}-${day}`, {
        fromUTC: true,
      });
    },
    outputFn(dateObj) {
      return sugar.Date.format(dateObj, "%d/%m/{yy}");
    },
  },
  {
    value: "Unix time (seconds) Eg. 1137971045",
    inputFn(str) {
      return sugar.Date.create(Number(str) * 1000);
    },
    outputFn(dateObj) {
      return dateObj.valueOf() / 1000;
    },
  },
  {
    value: "Unix time (milliseconds) Eg. 1137971045000",
    inputFn(str) {
      return sugar.Date.create(Number(str));
    },
    outputFn(dateObj) {
      return dateObj.valueOf();
    },
  },
];

const mapData: [
  DateFormat["value"],
  Pick<DateFormat, "inputFn" | "outputFn">
][] = DATE_FORMATS.map(({
  value, inputFn, outputFn,
}) => {
  return [
    value,
    {
      inputFn,
      outputFn,
    },
  ];
});

export const DATE_FORMAT_PARSE_MAP = new Map(mapData);

export const DATE_FORMAT_OPTIONS = DATE_FORMATS.map(({ value }) => value);
