import buildRegExp from "../../common/text/buildRegExp.mjs";
import pipedream_utils from "../../pipedream_utils.app.mjs";
export default {
  name: "Formatting - [Text] Extract by Regular Expressions List (Regex)",
  description: "Find matches for regular expressions. Returns all matched groups with start and end position.",
  key: "pipedream_utils-extract-by-regular-expressions-list",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    pipedream_utils,
    alert: {
      type: "alert",
      alertType: "info",
      content: "Capture groups let you extract just the parts you need from regex matches.\nLearn more here: https://regexone.com/lesson/capturing_groups",
    },
    key_0: {
      type: "string",
      label: "Key",
      description: "The key where the extraction result for a regex will be stored",
      reloadProps: true,
    },
    input_0: {
      type: "string",
      label: "Input",
      description: "The text you would like to find a pattern from",
    },
    regex_0: {
      type: "string",
      label: "Regular Expression",
      description: "[Regular expression](https://www.w3schools.com/js/js_regexp.asp)",
    },
  },
  additionalProps() {
    const props = {};
    let count = 1;

    while (this[`key_${count}`]) {
      props[`key_${count}`] = {
        type: "string",
        label: "Another Key",
        description: "The key where the extraction result for a regex will be stored",
      };
      props[`input_${count}`] = {
        type: "string",
        label: "Input",
        description: "The text you would like to find a pattern from",
      };
      props[`regex_${count}`] = {
        type: "string",
        label: "Regular Expression",
        description: "[Regular expression](https://www.w3schools.com/js/js_regexp.asp)",
      };
      count++;
    }

    props[`key_${count}`] = {
      type: "string",
      label: "Another Key",
      description: "The key where the extraction result for a regex will be stored",
      optional: true,
      reloadProps: true,
    };

    return props;
  },
  methods: {
    getRegExp(regExpStr) {
      return regExpStr.startsWith("/")
        ? buildRegExp(regExpStr, [
          "g",
        ])
        : regExpStr;
    },
    getResults(input, regExpStr) {
      return [
        ...input.matchAll(this.getRegExp(regExpStr)),
      ].map((match) => ({
        match: match[0],
        startPosition: match.index,
        endPosition: match.index + match[0].length,
      }));
    },
  },
  async run() {
    let count = 0;
    const resultMap = {};

    while (this[`key_${count}`]) {
      const input = this[`input_${count}`];
      const regExpStr = this[`regex_${count}`];

      const result = this.getResults(input, regExpStr);
      resultMap[this[`key_${count}`]] = result;

      count++;
    }

    return resultMap;
  },
};
