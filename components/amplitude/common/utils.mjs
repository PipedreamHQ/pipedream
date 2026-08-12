// Shared helpers for Amplitude actions.

import { gunzipSync } from "node:zlib";

/**
 * Resolve after `ms` milliseconds.
 *
 * @param {number} ms - milliseconds to wait
 */
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Split one CSV line into fields, honoring double-quoted values (with `""`
 * as an escaped literal quote) per the format Amplitude's cohort download
 * actually returns (confirmed against the live API): a quoted-CSV header
 * row (e.g. `"amplitude_id","user_id"`) followed by quoted-CSV data rows.
 *
 * @param {string} line - one CSV line, without its trailing newline
 * @returns {string[]} the line's fields, quotes stripped
 */
const parseCsvLine = (line) => {
  const fields = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === "\"" && line[i + 1] === "\"") {
        field += "\"";
        i++;
      } else if (ch === "\"") {
        inQuotes = false;
      } else {
        field += ch;
      }
    } else if (ch === "\"") {
      inQuotes = true;
    } else if (ch === ",") {
      fields.push(field);
      field = "";
    } else {
      field += ch;
    }
  }
  fields.push(field);
  return fields;
};

/**
 * Parse a cohort download payload: quoted-CSV, header row first, one member
 * per subsequent row. Amplitude serves this gzip-compressed, but axios
 * auto-decompresses on receipt whenever `Content-Encoding: gzip` is set
 * (true both for the direct response and for the S3 URL a large-cohort
 * download redirects to) — so the bytes here are usually already plain
 * text. Gunzip only kicks in if the gzip magic header is still present, to
 * stay correct if that auto-decompression doesn't happen.
 *
 * @param {Buffer|ArrayBuffer} data - cohort download response body
 * @param {object} [opts]
 * @param {number} [opts.maxRecords] - stop building parsed records past this
 *   many data rows (the full row count is still reported via `totalCount`)
 * @returns {{records: object[], totalCount: number, truncated: boolean}}
 */
export const parseCohortDownload = (data, { maxRecords } = {}) => {
  const buffer = Buffer.isBuffer(data)
    ? data
    : Buffer.from(data);
  const isGzip = buffer.length > 2 && buffer[0] === 0x1f && buffer[1] === 0x8b;
  const text = (isGzip
    ? gunzipSync(buffer)
    : buffer
  ).toString("utf-8");
  const lines = text
    .split("\n")
    .map((line) => line.replace(/\r$/, ""))
    .filter((line) => line.length > 0);
  if (lines.length === 0) {
    return {
      records: [],
      totalCount: 0,
      truncated: false,
    };
  }
  const headers = parseCsvLine(lines[0]);
  const dataLines = lines.slice(1);
  const totalCount = dataLines.length;
  const limitedLines = maxRecords != null
    ? dataLines.slice(0, maxRecords)
    : dataLines;
  const records = limitedLines.map((line) => {
    const values = parseCsvLine(line);
    return Object.fromEntries(headers.map((header, i) => [
      header,
      values[i],
    ]));
  });
  return {
    records,
    totalCount,
    truncated: maxRecords != null && totalCount > maxRecords,
  };
};

/**
 * Return a shallow copy of `obj` containing only the requested field names
 * (plus `always`, which is force-included regardless of `names`) that are
 * present on the object.
 *
 * @param {object} obj - the source record
 * @param {string[]} names - field names to keep, besides `always`
 * @param {string[]} always - field names always kept if present
 * @returns {object} the plucked record
 */
export const pluck = (obj, names, always = []) => Object.fromEntries(
  [
    ...new Set([
      ...always,
      ...names,
    ]),
  ].filter((k) => k in obj).map((k) => [
    k,
    obj[k],
  ]),
);
