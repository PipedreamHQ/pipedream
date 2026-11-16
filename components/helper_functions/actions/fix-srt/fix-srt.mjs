import helper_functions from "../../helper_functions.app.mjs";
import {
  ALL_SAFE_FIXES,
  capProps,
  capsFromProps,
  fixSrtDocument,
} from "../../common/srt-tools.mjs";

export default {
  key: "helper_functions-fix-srt",
  name: "Fix SRT Subtitles",
  description:
    "Apply safe, mechanical fixes to a SubRip (`.srt`) document: renumber cues, normalize timestamps to `HH:MM:SS,mmm`, and wrap long lines. Does not change overlaps, negative or zero duration, or high CPS — those need a human look. See the [SubRip format](https://en.wikipedia.org/wiki/SubRip).",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    helper_functions,
    srt: {
      type: "string",
      label: "SRT",
      description: "The full contents of a `.srt` file, not a path.",
    },
    fixes: {
      type: "string[]",
      label: "Fixes",
      description:
        "Which safe fixes to apply. Defaults to all three: `renumber`, `normalize_timestamps`, and `wrap_lines`.",
      optional: true,
      options: ALL_SAFE_FIXES,
    },
    ...capProps,
  },
  async run({ $ }) {
    const result = fixSrtDocument(
      this.srt,
      this.fixes,
      capsFromProps(this),
    );
    const editCount = result.applied.reduce((sum, item) => sum + item.edits, 0);
    $.export(
      "$summary",
      `Applied ${editCount} edit(s); ${result.remainingIssues} issue(s) remain`,
    );
    return result;
  },
};
