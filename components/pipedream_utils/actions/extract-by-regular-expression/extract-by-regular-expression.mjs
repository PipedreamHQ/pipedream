import buildRegExp from "../../common/text/buildRegExp.mjs";
import pipedream_utils from "../../pipedream_utils.app.mjs";
export default {
  name: "Formatting - [Text] Extract by Regular Expression",
  description: "Find a match for a regular expression pattern. Returns all matched groups with start and end position.",
  key: "pipedream_utils-extract-by-regular-expression",
  version: "0.0.7",
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
    input: {
      label: "Input",
      description: "Text you would like to find a pattern from",
      type: "string",
    },
    regExpString: {
      label: "Regular Expression",
      description: "Enter a string representing a [Regular Expression](https://www.w3schools.com/js/js_regexp.asp)",
      type: "string",
    },
  },
  methods: {
    getRegExp() {
      const { regExpString } = this;
      return regExpString.startsWith("/")
        ? buildRegExp(regExpString, [
          "g",
        ])
        : regExpString;
    },
    getResult(input) {
      return [
        ...input.matchAll(this.getRegExp()),
      ].map((match) => ({
        match: match[0],
        startPosition: match.index,
        endPosition: match.index + match[0].length,
      }));
    },
  },
  async run({ $ }) {
    const input = this.input;
    const result = this.getResult(input);
    $.export("$summary", result.length
      ? `Successfully found ${result.length} matches`
      : "No matches found");
    return result;
  },
};
