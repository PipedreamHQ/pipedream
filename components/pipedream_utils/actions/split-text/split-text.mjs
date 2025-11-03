import buildRegExp from "../../common/text/buildRegExp.mjs";
import {
  INDEX_ALL_SEGMENTS, SPLIT_TEXT_OPTIONS,
} from "../../common/text/splitTextOptions.mjs";
import pipedream_utils from "../../pipedream_utils.app.mjs";
export default {
  name: "Formatting - [Text] Split Text",
  description: "Split the text on a character or word and return one or all segments",
  key: "pipedream_utils-split-text",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    pipedream_utils,
    input: {
      label: "Input",
      description: "Text you would like to split",
      type: "string",
    },
    separator: {
      label: "Separator",
      description: "Character or word separator to split the text on. This can also be a string representing a [Regular Expression](https://www.w3schools.com/js/js_regexp.asp)",
      type: "string",
    },
    segmentIndex: {
      label: "Segment Index",
      type: "integer",
      description: "Segment of text to return after splitting. Choose one of the options, or use a custom positive (*nth*-match) or negative (*nth-to-last* match) integer.",
      options: SPLIT_TEXT_OPTIONS,
    },
  },
  async run({ $ }) {
    const {
      input, segmentIndex,
    } = this;
    let { separator } = this;
    if (separator.startsWith("/")) {
      const regExp = buildRegExp(separator);
      separator = input.match(regExp)?.[0];
    }
    let summary = "Separator not found - returned unmodified input";
    let result = input;
    const arrResults = input.split(separator);
    const { length } = arrResults;
    if (length > 1) {
      summary = `Successfully split text into ${length} segments`;
      switch (segmentIndex) {
      case INDEX_ALL_SEGMENTS:
        result = arrResults;
        break;
        // this case would not be needed if 0 was accepted as an option
        // see issue #5429
      case INDEX_ALL_SEGMENTS * -1:
        result = arrResults[0];
        break;
      default:
        result =
                        arrResults[segmentIndex < 0
                          ? length + segmentIndex
                          : segmentIndex];
        break;
      }
    }
    $.export("$summary", summary);
    return result;
  },
};
