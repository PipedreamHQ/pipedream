// Shared helpers for Amplitude actions.

import { createGunzip } from "node:zlib";
import { PassThrough } from "node:stream";
import { createInterface } from "node:readline";

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
 * Peek at a readable stream's first bytes (without dropping any data) to
 * detect a gzip magic header, then return a stream that replays those
 * peeked bytes followed by the rest of the original stream. Amplitude's
 * cohort download is normally already decompressed by axios based on the
 * `Content-Encoding` response header before we ever see it (confirmed
 * against the live API — axios applies this transparently for both
 * buffered and streamed responses), so this is a defensive fallback, not
 * the common path.
 *
 * @param {import("stream").Readable} stream
 * @returns {Promise<{isGzip: boolean, stream: import("stream").Readable}>}
 */
const peekMagicBytes = (stream) => new Promise((resolve, reject) => {
  let peeked = Buffer.alloc(0);

  const cleanup = () => {
    stream.removeListener("readable", onReadable);
    stream.removeListener("end", onEnd);
    stream.removeListener("error", onError);
  };
  const finish = (ended) => {
    cleanup();
    const combined = new PassThrough();
    combined.write(peeked);
    // If the source already ended, its "end" event has already fired, so
    // piping it now would never forward that (already-past) end to
    // `combined`, hanging any downstream reader — end it directly instead.
    if (ended) {
      combined.end();
    } else {
      stream.pipe(combined);
    }
    resolve({
      isGzip: peeked.length >= 2 && peeked[0] === 0x1f && peeked[1] === 0x8b,
      stream: combined,
    });
  };

  // `stream.read()` can return an empty (non-null) buffer on "readable" —
  // e.g. for a trivially small/empty source — so draining in a loop here
  // and deciding completion from the *separate*, persistently-registered
  // "end" listener (not from a null read) is what makes this correct for
  // that case, since "end" can otherwise fire without another "readable".
  const onReadable = () => {
    let chunk = stream.read();
    while (chunk !== null) {
      peeked = Buffer.concat([
        peeked,
        chunk,
      ]);
      if (peeked.length >= 2) {
        break;
      }
      chunk = stream.read();
    }
    if (peeked.length >= 2) {
      finish(false);
    }
  };
  const onEnd = () => finish(true);
  const onError = (err) => {
    cleanup();
    reject(err);
  };

  stream.on("readable", onReadable);
  stream.once("end", onEnd);
  stream.once("error", onError);
});

/**
 * Parse a cohort download stream: quoted-CSV, header row first, one member
 * per subsequent row. Reads incrementally line-by-line via `readline`
 * instead of buffering the whole file into a string, a line array, and an
 * object array up front — only up to `maxRecords` parsed row objects are
 * ever held in memory at once. Rows beyond that cap are still counted (for
 * an accurate `totalCount`/`truncated`) but never parsed or retained.
 *
 * @param {import("stream").Readable} inputStream - cohort download response stream
 * @param {object} [opts]
 * @param {number} [opts.maxRecords] - stop retaining parsed records past this
 *   many data rows (the full row count is still reported via `totalCount`)
 * @returns {Promise<{records: object[], totalCount: number, truncated: boolean}>}
 */
export const parseCohortDownload = async (inputStream, { maxRecords } = {}) => {
  const {
    isGzip, stream,
  } = await peekMagicBytes(inputStream);
  const source = isGzip
    ? stream.pipe(createGunzip())
    : stream;
  const rl = createInterface({
    input: source,
    crlfDelay: Infinity,
  });

  let headers = null;
  const records = [];
  let totalCount = 0;
  for await (const line of rl) {
    if (line.length === 0) {
      continue;
    }
    if (headers === null) {
      headers = parseCsvLine(line);
      continue;
    }
    totalCount++;
    if (maxRecords == null || records.length < maxRecords) {
      const values = parseCsvLine(line);
      records.push(Object.fromEntries(headers.map((header, i) => [
        header,
        values[i],
      ])));
    }
  }

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
