import assert from "node:assert/strict";
import nodeTest from "node:test";
import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { createHmac } from "node:crypto";
import { createRequire } from "node:module";
import { ConfigurationError } from "@pipedream/platform";
import app from "../html_css_to_image.app.mjs";
import deleteAction from "../actions/delete-image/delete-image.mjs";
import downloadAction from "../actions/download-image/download-image.mjs";

const REQUIRE = createRequire(import.meta.url);
const PLATFORM_REQUIRE = createRequire(REQUIRE.resolve("@pipedream/platform"));
const AXIOS = PLATFORM_REQUIRE("axios");
const makeHarness = (context, {
  body = Buffer.from("image bytes"), contentType = "image/png", failRequest, failStream = false,
} = {}) => {
  const requests = [];
  const exports = [];
  const savedDirectories = [];
  context.after(async () => {
    for (const directory of savedDirectories) await fs.promises.rm(directory, {
      recursive: true,
      force: true,
    });
  });
  const adapter = async (config) => {
    requests.push({
      method: config.method,
      url: AXIOS.getUri(config),
      headers: config.headers.toJSON(),
      responseType: config.responseType,
      beforeRedirect: config.beforeRedirect,
    });
    if (failRequest) throw failRequest;
    const data = config.responseType === "stream"
      ? failStream
        ? Readable.from((async function* () { yield body; throw new Error("Download stream interrupted"); })())
        : Readable.from([
          body,
        ])
      : "";
    return {
      data,
      status: config.responseType === "stream"
        ? 200
        : 202,
      statusText: "OK",
      headers: {
        "content-type": contentType,
      },
      config,
    };
  };
  const connection = {
    ...app.methods,
    $auth: {
      user_id: "test-id",
      api_key: "test-key",
    },
    _getRequestParams(opts) {
      return {
        ...app.methods._getRequestParams.call(this, opts),
        adapter,
      };
    },
    downloadImage($, url) {
      return app.methods.downloadImage.call(this, $, url, {
        adapter,
      });
    },
  };
  const $ = {
    export: (key, value) => exports.push([
      key,
      value,
    ]),
  };
  return {
    requests,
    exports,
    async run(action, props) {
      const result = await action.run.call({
        htmlCssToImageApp: connection,
        ...props,
      }, {
        $,
      });
      if (result.filePath) savedDirectories.push(path.dirname(result.filePath));
      return result;
    },
  };
};

nodeTest("delete sends an authenticated request for one encoded ID and handles an empty accepted response", async (context) => {
  const harness = makeHarness(context);
  const result = await harness.run(deleteAction, {
    imageId: " image/with?characters ",
  });
  assert.deepEqual(result, {
    success: true,
    id: "image/with?characters",
  });
  assert.equal(harness.requests[0].method, "delete");
  assert.equal(harness.requests[0].url, "https://hcti.io/v1/image/image%2Fwith%3Fcharacters");
  assert.equal(harness.requests[0].headers.Authorization, `Basic ${Buffer.from("test-id:test-key").toString("base64")}`);
  assert.deepEqual(harness.exports, [
    [
      "$summary",
      "Deletion accepted for image image/with?characters",
    ],
  ]);
  assert.equal(deleteAction.annotations.destructiveHint, true);
});

nodeTest("delete rejects blank IDs before making a request", async (context) => {
  const harness = makeHarness(context);
  for (const imageId of [
    undefined,
    "",
    " ",
    null,
  ]) {
    await assert.rejects(harness.run(deleteAction, {
      imageId,
    }), ConfigurationError);
  }
  assert.deepEqual(harness.requests, []);
  assert.deepEqual(harness.exports, []);
});

nodeTest("delete propagates API failures without exporting success", async (context) => {
  const error = new Error("Image not found");
  const harness = makeHarness(context, {
    failRequest: error,
  });
  await assert.rejects(harness.run(deleteAction, {
    imageId: "missing-image",
  }), (result) => result === error);
  assert.deepEqual(harness.exports, []);
});

nodeTest("download streams exact bytes, returns file metadata, and does not send account credentials", async (context) => {
  const body = Buffer.from([
    0,
    255,
    10,
    42,
    99,
  ]);
  const harness = makeHarness(context, {
    body,
    contentType: "application/pdf; charset=binary",
  });
  const result = await harness.run(downloadAction, {
    imageUrl: "https://hcti.io/v1/image/invoice.pdf",
    fileName: "invoice.pdf",
  });
  assert.deepEqual(await fs.promises.readFile(result.filePath), body);
  assert.equal(result.fileName, "invoice.pdf");
  assert.equal(result.contentType, "application/pdf");
  assert.equal(result.size, body.length);
  assert.ok(result.filePath.startsWith("/tmp/hcti-download-"));
  assert.equal(harness.requests[0].method, "get");
  assert.equal(harness.requests[0].responseType, "stream");
  assert.equal(harness.requests[0].headers.Authorization, undefined);
  assert.equal(downloadAction.props.syncDir.accessMode, "write");
  assert.match(harness.exports[0][1], /Downloaded invoice.pdf/);
});

