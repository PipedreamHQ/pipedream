import app from "../../app/formatter.app";
import { ConfigurationError } from "@pipedream/platform";
import {
  DATE_FORMAT_PARSE_MAP,
  DEFAULT_INPUT_FUNCTION,
} from "./dateFormats";

export default {
  props: {
    inputDate: {
      propDefinition: [
        app,
        "inputDate",
      ],
    },
    fromFormat: {
      propDefinition: [
        app,
        "dateFormat",
      ],
      label: "From Format",
      description: "The format of the provided date.",
      optional: true,
    },
  },
  methods: {
    getDateFromInput(): Date {
      const {
        fromFormat, inputDate,
      } = this;
      let dateObj: Date;

      try {
        const inputFn =
          DATE_FORMAT_PARSE_MAP.get(fromFormat)?.inputFn ??
          DEFAULT_INPUT_FUNCTION;

        dateObj = inputFn(inputDate);

        if (isNaN(dateObj.getFullYear())) throw new Error("Invalid date");
      } catch (err) {
        throw new ConfigurationError(
          `**Error** parsing input \`${inputDate}\` ${
            fromFormat
              ? `expecting specified format \`${fromFormat}\``
              : "- try selecting a format in the **From Format** prop."
          }`,
        );
      }

      return dateObj;
    },
  },
};
