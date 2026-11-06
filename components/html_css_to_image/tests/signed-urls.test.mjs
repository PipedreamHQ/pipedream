import assert from "node:assert/strict";
import nodeTest from "node:test";
import { createHmac } from "node:crypto";
import { ConfigurationError } from "@pipedream/platform";
import app from "../html_css_to_image.app.mjs";
import templateAction from "../actions/generate-signed-url-for-template/generate-signed-url-for-template.mjs";
import webpageAction from "../actions/generate-signed-url-for-webpage/generate-signed-url-for-webpage.mjs";

const makeHarness = (context) => {
  const fetch = context.mock.method(globalThis, "fetch", () => {
    throw new Error("Signing must never request an image or make an API call.");
  });
  const connection = {
    ...app.methods,
    $auth: {
      user_id: "test-id",
      api_key: "test-key",
    },
    _makeRequest() { throw new Error("Signing must never call the API."); },
  };
  const exports = [];
  const $ = {
    export: (key, value) => exports.push([
      key,
      value,
    ]),
  };
  return {
    exports,
    fetch,
    run: (action, props) => action.run.call({
      htmlCssToImageApp: connection,
      ...props,
    }, {
      $,
    }),
  };
};
const assertSignedOutput = (harness, result, route, format) => {
  assert.deepEqual(Object.keys(result), [
    "url",
  ]);
  const url = new URL(result.url);
  const query = url.search.slice(1);
  const token = createHmac("sha256", "test-key").update(query)
    .digest("hex");
  assert.equal(url.origin, "https://hcti.io");
  assert.equal(url.pathname, `${route}/${token}${format
    ? `/${format}`
    : ""}`);
  assert.ok(!result.url.includes("test-key"));
  assert.equal(harness.fetch.mock.callCount(), 0);
  assert.deepEqual(harness.exports, [
    [
      "$summary",
      "Signed URL generated. Image rendering has not been requested.",
    ],
  ]);
  return url;
};

nodeTest("signed template URL encodes typed values and pins version without any HTTP request", async (context) => {
  const harness = makeHarness(context);
  const result = await harness.run(templateAction, {
    templateId: "t-template",
    templateVersion: 1594409399761,
    templateValues: {
      title: "Hello & goodbye",
      price: 19.99,
      featured: false,
      tags: [
        "a",
        "b",
      ],
      author: {
        name: "Avery",
      },
    },
    format: "pdf",
  });
  const url = assertSignedOutput(harness, result, "/v1/image/t-template", "pdf");
  assert.equal(url.searchParams.get("template_version"), "1594409399761");
  assert.equal(url.searchParams.get("title"), "Hello & goodbye");
  assert.equal(url.searchParams.get("price"), "19.99");
  assert.equal(url.searchParams.get("featured"), "false");
  assert.deepEqual(JSON.parse(url.searchParams.get("tags")), [
    "a",
    "b",
  ]);
  assert.deepEqual(JSON.parse(url.searchParams.get("author")), {
    name: "Avery",
  });
});

nodeTest("signed template with no values omits the query and uses the default format", async (context) => {
  const harness = makeHarness(context);
  const result = await harness.run(templateAction, {
    templateId: "t-template",
    templateValues: {},
  });
  const url = assertSignedOutput(harness, result, "/v1/image/t-template");
  assert.equal(url.search, "");
});

nodeTest("signed webpage URL encodes supported rendering options and repeated headers locally", async (context) => {
  const harness = makeHarness(context);
  const result = await harness.run(webpageAction, {
    url: "https://example.com/page?q=hello&lang=en",
    css: "body { color: red; }",
    fullScreen: true,
    deviceScale: "1.5",
    viewportWidth: 1200,
    viewportHeight: 630,
    transparentBackground: false,
    msDelay: 0,
    headers: {
      "Authorization": "Bearer webpage-token",
      "X-Custom": "hello & goodbye",
    },
    additionalHeaderOrigins: [
      "https://api.example.com",
      "https://cdn.example.com",
    ],
    format: "webp",
    // Unsupported controls must not leak into the query even if passed directly.
    dedupeDurationS: 300,
    pdfPageWidth: "8.5in",
  });
  const url = assertSignedOutput(harness, result, "/v1/image/create-and-render/test-id", "webp");
  assert.equal(url.searchParams.get("url"), "https://example.com/page?q=hello&lang=en");
  assert.equal(url.searchParams.get("css"), "body { color: red; }");
  assert.equal(url.searchParams.get("full_screen"), "true");
  assert.equal(url.searchParams.get("device_scale"), "1.5");
  assert.equal(url.searchParams.get("viewport_width"), "1200");
  assert.equal(url.searchParams.get("viewport_height"), "630");
  assert.equal(url.searchParams.get("transparent_background"), "false");
  assert.equal(url.searchParams.get("ms_delay"), "0");
  assert.deepEqual(url.searchParams.getAll("headers"), [
    "Authorization:Bearer webpage-token",
    "X-Custom:hello & goodbye",
  ]);
  assert.deepEqual(url.searchParams.getAll("additional_header_origins"), [
    "https://api.example.com",
    "https://cdn.example.com",
  ]);
  assert.equal(url.searchParams.has("dedupe_duration_s"), false);
  assert.equal(url.searchParams.has("pdf_options"), false);
});

nodeTest("signed actions have distinct names, local annotations, and supported generated controls", () => {
  for (const action of [
    templateAction,
    webpageAction,
  ]) {
    assert.match(action.name, /Generate Signed URL for /);
    assert.deepEqual(action.annotations, {
      readOnlyHint: true,
      destructiveHint: false,
      openWorldHint: false,
    });
    assert.match(action.description, /does not create or render an image/);
    assert.match(action.description, /when the URL is first requested/);
  }
  for (const parameter of [
    "dedupeDurationS",
    "pdfPageWidth",
    "pdfMargins",
    "disableTwemoji",
  ]) {
    assert.ok(!(parameter in webpageAction.props));
  }
  assert.ok("url" in webpageAction.props);
  assert.ok("templateValues" in templateAction.props);
});

nodeTest("invalid signed inputs fail without a success summary or HTTP request", async (context) => {
  const harness = makeHarness(context);
  await assert.rejects(harness.run(templateAction, {
    templateId: "t-template",
    templateValues: [],
  }), ConfigurationError);
  await assert.rejects(harness.run(webpageAction, {
    url: "https://example.com",
    viewportWidth: 1200,
  }), ConfigurationError);
  assert.deepEqual(harness.exports, []);
  assert.equal(harness.fetch.mock.callCount(), 0);
});
