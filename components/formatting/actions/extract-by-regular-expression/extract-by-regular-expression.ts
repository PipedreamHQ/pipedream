import { defineAction } from "@pipedream/types";
import buildRegExp from "../../common/text/buildRegExp";
import app from "../../app/formatting.app";

export default defineAction({
  name: "[Text] Extract by Regular Expression",
  description:
    "Find a match for a regular expression pattern. Returns all matched groups with start and end position.",
  key: "formatting-extract-by-regular-expression",
  version: "0.0.5",
  type: "action",
  props: {
    app,
    input: {
      label: "Input",
      description: "Text you would like to find a pattern from",
      type: "string",
    },
    regExpString: {
      label: "Regular Expression",
      description:
        "Enter a string representing a [Regular Expression](https://www.w3schools.com/js/js_regexp.asp)",
      type: "string",
    },
  },
  methods: {
    getRegExp(): string | RegExp {
      const { regExpString } = this;
      return regExpString.startsWith("/")
        ? buildRegExp(regExpString, [
          "g",
        ])
        : regExpString;
    },
    getResult(input: string) {
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
    const input: string = this.input;
    const result = this.getResult(input);

    $.export(
      "$summary",
      result.length
        ? `Successfully found ${result.length} matches`
        : "No matches found",
    );
    return result;
  },
});
