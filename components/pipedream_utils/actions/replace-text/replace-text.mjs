import buildRegExp from "../../common/text/buildRegExp.mjs";
import pipedream_utils from "../../pipedream_utils.app.mjs";
const MAX_REPLACES = 10000;
export default {
  name: "Formatting - [Text] Replace Text",
  description: "Replace all instances of any character, word or phrase in the text with another character, word or phrase.",
  key: "pipedream_utils-replace-text",
  version: "0.0.6",
  annotations: {
    destructiveHint: true,
    openWorldHint: false,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    pipedream_utils,
    input: {
      label: "Input",
      description: "Text you would like to find and replace values within.",
      type: "string",
    },
    findText: {
      label: "Find Text/Pattern",
      description: "The text you would like to search for and replace. This can also be a string representing a [Regular Expression](https://www.w3schools.com/js/js_regexp.asp)",
      type: "string",
    },
    replaceText: {
      label: "Replace Text",
      description: "Leave blank to delete the found text",
      type: "string",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      input, findText, replaceText,
    } = this;
    const isRegExp = findText.startsWith("/");
    const expression = isRegExp
      ? buildRegExp(findText, [
        "g",
      ])
      : findText;
    const replaceValue = replaceText ?? "";
    // replaceAll would be optimal, but it is not supported in Node 14.x
    let result = input.replace(expression, replaceValue);
    if (!isRegExp) {
      let counter = 0;
      while (result.match(expression)) {
        result = result.replace(expression, replaceValue);
        if (++counter > MAX_REPLACES) {
          throw new Error(`Over ${MAX_REPLACES} replace operations reached - please check your inputs and, if this is expected, search with a regular expression instead of text`);
        }
      }
    }
    const matchText = isRegExp
      ? [
        ...input.matchAll(expression),
      ].length
      : input.includes(findText) && "text";
    $.export("$summary", matchText
      ? `Successfully replaced ${matchText} matches`
      : "No matches found. Input was not modified");
    return result;
  },
};
