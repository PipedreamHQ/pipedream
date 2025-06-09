import buildRegExp from "../../common/text/buildRegExp.mjs";
import pipedream_utils from "../../pipedream_utils.app.mjs";
export default {
  name: "Formatting - [Text] Extract by Regular Expressions List (Regex)",
  description: "Find matches for regular expressions. Returns all matched groups with start and end position.",
  key: "pipedream_utils-extract-by-regular-expressions-list",
  version: "0.1.0",
  type: "action",
  props: {
    pipedream_utils,
    alert: {
      type: "alert",
      alertType: "info",
      content: "Start by defining the keys you want to extract. Each key will have its own input and regex configuration.\nMake sure to Refresh the fields at the bottom after changing a configuration.",
    },
    keys: {
      type: "string[]",
      label: "Keys",
      description: "The list of keys to use for the result map",
      reloadProps: true,
    },
  },
  additionalProps() {
    const props = {};
    for (const key of this.keys) {
      if (this.isKeyValid(key)) {
        props[`${key}Input`] = {
          type: "string",
          label: `Input for: ${key}`,
          description: `The text you would like to find a pattern from for **${key}**`,
        };
        props[`${key}RegExp`] = {
          type: "string",
          label: `Regular Expression for: ${key}`,
          description: `[Regular expression](https://www.w3schools.com/js/js_regexp.asp) to use for **${key}**`,
        };
      }
    }
    return props;
  },
  methods: {
    isKeyValid(key) {
      return key?.trim().length;
    },
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
    const resultMap = {};

    for (const key of this.keys) {
      if (!this.isKeyValid(key)) continue;

      const input = this[`${key}Input`];
      const regExpStr = this[`${key}RegExp`];

      const result = this.getResults(input, regExpStr);
      resultMap[key] = result;
    }

    return resultMap;
  },
};
