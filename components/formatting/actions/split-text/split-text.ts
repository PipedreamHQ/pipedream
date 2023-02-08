import { defineAction } from "@pipedream/types";
import buildRegExp from "../../common/text/buildRegExp";

const INDEX_ALL = 999;

export default defineAction({
  name: "[Text] Split Text",
  description:
    "Split the text on a character or word and return one or all segments",
  key: "formatting-split-text",
  version: "0.0.1",
  type: "action",
  props: {
    input: {
      label: "Input",
      description: "Text you would like to split",
      type: "string",
    },
    separator: {
      label: "Separator",
      description:
        "Character or word separator to split the text on. This can also be a string representing a [Regular Expression](https://www.w3schools.com/js/js_regexp.asp)",
      type: "string",
    },
    segmentIndex: {
      label: "Segment Index",
      type: "integer",
      description:
        "Segment of text to return after splitting. Choose one of the options, or use a custom positive (*nth*-match) or negative (*nth-to-last* match) integer.",
      options: [
        {
          label: "First",
          value: INDEX_ALL * -1, // value should be 0, but that is not accepted - see issue #5429
        },
        {
          label: "Second",
          value: 1,
        },
        {
          label: "Last",
          value: -1,
        },
        {
          label: "Second to Last",
          value: -2,
        },
        {
          label: "All",
          value: INDEX_ALL,
        },
      ],
    },
  },
  async run({ $ }): Promise<string | string[]> {
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
      summary = `Successfully splitted text into ${length} segments`;

      switch (segmentIndex) {
      case INDEX_ALL:
        result = arrResults;
        break;

        // this case would not be needed if 0 was accepted as an option
        // see previous comment and issue #5429
      case INDEX_ALL * -1:
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
});
