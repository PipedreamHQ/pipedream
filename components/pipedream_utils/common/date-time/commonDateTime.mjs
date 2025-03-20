import pipedream_utils from "../../pipedream_utils.app.mjs";
import { ConfigurationError } from "@pipedream/platform";
import {
  DATE_FORMAT_PARSE_MAP, DEFAULT_INPUT_FUNCTION,
} from "./dateFormats.mjs";
export default {
  props: {
    pipedream_utils,
    inputDate: {
      description: "A valid date string, in the format selected in **Input Format**. If the format is not set, Pipedream will attempt to infer it using the parser from [Sugar Date library](https://sugarjs.com/dates/#/Parsing).",
      propDefinition: [
        pipedream_utils,
        "inputDate",
      ],
    },
    inputFormat: {
      propDefinition: [
        pipedream_utils,
        "inputFormat",
      ],
    },
  },
  methods: {
    getDateFromInput(date = this.inputDate, format = this.inputFormat) {
      let dateObj;
      try {
        const inputFn = DATE_FORMAT_PARSE_MAP.get(format)?.inputFn ??
                    DEFAULT_INPUT_FUNCTION;
        dateObj = inputFn(date);
        if (isNaN(dateObj.getFullYear()))
          throw new Error("Invalid date");
      }
      catch (err) {
        throw new ConfigurationError(`**Error** parsing input \`${date}\` ${format
          ? `expecting specified format \`${format}\``
          : "- try selecting a format in the **Input Format** prop."}`);
      }
      return dateObj;
    },
  },
};
