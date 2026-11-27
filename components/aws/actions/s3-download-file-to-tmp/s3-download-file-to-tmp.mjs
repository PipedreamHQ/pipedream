import { pipeline } from "stream/promises";
import fs from "fs";
import path from "path";
import { ConfigurationError } from "@pipedream/platform";
import common from "../../common/common-s3.mjs";
import constants from "../../common/constants.mjs";
import {
  keyToRelativePath, mapWithConcurrency, toSingleLineString,
} from "../../common/utils.mjs";

const {
  MAX_DOWNLOAD_SIZE_BYTES, MAX_KEYS_PER_DOWNLOAD, DOWNLOAD_CONCURRENCY,
} = constants.s3;

export default {
  ...common,
  key: "aws-s3-download-file-to-tmp",
  name: "S3 - Download File to /tmp",
  description: toSingleLineString(`
    Downloads one or more files from S3 to the file-stash directory (\`/tmp/__stash\` when run by Pipedream) so later steps can read them.
    Pass up to ${MAX_KEYS_PER_DOWNLOAD} keys in \`objectKeys\` to download a whole batch in one call; they are fetched in parallel
    instead of one action call per file. Each key is saved under its own path, e.g. \`reports/2025/summary.pdf\`
    is saved to \`/tmp/__stash/reports/2025/summary.pdf\`, unless \`filePath\` is set (single file only).
    Returns one entry per key in \`files\` with \`status\` (\`success\` or \`error\`), \`filePath\`, \`size\`, \`stashed\` and, on failure, \`error\`;
    a file that could not be saved counts as failed. Zero-byte keys ending in \`/\` are folder placeholders, not files, and are reported as errors.
    A file's size is checked before it downloads, and files over 2 GB (the \`/tmp\` limit) are skipped. To find keys, run **S3 - List Objects**;
    it pages through large buckets, so don't assume one call shows every file.
    Example: \`objectKeys\` \`["invoices/jan.pdf", "invoices/feb.pdf"]\` returns
    \`{ "count": 2, "succeeded": 2, "failed": 0, "files": [{ "key": "invoices/jan.pdf", "status": "success", "filePath": "/tmp/__stash/invoices/jan.pdf", "size": 48213, "stashed": true }, { "key": "invoices/feb.pdf", "status": "success", "filePath": "/tmp/__stash/invoices/feb.pdf", "size": 51200, "stashed": true }] }\`.
    [See the documentation](https://docs.aws.amazon.com/AmazonS3/latest/API/API_GetObject.html)
  `),
  version: "0.1.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    aws: common.props.aws,
    region: common.props.region,
    bucket: common.props.bucket,
    objectKeys: {
      type: "string[]",
      label: "Keys",
      description: `The keys of the objects to download, up to ${MAX_KEYS_PER_DOWNLOAD} per call, e.g. \`["invoices/jan.pdf", "invoices/feb.pdf"]\`. Run **S3 - List Objects** to find keys (use its \`prefix\` and \`continuationToken\` to page through a large bucket).`,
      optional: true,
    },
    objectKey: {
      type: "string",
      label: "Key",
      description: "A single object key to download, e.g. `invoices/jan.pdf`. Kept for backwards compatibility: prefer `Keys` for new configurations. Run **S3 - List Objects** to find keys (the `key` field of each entry). If both are set, this key is downloaded along with the ones in `Keys`.",
      optional: true,
    },
    filePath: {
      type: "string",
      label: "Destination File Path",
      description: "Where to save the file, e.g. `/tmp/file.txt`. Only for a single key. Defaults to the key's path inside the file-stash directory, e.g. `/tmp/__stash/reports/2025/summary.pdf`. A path outside the stash directory still works, but the file is not uploaded to the stash, so it is only available during this run: the result then shows `stashed: false`.",
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  async run({ $ }) {
    const {
      bucket, objectKeys, objectKey, filePath,
    } = this;

    // The CRT signer is only needed for multi-region access point ARNs. Its native
    // module is slow to load on a cold start, so only pay for it in that case.
    if (/^arn:aws[\w-]*:s3::/.test(bucket)) {
      await import("@aws-sdk/signature-v4-crt");
    }

    const keys = [
      ...new Set([
        ...(objectKeys ?? []),
        ...(objectKey
          ? [
            objectKey,
          ]
          : []),
      ].filter((key) => typeof key === "string" && key)),
    ];

    if (!keys.length) {
      throw new ConfigurationError("Provide at least one key to download in `Keys` (or `Key`).");
    }
    if (keys.length > MAX_KEYS_PER_DOWNLOAD) {
      throw new ConfigurationError(`Received ${keys.length} keys, but at most ${MAX_KEYS_PER_DOWNLOAD} can be downloaded per call. Split them into batches of ${MAX_KEYS_PER_DOWNLOAD}.`);
    }
    if (filePath && keys.length > 1) {
      throw new ConfigurationError("`Destination File Path` can only be used when downloading a single key. Remove it to save each file under its own key path in `/tmp`.");
    }

    const stashDir = path.resolve(process.env.STASH_DIR || "/tmp");
    const isStashed = (target) => {
      const relative = path.relative(stashDir, target);
      // Only a leading `..` segment leaves the stash: a name like `..data.csv` is inside it
      return Boolean(relative)
        && relative.split(path.sep)[0] !== ".."
        && !path.isAbsolute(relative);
    };

    // Reserve each key's destination so two keys never share a path
    const usedPaths = new Set();
    const reservePath = (key) => {
      const target = filePath
        ? path.resolve(stashDir, filePath)
        : path.join(stashDir, keyToRelativePath(key) || "_");
      const {
        dir, name, ext,
      } = path.parse(target);
      let candidate = target;
      for (let n = 2; usedPaths.has(candidate); n++) {
        candidate = path.join(dir, `${name} (${n})${ext}`);
      }
      usedPaths.add(candidate);
      return candidate;
    };
    // 1. Check every object's size before downloading anything
    const heads = await mapWithConcurrency(keys, DOWNLOAD_CONCURRENCY, async (key) => {
      try {
        const { ContentLength: size } = await this.headObject({
          Bucket: bucket,
          Key: key,
        });
        // A zero-byte key ending in `/` is a folder placeholder, not a file: saving
        // it would create a file that blocks the folder real files need. (S3 keys are
        // flat, so a `/`-suffixed key that holds data is a real object.)
        if (key.endsWith("/") && size === 0) {
          return {
            error: `\`${key}\` is a folder placeholder, not a file. Run **S3 - List Objects** with \`recursive\` on to find the files inside it.`,
          };
        }
        return {
          size,
        };
      } catch (err) {
        return {
          error: `Could not read \`${key}\`: ${err?.name === "NotFound"
            ? "no object exists with that key"
            : err?.message ?? err}`,
        };
      }
    });

    // 2. Skip what can't fit in /tmp, keeping the total within its limit
    let plannedBytes = 0;
    const plan = keys.map((key, i) => {
      const head = heads[i];
      if (head.error) {
        return {
          key,
          error: head.error,
        };
      }
      // Reserved only for keys that will be saved, so a skipped key never takes a path
      const target = reservePath(key);
      if (head.size > MAX_DOWNLOAD_SIZE_BYTES) {
        return {
          key,
          error: `\`${key}\` is ${head.size} bytes, which exceeds the ${MAX_DOWNLOAD_SIZE_BYTES}-byte (2 GB) /tmp limit, so it cannot be downloaded.`,
        };
      }
      if (plannedBytes + head.size > MAX_DOWNLOAD_SIZE_BYTES) {
        return {
          key,
          error: `Skipped: downloading \`${key}\` (${head.size} bytes) would exceed the 2 GB /tmp limit for this run. Download it in a separate call.`,
        };
      }
      plannedBytes += head.size;
      return {
        key,
        target,
        size: head.size,
        stashed: isStashed(target),
      };
    });

    // 3. Download in parallel, one status entry per key
    const files = await mapWithConcurrency(plan, DOWNLOAD_CONCURRENCY, async (item) => {
      if (item.error) {
        return {
          key: item.key,
          status: "error",
          error: item.error,
        };
      }
      try {
        const { Body: data } = await this.getObject({
          Bucket: bucket,
          Key: item.key,
        });
        await fs.promises.mkdir(path.dirname(item.target), {
          recursive: true,
        });
        await pipeline(data, fs.createWriteStream(item.target));

        // A file counts as downloaded only once it is in the stash at full size
        const { size: written } = await fs.promises.stat(item.target);
        if (written !== item.size) {
          throw new Error(`Saved ${written} of ${item.size} bytes`);
        }
        return {
          key: item.key,
          status: "success",
          filePath: item.target,
          size: written,
          stashed: item.stashed,
        };
      } catch (err) {
        await fs.promises.rm(item.target, {
          force: true,
        }).catch(() => {});
        return {
          key: item.key,
          status: "error",
          error: `Failed to download \`${item.key}\`: ${err?.message ?? err}`,
        };
      }
    });

    const succeeded = files.filter(({ status }) => status === "success").length;
    const failed = files.length - succeeded;

    if (!succeeded) {
      throw new Error(`No files were downloaded. ${files.map(({ error }) => error).join(" ")}`);
    }

    $.export("$summary", failed
      ? `Downloaded ${succeeded} of ${files.length} files from S3 (${failed} failed)`
      : `Downloaded ${succeeded} file${succeeded === 1
        ? ""
        : "s"} from S3`);

    return {
      count: files.length,
      succeeded,
      failed,
      files,
      // kept for workflows written against the single-file version
      ...(files.length === 1 && {
        filePath: files[0].filePath,
      }),
    };
  },
};
