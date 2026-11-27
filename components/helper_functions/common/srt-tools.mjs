import {
  applyEdits,
  countChars,
  fixNumberingEdits,
  formatTime,
  lintSrt,
  normalizeTimestampEdits,
  parseSRT,
  visibleText,
  wrapLongLineEdits,
} from "./srt-engine.mjs";

export const ALL_SAFE_FIXES = [
  "renumber",
  "normalize_timestamps",
  "wrap_lines",
];

export function capsFromProps({
  maxCharsEn,
  maxCharsCjk,
  maxCpsEn,
  maxCpsCjk,
}) {
  const caps = {};
  if (maxCharsEn) {
    caps.maxCharsEn = maxCharsEn;
  }
  if (maxCharsCjk) {
    caps.maxCharsCjk = maxCharsCjk;
  }
  if (maxCpsEn) {
    caps.maxCpsEn = maxCpsEn;
  }
  if (maxCpsCjk) {
    caps.maxCpsCjk = maxCpsCjk;
  }
  return caps;
}

export function lintSrtDocument(srt, caps = {}) {
  const {
    issues,
    stats,
    parsed,
  } = lintSrt(srt, caps);
  return {
    stats,
    cues: parsed.cues.length,
    issues: issues.map((issue) => {
      return {
        severity: issue.severity,
        code: issue.code,
        cue: issue.cue,
        message: issue.message,
        range: issue.range,
        params: issue.params ?? null,
      };
    }),
  };
}

export function fixSrtDocument(srt, fixes = ALL_SAFE_FIXES, caps = {}) {
  const wanted = new Set(fixes.length
    ? fixes
    : ALL_SAFE_FIXES);
  let text = srt;
  const applied = [];

  const steps = [
    "normalize_timestamps",
    "wrap_lines",
    "renumber",
  ];
  for (const fix of steps) {
    if (!wanted.has(fix)) {
      continue;
    }
    const parsed = parseSRT(text);
    const edits = fix === "renumber"
      ? fixNumberingEdits(parsed)
      : fix === "normalize_timestamps"
        ? normalizeTimestampEdits(parsed)
        : wrapLongLineEdits(parsed, caps);
    if (edits.length) {
      text = applyEdits(text, edits);
    }
    applied.push({
      fix,
      edits: edits.length,
    });
  }

  const after = lintSrt(text, caps);
  return {
    srt: text,
    applied,
    remainingIssues: after.issues.length,
    stats: after.stats,
  };
}

export function srtStatsDocument(srt, caps = {}) {
  const {
    parsed,
    issues,
    stats,
  } = lintSrt(srt, caps);
  const cues = parsed.cues.map((cue, i) => {
    const durationMs =
      cue.start != null && cue.end != null && cue.end >= cue.start
        ? cue.end - cue.start
        : null;
    const chars = countChars(visibleText(cue.text || ""));
    const cps = durationMs && durationMs > 0 && chars > 0
      ? chars / (durationMs / 1000)
      : null;
    return {
      cue: i + 1,
      sourceIndex: cue.sourceIndex,
      startMs: cue.start,
      endMs: cue.end,
      durationMs,
      start: cue.start != null
        ? formatTime(cue.start)
        : null,
      end: cue.end != null
        ? formatTime(cue.end)
        : null,
      chars,
      cps,
    };
  });
  return {
    stats,
    issueCount: issues.length,
    cues,
  };
}

export const capProps = {
  maxCharsEn: {
    type: "integer",
    label: "Max characters per Latin line",
    description: "Default 42. Used for line-length warnings and wrap-line fixes.",
    optional: true,
    min: 1,
  },
  maxCharsCjk: {
    type: "integer",
    label: "Max characters per CJK line",
    description: "Default 16. Used for line-length warnings and wrap-line fixes.",
    optional: true,
    min: 1,
  },
  maxCpsEn: {
    type: "integer",
    label: "Max Latin characters per second",
    description: "Default 21. Reading-speed (CPS) warning threshold for Latin cues.",
    optional: true,
    min: 1,
  },
  maxCpsCjk: {
    type: "integer",
    label: "Max CJK characters per second",
    description: "Default 9. Reading-speed (CPS) warning threshold for CJK cues.",
    optional: true,
    min: 1,
  },
};
