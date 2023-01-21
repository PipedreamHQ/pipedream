interface DateFormat {
  label: string;
  value: string;
  inputFn?: (s: string) => Date;
  outputFn?: (a: ReturnType<typeof getDateAttributes>) => string;
}

const DEFAULT_INPUT_FUNCTION: DateFormat["inputFn"] = (str) => new Date(str);

function getDateAttributes(dateObj: Date) {
  const year = dateObj.getUTCFullYear();
  const month = dateObj.getUTCMonth();
  const dayOfMonth = dateObj.getUTCDate();
  const dayOfWeek = dateObj.getUTCDay();
  const hours = dateObj.getUTCHours();
  const minutes = dateObj.getUTCMinutes();
  const seconds = dateObj.getUTCSeconds();
  const isoString = dateObj.toISOString();

  return {
    dateObj,
    year,
    month,
    dayOfMonth,
    dayOfWeek,
    hours,
    minutes,
    seconds,
    isoString,
  };
}

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
    outputFn({ isoString }) {
      return isoString.replace(/T|(\.[0-9]{3})/g, "");
    },
  },
  {
    label: "2006-01-22 23:04:05 -0000",
    value: "YYYY-MM-DD HH:mm:ss Z",
    outputFn({ isoString }) {
      return isoString.replace(/\.[0-9]{3}/g, " ");
    },
  },
  {
    label: "2006-01-22",
    value: "YYYY-MM-DD",
    outputFn({ dayOfMonth, month, year }) {
      return `${year}-${month}-${dayOfMonth}`;
    },
  },
  {
    label: "01-22-2006",
    value: "MM-DD-YYYY",
    outputFn({ dayOfMonth, month, year }) {
      return `${month}-${dayOfMonth}-${year}`;
    },
  },
  {
    label: "01/22/2006",
    value: "MM/DD/YYYY",
    outputFn({ dayOfMonth, month, year }) {
      return `${month}/${dayOfMonth}/${year}`;
    },
  },
  {
    label: "01/22/06",
    value: "MM/DD/YY",
    outputFn({ dayOfMonth, month, year }) {
      return `${month}-${dayOfMonth}-${year.toString().slice(-2)}`;
    },
  },
  {
    label: "22-01-2006",
    value: "DD-MM-YYYY",
    inputFn: (str) => {
      const [day, month, year] = str.split("-");
      const date = new Date(
        Date.UTC(Number(year), Number(month) - 1, Number(day))
      );
      return date;
    },
  },
  {
    label: "22/01/2006",
    value: "DD/MM/YYYY",
    inputFn: (str) => {
      const [day, month, year] = str.split("/");
      const date = new Date(
        Date.UTC(Number(year), Number(month) - 1, Number(day))
      );
      return date;
    },
  },
  {
    label: "22/01/06",
    value: "DD/MM/YY",
    inputFn: (str) => {
      const [day, month, year] = str.split("/");
      const date = new Date(
        Date.UTC(Number(year), Number(month) - 1, Number(day) + 2000)
      );
      return date;
    },
  },
  {
    label: "1137971045 (Unix time in seconds)",
    value: "S",
    inputFn: (str) => new Date(Number(str) * 1000),
  },
  {
    label: "1137971045000 (Unix time in milliseconds)",
    value: "MS",
    inputFn: (str) => new Date(Number(str)),
  },
];

const mapData: [
  DateFormat["value"],
  Pick<Required<DateFormat>, "inputFn" | "outputFn">
][] = DATE_FORMATS.map(({ value, inputFn, outputFn }) => {
  if (!inputFn) inputFn = DEFAULT_INPUT_FUNCTION;
  return [
    value,
    {
      inputFn,
      outputFn,
    },
  ];
});

export const DATE_FORMAT_PARSE_MAP = new Map(mapData);

export const DATE_FORMAT_OPTIONS = DATE_FORMATS.map(({ label, value }) => ({
  label,
  value,
}));
