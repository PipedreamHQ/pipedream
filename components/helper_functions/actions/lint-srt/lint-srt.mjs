import helper_functions from "../../helper_functions.app.mjs";
import {
  capProps,
  capsFromProps,
  lintSrtDocument,
} from "../../common/srt-tools.mjs";

export default {
  key: "helper_functions-lint-srt",
  name: "Lint SRT Subtitles",
  description:
    "Lint a SubRip (`.srt`) subtitle document for cue numbering, timestamps, overlaps, reading speed (CPS), and line length. See the [SubRip format](https://en.wikipedia.org/wiki/SubRip). This is a no-auth helper; character counts use Unicode graphemes and ignore simple markup.",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    helper_functions,
    srt: {
      type: "string",
      label: "SRT",
      description: "The full contents of a `.srt` file, not a path.",
    },
    ...capProps,
  },
  async run({ $ }) {
    const result = lintSrtDocument(this.srt, capsFromProps(this));
    $.export(
      "$summary",
      `Linted ${result.cues} cue(s): ${result.stats.errors} error(s), ${result.stats.warnings} warning(s)`,
    );
    return result;
  },
};
