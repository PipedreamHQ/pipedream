interface DateFormat {
  label: string;
  value: string;
  inputFn?: (s: string) => Date;
  outputFn: (d: Date) => string | number;
}

export const DEFAULT_FORMAT_VALUE = "YYYY-MM-DDTHH:mm:ssZ";

export const DEFAULT_INPUT_FUNCTION: DateFormat["inputFn"] = (str) => {
  const num = Number(str);
  return new Date(num * 1000 || str);
};

// https://tc39.es/ecma402/#table-datetimeformat-components

const DATE_FORMATS: DateFormat[] = [
  {
    label: "Sun Jan 22 23:04:05 -0000 2006",
    value: "ddd MMM DD HH:mm:ss Z YYYY",
    outputFn(dateObj) {
      const date = dateObj
        .toLocaleDateString("en-US", {
          weekday: "short",
          day: "2-digit",
          month: "short",
        })
        .replace(/,/g, "");

      const time = dateObj.toLocaleTimeString("en-GB");

      return `${date} ${time} -0000 ${dateObj.getFullYear()}`;
    },
  },
  {
    label: "January 22 2006 23:04:05",
    value: "MMMM DD YYYY HH:mm:ss",
    outputFn(dateObj) {
      const date = dateObj
        .toLocaleString("en-US", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
        .replace(/,/g, "");

      const time = dateObj.toLocaleTimeString("en-GB");

      return `${date} ${time}`;
    },
  },
  {
    label: "January 22 2006",
    value: "MMMM DD YYYY",
    outputFn(dateObj) {
      return dateObj
        .toLocaleString("en-US", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
        .replace(/,/g, "");
    },
  },
  {
    label: "Jan 22 2006",
    value: "MMM DD YYYY",
    outputFn(dateObj) {
      return dateObj
        .toLocaleString("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        .replace(/,/g, "");
    },
  },
  {
    label: "2006-01-22T23:04:05",
    value: "YYYY-MM-DDTHH:mm:ss",
    outputFn(dateObj) {
      return dateObj
        .toISOString()
        .replace(/\.[0-9]{3}/g, "")
        .replace(/Z/, "-0000");
    },
  },
  {
    label: "2006-01-22T23:04:05-0000",
    value: "YYYY-MM-DDTHH:mm:ss",
    outputFn(dateObj) {
      return dateObj
        .toISOString()
        .replace(/\.[0-9]{3}/g, "")
        .replace(/Z/, "-0000");
    },
  },
  {
    label: "2006-01-22 23:04:05 -0000",
    value: "YYYY-MM-DD HH:mm:ss Z",
    outputFn(dateObj) {
      return dateObj
        .toISOString()
        .replace(/T|(\.[0-9]{3})/g, " ")
        .replace(/Z/, "-0000");
    },
  },
  {
    label: "2006-01-22 23:04",
    value: "YYYY-MM-DD HH:mm",
    outputFn(dateObj) {
      return dateObj
        .toISOString()
        .replace(/T/g, " ")
        .replace(/:[0-9]{2}\.[0-9]{3}Z/, "");
    },
  },
  {
    label: "2006-01-22",
    value: "YYYY-MM-DD",
    outputFn(dateObj) {
      return dateObj
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .split("/")
        .reverse()
        .join("-");
    },
  },
  {
    label: "01-22-2006",
    value: "MM-DD-YYYY",
    outputFn(dateObj) {
      return dateObj
        .toLocaleDateString("en-US", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .replace(/\//g, "-");
    },
  },
  {
    label: "01/22/2006",
    value: "MM/DD/YYYY",
    outputFn(dateObj) {
      return dateObj.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    },
  },
  {
    label: "01/22/06",
    value: "MM/DD/YY",
    outputFn(dateObj) {
      return dateObj.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      });
    },
  },
  {
    label: "22-01-2006",
    value: "DD-MM-YYYY",
    inputFn(str) {
      const [
        day,
        month,
        year,
      ] = str.split("-");
      const date = new Date(
        Date.UTC(Number(year), Number(month) - 1, Number(day)),
      );
      return date;
    },

    outputFn(dateObj) {
      return dateObj.toLocaleDateString("en-GB").replace(/\//g, "-");
    },
  },
  {
    label: "22/01/2006",
    value: "DD/MM/YYYY",
    inputFn(str) {
      const [
        day,
        month,
        year,
      ] = str.split("/");
      const date = new Date(
        Date.UTC(Number(year), Number(month) - 1, Number(day)),
      );
      return date;
    },
    outputFn(dateObj) {
      return dateObj.toLocaleDateString("en-GB");
    },
  },
  {
    label: "22/01/06",
    value: "DD/MM/YY",
    inputFn(str) {
      const [
        day,
        month,
        year,
      ] = str.split("/");
      const date = new Date(
        Date.UTC(Number(year), Number(month) - 1, Number(day) + 2000),
      );
      return date;
    },
    outputFn(dateObj) {
      return dateObj.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      });
    },
  },
  {
    label: "1137971045",
    value: "Unix time (seconds)",
    inputFn(str) {
      return new Date(Number(str) * 1000);
    },
    outputFn(dateObj) {
      return dateObj.valueOf() / 1000;
    },
  },
  {
    label: "1137971045000",
    value: "Unix time (milliseconds)",
    inputFn(str) {
      return new Date(Number(str));
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

export const DATE_FORMAT_OPTIONS = DATE_FORMATS.map(({
  label, value,
}) => ({
  label,
  value,
}));