nodeTest("download keeps signed queries byte-for-byte, including repeated headers and percent encoding", async (context) => {
  const connection = {
    ...app.methods,
    $auth: {
      user_id: "test-id",
      api_key: "test-key",
    },
  };
  const signedUrl = connection.generateSignedUrlForWebpage({
    url: "https://example.com/page?q=a&lang=en",
    css: "body::before { content: \"a + b & c\"; }",
    headers: {
      "X-First": "a b",
      "X-Second": "c+d",
    },
    additional_header_origins: [
      "https://api.example.com",
      "https://cdn.example.com",
    ],
    format: "webp",
  });
  const harness = makeHarness(context, {
    contentType: "image/webp",
  });
  const result = await harness.run(downloadAction, {
    imageUrl: signedUrl,
  });
  assert.equal(harness.requests[0].url, signedUrl);
  const url = new URL(harness.requests[0].url);
  const token = createHmac("sha256", "test-key").update(url.search.slice(1))
    .digest("hex");
  assert.equal(url.pathname, `/v1/image/create-and-render/test-id/${token}/webp`);
  assert.equal(url.searchParams.getAll("headers").length, 2);
  assert.equal(harness.requests[0].headers.Authorization, undefined);
  assert.match(result.fileName, /\.webp$/);
});

nodeTest("download infers file extensions for image and PDF responses", async (context) => {
  for (const [
    contentType,
    extension,
  ] of [
      [
        "image/png",
        "png",
      ],
      [
        "image/jpeg",
        "jpg",
      ],
      [
        "image/webp",
        "webp",
      ],
      [
        "application/pdf",
        "pdf",
      ],
    ]) {
    const harness = makeHarness(context, {
      contentType,
    });
    const result = await harness.run(downloadAction, {
      imageUrl: "https://hcti.io/v1/image/image-id",
    });
    assert.match(result.fileName, new RegExp(`\\.${extension}$`));
  }
});

nodeTest("download rejects unsafe filenames, HTTP URLs, and disallowed hosts before requesting a render", async (context) => {
  const harness = makeHarness(context);
  for (const fileName of [
    "../image.png",
    "/tmp/image.png",
    "folder\\image.png",
    "..",
    ".",
    "",
    "\0bad",
  ]) {
    await assert.rejects(harness.run(downloadAction, {
      imageUrl: "https://hcti.io/v1/image/image-id",
      fileName,
    }), ConfigurationError);
  }
  for (const imageUrl of [
    "bad",
    "http://hcti.io/v1/image/image-id",
    "file:///tmp/image.png",
    "ftp://example.com/image.png",
    "https://user:password@example.com/image.png",
    "https://hcti.io.example.com/image.png",
    "https://hcti.io@evil.example/image.png",
    "https://evil.example/hcti.io/image.png",
    "https://cdn.hcti.io/image.png",
    "http://127.0.0.1/image.png",
    "http://169.254.169.254/latest/meta-data/",
    "https://hcti.io:8443/image.png",
    "https://user:password@hcti.io/image.png",
  ]) {
    await assert.rejects(harness.run(downloadAction, {
      imageUrl,
    }), ConfigurationError);
  }
  assert.deepEqual(harness.requests, []);
});

nodeTest("download redirect guard allows hcti.io and rejects other destinations", async (context) => {
  const harness = makeHarness(context);
  await harness.run(downloadAction, {
    imageUrl: "https://hcti.io/v1/image/image-id",
  });
  const { beforeRedirect } = harness.requests[0];
  assert.equal(typeof beforeRedirect, "function");
  assert.throws(() => beforeRedirect({
    protocol: "http:",
    hostname: "hcti.io",
    port: "80",
  }), ConfigurationError);
  assert.doesNotThrow(() => beforeRedirect({
    protocol: "https:",
    hostname: "hcti.io",
    port: "443",
  }));
  for (const hostname of [
    "evil.example",
    "hcti.io.example.com",
    "127.0.0.1",
    "169.254.169.254",
  ]) {
    assert.throws(() => beforeRedirect({
      protocol: "https:",
      hostname,
    }), ConfigurationError);
  }
  assert.throws(() => beforeRedirect({
    protocol: "https:",
    hostname: "hcti.io",
    port: "8443",
  }), ConfigurationError);
  assert.throws(() => beforeRedirect({
    protocol: "https:",
    hostname: "hcti.io",
    auth: "user:password",
  }), ConfigurationError);
});

nodeTest("downloads with the same filename use separate directories", async (context) => {
  const harness = makeHarness(context);
  const props = {
    imageUrl: "https://hcti.io/v1/image/image-id",
    fileName: "image.png",
  };
  const first = await harness.run(downloadAction, props);
  const second = await harness.run(downloadAction, props);
  assert.notEqual(first.filePath, second.filePath);
  assert.deepEqual(
    await fs.promises.readFile(first.filePath), await fs.promises.readFile(second.filePath),
  );
});

nodeTest("failed download streams remove partial files and export no success summary", async (context) => {
  const harness = makeHarness(context, {
    failStream: true,
  });
  let directory;
  const original = fs.promises.mkdtemp.bind(fs.promises);
  context.mock.method(fs.promises, "mkdtemp", async (prefix) => { directory = await original(prefix); return directory; });
  await assert.rejects(harness.run(downloadAction, {
    imageUrl: "https://hcti.io/v1/image/image-id",
  }), /Download stream interrupted/);
  assert.ok(directory);
  await assert.rejects(fs.promises.stat(directory), {
    code: "ENOENT",
  });
  assert.deepEqual(harness.exports, []);
});

nodeTest("download HTTP failures propagate before creating a file", async (context) => {
  const error = new Error("Image not found");
  const harness = makeHarness(context, {
    failRequest: error,
  });
  await assert.rejects(harness.run(downloadAction, {
    imageUrl: "https://hcti.io/v1/image/missing-image",
  }), (result) => result === error);
  assert.deepEqual(harness.exports, []);
});
