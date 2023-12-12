import app from "../../app/formatting.app";
import { ConfigurationError } from "@pipedream/platform";
import {
  DATE_FORMAT_PARSE_MAP,
  DEFAULT_INPUT_FUNCTION,
} from "./dateFormats";

export default {
  props: {
    app,
    inputDate: {
      propDefinition: [
        app,
        "inputDate",
      ],
    },
    inputFormat: {
      propDefinition: [
        app,
        "inputFormat",
      ],
    },
  },
  methods: {
    getDateFromInput(date: string = this.inputDate, format: string = this.inputFormat): Date {
      let dateObj: Date;

      try {
        const inputFn =
          DATE_FORMAT_PARSE_MAP.get(format)?.inputFn ??
          DEFAULT_INPUT_FUNCTION;

        dateObj = inputFn(date);

        if (isNaN(dateObj.getFullYear())) throw new Error("Invalid date");
      } catch (err) {
        throw new ConfigurationError(
          `**Error** parsing input \`${date}\` ${
            format
              ? `expecting specified format \`${format}\``
              : "- try selecting a format in the **Input Format** prop."
          }`,
        );
      }

      return dateObj;
    },
  },
};
