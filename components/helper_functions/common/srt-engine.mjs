/**
 * SRT lint engine (no dependencies). Ported from the MIT-licensed
 * SRT Subtitle Lint project by Stanley J.
 * https://github.com/todanley/srt-subtitle-checker
 */
const DEFAULTS = {
  maxEn: 42,
  maxCjk: 16,
  cpsEn: 21,
  cpsCjk: 9,
};
const CJK_RE = /[\u3400-\u9FFF\uF900-\uFAFF\u3040-\u30FF\u31F0-\u31FF\uAC00-\uD7AF\u3000-\u303F]/u;
const TS_RE = /^(\d{1,3}):(\d{1,2}):(\d{1,2})[,.:](\d{1,3})\s*-->\s*(\d{1,3}):(\d{1,2}):(\d{1,2})[,.:](\d{1,3})(?:\s+.*)?$/;
const TS_SHORT_RE = /^(\d{1,2}):(\d{1,2})[,.:](\d{1,3})\s*-->\s*(\d{1,2}):(\d{1,2})[,.:](\d{1,3})(?:\s+.*)?$/;
function countChars(str) {
  if (str == null || str === "") return 0;
  const s = String(str);
  if (typeof Intl !== "undefined" && Intl.Segmenter) {
    const seg = countChars._seg || (countChars._seg = new Intl.Segmenter("zh", {
      granularity: "grapheme",
    }));
    return [
      ...seg.segment(s),
    ].length;
  }
  return Array.from(s).length;
}
function stripTags(text) {
  return String(text).replace(/\{[^}]*\}/g, "")
    .replace(/<\/?[^>]+>/g, "");
}
function visibleText(text) {
  return stripTags(text).replace(/\n/g, "");
}
function isMostlyCjk(text) {
  const clean = stripTags(text);
  let cjk = 0;
  let other = 0;
  for (const ch of clean) {
    if (/\s/.test(ch)) continue;
    if (CJK_RE.test(ch)) cjk++;
    else other++;
  }
  if (cjk === 0 && other === 0) return false;
  return cjk >= other;
}
function lineLimit(line, maxEn, maxCjk) {
  return isMostlyCjk(line)
    ? maxCjk
    : maxEn;
}
function cpsLimit(text, maxEn, maxCjk) {
  return isMostlyCjk(text)
    ? maxCjk
    : maxEn;
}
function pad(n, w) {
  let s = String(n);
  while (s.length < w) s = "0" + s;
  return s;
}
function formatTime(ms) {
  if (!isFinite(ms) || ms < 0) ms = 0;
  ms = Math.round(ms);
  const h = Math.floor(ms / 36e5);
  ms -= h * 36e5;
  const m = Math.floor(ms / 6e4);
  ms -= m * 6e4;
  const s = Math.floor(ms / 1e3);
  const milli = ms - s * 1e3;
  return `${pad(h, 2)}:${pad(m, 2)}:${pad(s, 2)},${pad(milli, 3)}`;
}
function detectEol(text) {
  return text.includes("\r\n")
    ? "\r\n"
    : "\n";
}
function parseMs(h, m, s, ms) {
  const hh = Number(h);
  const mm = Number(m);
  const ss = Number(s);
  let frac = String(ms);
  while (frac.length < 3) frac = frac + "0";
  if (frac.length > 3) frac = frac.slice(0, 3);
  const milli = Number(frac);
  return {
    ms: hh * 36e5 + mm * 6e4 + ss * 1e3 + milli,
    h: hh,
    m: mm,
    s: ss,
    milli,
    rawOk: mm < 60 && ss < 60,
  };
}
function parseTimestampLine(line) {
  const t = String(line).trim();
  let m = t.match(TS_RE);
  if (m) {
    const a = parseMs(m[1], m[2], m[3], m[4]);
    const b = parseMs(m[5], m[6], m[7], m[8]);
    const normalized = `${formatTime(a.ms)} --> ${formatTime(b.ms)}`;
    const formatOdd = /[.]/.test(t) || !/^\d{2}:\d{2}:\d{2},\d{3}\s*-->\s*\d{2}:\d{2}:\d{2},\d{3}/.test(t);
    return {
      ok: true,
      start: a.ms,
      end: b.ms,
      startParts: a,
      endParts: b,
      normalized,
      formatOdd,
      raw: t,
    };
  }
  m = t.match(TS_SHORT_RE);
  if (m) {
    const a2 = parseMs("0", m[1], m[2], m[3]);
    const b2 = parseMs("0", m[4], m[5], m[6]);
    return {
      ok: true,
      start: a2.ms,
      end: b2.ms,
      startParts: a2,
      endParts: b2,
      normalized: `${formatTime(a2.ms)} --> ${formatTime(b2.ms)}`,
      formatOdd: true,
      raw: t,
    };
  }
  return {
    ok: false,
    raw: t,
  };
}
function splitBlocks(raw) {
  const ranges = [];
  const re = /\r?\n(?:[ \t]*\r?\n)+/g;
  let last = 0;
  let m;
  while (m = re.exec(raw)) {
    if (m.index > last) ranges.push({
      start: last,
      end: m.index,
    });
    last = m.index + m[0].length;
  }
  if (last < raw.length) ranges.push({
    start: last,
    end: raw.length,
  });
  return ranges;
}
function splitLines(block, blockStart) {
  const lines = [];
  const re = /\r?\n/g;
  let last = 0;
  let m;
  while (m = re.exec(block)) {
    lines.push({
      text: block.slice(last, m.index),
      range: {
        start: blockStart + last,
        end: blockStart + m.index,
      },
    });
    last = m.index + m[0].length;
  }
  lines.push({
    text: block.slice(last),
    range: {
      start: blockStart + last,
      end: blockStart + block.length,
    },
  });
  while (lines.length && lines[0].text.trim() === "") lines.shift();
  while (lines.length && lines[lines.length - 1].text.trim() === "") lines.pop();
  return lines;
}
function trimBlockRange(raw, range) {
  let {
    start, end,
  } = range;
  while (start < end && /[ \t]/.test(raw[start])) start++;
  while (end > start && /[ \t\r\n]/.test(raw[end - 1])) end--;
  return {
    start,
    end,
  };
}
function parseSRT(text) {
  const raw = String(text || "");
  const eol = detectEol(raw);
  const warnings = [];
  const head = raw.replace(/^\uFEFF/, "").trimStart()
    .slice(0, 20);
  if (/^WEBVTT/m.test(head)) {
    warnings.push({
      severity: "error",
      code: "webvtt",
      cue: null,
      message: "This looks like a WebVTT file. This extension checks SRT only.",
      range: {
        start: 0,
        end: Math.min(raw.length, 6),
      },
    });
  }
  const cues = [];
  const body = raw.replace(/^\uFEFF/, "");
  const bom = raw.length - body.length;
  for (const rawRange of splitBlocks(body)) {
    const range = {
      start: rawRange.start + bom,
      end: rawRange.end + bom,
    };
    const block = raw.slice(range.start, range.end);
    if (!block || !block.trim()) continue;
    const lines = splitLines(block, range.start);
    if (!lines.length) continue;
    let indexLine = null;
    let indexRange = null;
    let tsLine;
    let tsRange = null;
    let textLines = [];
    const first = lines[0].text.trim();
    const tsTry0 = parseTimestampLine(lines[0].text);
    const tsTry1 = lines.length > 1
      ? parseTimestampLine(lines[1].text)
      : {
        ok: false,
        raw: "",
      };
    if (tsTry0.ok) {
      tsLine = tsTry0;
      tsRange = lines[0].range;
      textLines = lines.slice(1);
    } else if (/^\d+$/.test(first) && tsTry1.ok) {
      indexLine = Number(first);
      indexRange = lines[0].range;
      tsLine = tsTry1;
      tsRange = lines[1].range;
      textLines = lines.slice(2);
    } else if (/^\d+$/.test(first)) {
      indexLine = Number(first);
      indexRange = lines[0].range;
      tsLine = {
        ok: false,
        raw: lines[1]
          ? lines[1].text
          : "",
      };
      tsRange = lines[1]
        ? lines[1].range
        : null;
      textLines = lines.slice(2);
    } else {
      tsLine = {
        ok: false,
        raw: lines[0].text,
      };
      tsRange = lines[0].range;
      textLines = lines.slice(1);
    }
    const text2 = textLines.map((l) => l.text).join("\n")
      .replace(/\s+$/, "");
    const textRange = textLines.length > 0
      ? {
        start: textLines[0].range.start,
        end: textLines[textLines.length - 1].range.end,
      }
      : null;
    cues.push({
      sourceIndex: indexLine,
      indexRange,
      ts: tsLine,
      tsRange,
      start: tsLine.ok
        ? tsLine.start
        : null,
      end: tsLine.ok
        ? tsLine.end
        : null,
      text: text2,
      textRange,
      lineRanges: textLines,
      blockRange: trimBlockRange(raw, range),
      rawBlock: block,
    });
  }
  return {
    cues,
    warnings,
    raw,
    eol,
  };
}
function serializeSRT(cues, eol = "\n") {
  const out = [];
  for (let i = 0; i < cues.length; i++) {
    const c = cues[i];
    const start = c.start != null
      ? formatTime(c.start)
      : "00:00:00,000";
    const end = c.end != null
      ? formatTime(c.end)
      : "00:00:00,000";
    const body = c.text == null
      ? ""
      : String(c.text);
    const bodyEol = body.replace(/\r\n/g, "\n").replace(/\r/g, "\n")
      .split("\n")
      .join(eol);
    out.push(`${i + 1}${eol}${start} --> ${end}${eol}${bodyEol}`);
  }
  return out.join(eol + eol) + (cues.length
    ? eol
    : "");
}
function msg(template, params) {
  return template.replace(
    /\{(\w+)\}/g,
    (_, k) => params[k] == null
      ? ""
      : String(params[k]),
  );
}
function analyze(parsed, opts = {}) {
  const maxEn = opts.maxEn != null
    ? Number(opts.maxEn)
    : DEFAULTS.maxEn;
  const maxCjk = opts.maxCjk != null
    ? Number(opts.maxCjk)
    : DEFAULTS.maxCjk;
  const cpsEn = opts.cpsEn != null
    ? Number(opts.cpsEn)
    : DEFAULTS.cpsEn;
  const cpsCjk = opts.cpsCjk != null
    ? Number(opts.cpsCjk)
    : DEFAULTS.cpsCjk;
  const issues = [];
  const cues = parsed.cues || [];
  for (const w of parsed.warnings || []) issues.push(w);
  let lastEnd = null;
  for (let j = 0; j < cues.length; j++) {
    const cue = cues[j];
    const num = j + 1;
    const fallback = cue.blockRange;
    if (cue.sourceIndex == null) {
      issues.push({
        severity: "error",
        code: "missingNumber",
        cue: num,
        message: msg("Cue {cue} is missing an index number.", {
          cue: num,
        }),
        range: cue.tsRange || fallback,
        data: {
          expected: num,
        },
      });
    } else if (cue.sourceIndex !== num) {
      issues.push({
        severity: "warn",
        code: "badNumber",
        cue: num,
        message: msg("Cue {cue} is numbered {got}, expected {expected}.", {
          cue: num,
          got: cue.sourceIndex,
          expected: num,
        }),
        range: cue.indexRange || fallback,
        params: {
          got: cue.sourceIndex,
          expected: num,
        },
        data: {
          expected: num,
        },
      });
    }
    if (!cue.ts || !cue.ts.ok) {
      const rawTs = cue.ts && cue.ts.raw
        ? cue.ts.raw
        : "";
      issues.push({
        severity: "error",
        code: "badTimestamp",
        cue: num,
        message: msg("Cue {cue} has an invalid timestamp{raw}.", {
          cue: num,
          raw: rawTs
            ? `: ${rawTs}`
            : "",
        }),
        range: cue.tsRange || fallback,
        params: {
          raw: rawTs,
        },
      });
    } else {
      if (cue.ts.formatOdd) {
        issues.push({
          severity: "warn",
          code: "tsFormat",
          cue: num,
          message: msg("Cue {cue} timestamp will be normalized to {normalized}.", {
            cue: num,
            normalized: cue.ts.normalized || "",
          }),
          range: cue.tsRange || fallback,
          params: {
            normalized: cue.ts.normalized || "",
          },
          data: {
            normalized: cue.ts.normalized || "",
          },
        });
      }
      if (!cue.ts.startParts.rawOk || !cue.ts.endParts.rawOk) {
        issues.push({
          severity: "error",
          code: "tsRange",
          cue: num,
          message: msg("Cue {cue} has minutes or seconds outside the 0\u201359 range.", {
            cue: num,
          }),
          range: cue.tsRange || fallback,
        });
      }
      if (cue.end < cue.start) {
        issues.push({
          severity: "error",
          code: "endBeforeStart",
          cue: num,
          message: msg("Cue {cue} ends before it starts.", {
            cue: num,
          }),
          range: cue.tsRange || fallback,
        });
      } else if (cue.end === cue.start) {
        issues.push({
          severity: "error",
          code: "zeroDuration",
          cue: num,
          message: msg("Cue {cue} has zero duration.", {
            cue: num,
          }),
          range: cue.tsRange || fallback,
        });
      }
      if (lastEnd != null && cue.start < lastEnd) {
        issues.push({
          severity: "error",
          code: "overlap",
          cue: num,
          message: msg("Cue {cue} overlaps cue {prev}.", {
            cue: num,
            prev: num - 1,
          }),
          range: cue.tsRange || fallback,
          params: {
            prev: num - 1,
          },
        });
      }
      lastEnd = cue.end;
      const vis = visibleText(cue.text || "");
      const chars = countChars(vis);
      const dur = (cue.end - cue.start) / 1e3;
      if (dur > 0 && chars > 0) {
        const cps = chars / dur;
        const cap = cpsLimit(cue.text || "", cpsEn, cpsCjk);
        if (cps > cap + 1e-9) {
          issues.push({
            severity: "warn",
            code: "cps",
            cue: num,
            message: msg(
              "Cue {cue} reading speed is {cps} CPS over the limit of {limit} ({chars} characters in {dur}s).",
              {
                cue: num,
                cps: Math.round(cps * 10) / 10,
                limit: cap,
                chars,
                dur: Math.round(dur * 100) / 100,
              },
            ),
            range: cue.textRange || cue.tsRange || fallback,
            params: {
              cps: Math.round(cps * 10) / 10,
              limit: cap,
              chars,
              dur: Math.round(dur * 100) / 100,
            },
          });
        }
      }
    }
    const body = cue.text || "";
    if (!body.trim()) {
      issues.push({
        severity: "warn",
        code: "empty",
        cue: num,
        message: msg("Cue {cue} has no text.", {
          cue: num,
        }),
        range: cue.tsRange || fallback,
      });
    }
    const rawLines = cue.lineRanges.length
      ? cue.lineRanges
      : body.split("\n").map((text) => ({
        text,
        range: cue.textRange || fallback,
      }));
    if (rawLines.length > 2) {
      issues.push({
        severity: "warn",
        code: "tooManyLines",
        cue: num,
        message: msg("Cue {cue} has {lines} lines; two is the usual maximum.", {
          cue: num,
          lines: rawLines.length,
        }),
        range: cue.textRange || fallback,
        params: {
          lines: rawLines.length,
        },
      });
    }
    for (let li = 0; li < rawLines.length; li++) {
      const line = rawLines[li];
      const visLine = stripTags(line.text);
      const len = countChars(visLine);
      const limit = lineLimit(line.text, maxEn, maxCjk);
      if (len > limit) {
        issues.push({
          severity: "warn",
          code: "longLine",
          cue: num,
          message: msg("Cue {cue} line {line} is {len} characters (limit {limit}).", {
            cue: num,
            line: li + 1,
            len,
            limit,
          }),
          range: line.range,
          params: {
            line: li + 1,
            len,
            limit,
            cjk: isMostlyCjk(line.text),
          },
          data: {
            maxEn,
            maxCjk,
          },
        });
      }
    }
  }
  const stats = {
    cues: cues.length,
    errors: issues.filter((x) => x.severity === "error").length,
    warnings: issues.filter((x) => x.severity === "warn").length,
    issues: issues.length,
  };
  if (cues.length && cues[0].start != null && cues[cues.length - 1].end != null) {
    stats.spanMs = Math.max(0, cues[cues.length - 1].end - cues[0].start);
  }
  return {
    issues,
    stats,
  };
}
function hardWrap(line, limit) {
  const chars = Array.from(line);
  const out = [];
  let cur = "";
  for (let i = 0; i < chars.length; i++) {
    const next = cur + chars[i];
    if (countChars(stripTags(next)) > limit && cur) {
      out.push(cur);
      cur = chars[i];
    } else {
      cur = next;
    }
  }
  if (cur) out.push(cur);
  return out;
}
function wrapLine(line, maxEn, maxCjk) {
  const limit = lineLimit(line, maxEn, maxCjk);
  const vis = stripTags(line);
  if (countChars(vis) <= limit) return [
    line,
  ];
  if (!isMostlyCjk(line) && / /.test(line)) {
    const words = line.split(/(\s+)/);
    const pieces = [];
    let cur = "";
    for (let i = 0; i < words.length; i++) {
      const next = cur + words[i];
      if (cur && countChars(stripTags(next)) > limit) {
        pieces.push(cur.replace(/\s+$/, ""));
        cur = words[i].replace(/^\s+/, "");
      } else {
        cur = next;
      }
    }
    if (cur) pieces.push(cur.replace(/\s+$/, ""));
    const expanded = [];
    for (const p of pieces) {
      if (countChars(stripTags(p)) <= limit) expanded.push(p);
      else expanded.push(...hardWrap(p, limit));
    }
    return expanded.filter((s) => s.length);
  }
  return hardWrap(line, limit);
}
function wrapCueText(text, maxEn, maxCjk) {
  const lines = String(text || "").split("\n");
  const out = [];
  for (const line of lines) out.push(...wrapLine(line, maxEn, maxCjk));
  return out.join("\n");
}
function fixNumberingEdits(parsed) {
  const edits = [];
  const eol = parsed.eol;
  parsed.cues.forEach((cue, i) => {
    const expected = String(i + 1);
    if (cue.sourceIndex == null) {
      const insertAt = cue.blockRange.start;
      edits.push({
        start: insertAt,
        end: insertAt,
        newText: expected + eol,
      });
    } else if (cue.sourceIndex !== i + 1 && cue.indexRange) {
      edits.push({
        start: cue.indexRange.start,
        end: cue.indexRange.end,
        newText: expected,
      });
    }
  });
  return edits.sort((a, b) => b.start - a.start);
}
function normalizeTimestampEdits(parsed, onlyCue) {
  const edits = [];
  parsed.cues.forEach((cue, i) => {
    if (onlyCue != null && i + 1 !== onlyCue) return;
    if (cue.ts && cue.ts.ok && cue.ts.formatOdd && cue.ts.normalized && cue.tsRange) {
      edits.push({
        start: cue.tsRange.start,
        end: cue.tsRange.end,
        newText: cue.ts.normalized,
      });
    }
  });
  return edits.sort((a, b) => b.start - a.start);
}
function wrapLongLineEdits(parsed, opts = {}, onlyRange) {
  const maxEn = opts.maxEn != null
    ? Number(opts.maxEn)
    : DEFAULTS.maxEn;
  const maxCjk = opts.maxCjk != null
    ? Number(opts.maxCjk)
    : DEFAULTS.maxCjk;
  const eol = parsed.eol;
  const edits = [];
  for (const cue of parsed.cues) {
    for (const line of cue.lineRanges) {
      if (onlyRange && (line.range.start !== onlyRange.start || line.range.end !== onlyRange.end)) {
        continue;
      }
      const limit = lineLimit(line.text, maxEn, maxCjk);
      if (countChars(stripTags(line.text)) <= limit) continue;
      const wrapped = wrapLine(line.text, maxEn, maxCjk);
      if (wrapped.length === 1 && wrapped[0] === line.text) continue;
      edits.push({
        start: line.range.start,
        end: line.range.end,
        newText: wrapped.join(eol),
      });
    }
  }
  return edits.sort((a, b) => b.start - a.start);
}
function applyEdits(text, edits) {
  const ordered = [
    ...edits,
  ].sort((a, b) => b.start - a.start || b.end - a.end);
  let out = text;
  for (const e of ordered) {
    out = out.slice(0, e.start) + e.newText + out.slice(e.end);
  }
  return out;
}
function lintSrt(text, opts = {}) {
  const parsed = parseSRT(text);
  const {
    issues, stats,
  } = analyze(parsed, opts);
  return {
    parsed,
    issues,
    stats,
  };
}
export {
  DEFAULTS,
  analyze,
  applyEdits,
  countChars,
  detectEol,
  fixNumberingEdits,
  formatTime,
  hardWrap,
  isMostlyCjk,
  lintSrt,
  normalizeTimestampEdits,
  parseSRT,
  parseTimestampLine,
  serializeSRT,
  stripTags,
  visibleText,
  wrapCueText,
  wrapLine,
  wrapLongLineEdits,
};
