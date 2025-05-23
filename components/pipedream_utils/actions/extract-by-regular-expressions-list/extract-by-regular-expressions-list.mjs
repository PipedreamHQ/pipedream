import buildRegExp from "../../common/text/buildRegExp.mjs";
import pipedream_utils from "../../pipedream_utils.app.mjs";
export default {
  name: "Formatting - [Text] Extract by Regular Expressions List (Regex)",
  description: "Find matches for regular expressions. Returns all matched groups with start and end position.",
  key: "pipedream_utils-extract-by-regular-expressions-list",
  version: "0.0.1",
  type: "action",
  props: {
    pipedream_utils,
    input: {
      type: "string",
      label: "Input",
      description: "Text you would like to find a pattern from",
    },
    regExpStrings: {
      type: "string[]",
      label: "Regular Expressions",
      description: "An array of [regex strings](https://www.w3schools.com/js/js_regexp.asp) (e.g. `/foo/g`, `/bar/i`)",
    },
  },
  methods: {
    getAllResults(input) {
      const resultMap = {};
      const resultList = [];

      for (const rStr of this.regExpStrings) {
        if (typeof rStr !== "string" || !rStr.length) {
          // still push an empty array to preserve order
          resultMap[rStr] = [];
          resultList.push([]);
          continue;
        }

        const re = rStr.startsWith("/")
          ? buildRegExp(rStr, [
            "g",
          ])
          : new RegExp(rStr, "g");

        const matches = [
          ...input.matchAll(re),
        ].map((m) => ({
          match: m[0],
          groups: m.groups ?? {},
          startPosition: m.index,
          endPosition: m.index + m[0].length,
        }));

        resultMap[rStr] = matches;
        resultList.push(matches);
      }

      return {
        resultMap,
        resultList,
      };
    },
  },
  async run({ $ }) {
    const {
      resultMap,
      resultList,
    } = this.getAllResults(this.input);

    const totalMatches = resultList.reduce((sum, arr) => sum + arr.length, 0);

    $.export(
      "$summary",
      totalMatches
        ? `Found ${totalMatches} matches across ${Object.keys(resultMap).length} patterns`
        : "No matches found",
    );

    return {
      map: resultMap,
      list: resultList,
    };
  },
};
