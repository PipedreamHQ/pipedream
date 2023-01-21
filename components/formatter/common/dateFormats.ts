interface DateFormat {
  label: string;
  value: string;
  parseFn?: (s: string) => Date;
}

const DEFAULT_PARSE_FUNCTION: DateFormat["parseFn"] = (str) => new Date(str);

const DATE_FORMATS: DateFormat[] = [
  {
    label: "Sun Jan 22 23:04:05 -0000 2006",
    value: "ddd MMM DD HH:mm:ss Z YYYY",
  },
  {
    label: "January 22 2006 23:04:05",
    value: "MMMM DD YYYY HH:mm:ss",
  },
  {
    label: "January 22 2006",
    value: "MMMM DD YYYY",
  },
  {
    label: "Jan 22 2006",
    value: "MMM DD YYYY",
  },
  {
    label: "2006-01-22T23:04:05-0000",
    value: "YYYY-MM-DDTHH:mm:ssZ",
  },
  {
    label: "2006-01-22 23:04:05 -0000",
    value: "YYYY-MM-DD HH:mm:ss Z",
  },
  {
    label: "2006-01-22",
    value: "YYYY-MM-DD",
  },
  {
    label: "01-22-2006",
    value: "MM-DD-YYYY",
  },
  {
    label: "01/22/2006",
    value: "MM/DD/YYYY",
  },
  {
    label: "01/22/06",
    value: "MM/DD/YY",
  },
  {
    label: "22-01-2006",
    value: "DD-MM-YYYY",
    parseFn: (str) => {
      const [day, month, year] = str.split("-");
      const date = new Date(Number(year), Number(month) - 1, Number(day));
      return date;
    },
  },
  {
    label: "22/01/2006",
    value: "DD/MM/YYYY",
    parseFn: (str) => {
      const [day, month, year] = str.split("/");
      const date = new Date(Number(year), Number(month) - 1, Number(day));
      return date;
    },
  },
  {
    label: "22/01/06",
    value: "DD/MM/YY",
    parseFn: (str) => {
      const [day, month, year] = str.split("/");
      const date = new Date(
        Number(year),
        Number(month) - 1,
        Number(day) + 2000
      );
      return date;
    },
  },
  {
    label: "1137971045 (Unix time in seconds)",
    value: "S",
    parseFn: (str) => new Date(Number(str) * 1000),
  },
  {
    label: "1137971045000 (Unix time in milliseconds)",
    value: "MS",
    parseFn: (str) => new Date(Number(str)),
  },
];

const mapData: [DateFormat["value"], Required<DateFormat>["parseFn"]][] =
  DATE_FORMATS.map(({ value, parseFn }) => [
    value,
    parseFn ?? DEFAULT_PARSE_FUNCTION,
  ]);

export const DATE_FORMAT_PARSE_MAP = new Map(mapData);

export const DATE_FORMAT_OPTIONS = DATE_FORMATS.map(({ label, value }) => ({
  label,
  value,
}));
