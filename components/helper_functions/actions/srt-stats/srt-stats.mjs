import helper_functions from "../../helper_functions.app.mjs";
import {
  capProps,
  capsFromProps,
  srtStatsDocument,
} from "../../common/srt-tools.mjs";

export default {
  key: "helper_functions-srt-stats",
  name: "Get SRT Stats",
  description:
    "Summarise a SubRip (`.srt`) document: cue count, total on-screen duration, span, average and max characters-per-second, and a per-cue breakdown. See the [SubRip format](https://en.wikipedia.org/wiki/SubRip). Character counts use Unicode graphemes and ignore simple markup.",
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
    const result = srtStatsDocument(this.srt, capsFromProps(this));
    $.export(
      "$summary",
      `Counted ${result.stats.cues} cue(s) over ${result.stats.spanMs ?? 0} ms`,
    );
    return result;
  },
};
