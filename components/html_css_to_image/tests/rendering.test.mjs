import assert from "node:assert/strict";
import nodeTest from "node:test";
import { ConfigurationError } from "@pipedream/platform";
import app from "../html_css_to_image.app.mjs";
import htmlAction from "../actions/create-image-from-html/create-image-from-html.mjs";
import urlAction from "../actions/create-image-from-url/create-image-from-url.mjs";
import templateAction from "../actions/create-image-from-template/create-image-from-template.mjs";
import listAction from "../actions/list-templates/list-templates.mjs";
import { buildRenderingOptions } from "../common/utils.mjs";

// Use the real platform axios serialization with an in-memory adapter: no network or credentials.
const makeHarness = (responses = [
  {
    id: "image-id",
    url: "https://hcti.io/v1/image/image-id",
  },
]) => {
  const requests = [];
  const exports = [];
  const connection = {
    ...app.methods,
    $auth: {
      user_id: "test-id",
      api_key: "test-key",
    },
    _getRequestParams(opts) {
      return {
        ...app.methods._getRequestParams.call(this, opts),
        adapter: async (config) => {
          requests.push({
            method: config.method,
            url: config.url,
            headers: config.headers.toJSON(),
            data: config.data
              ? JSON.parse(config.data)
              : undefined,
            params: config.params,
          });
          return {
            data: responses[requests.length - 1],
            status: 200,
            statusText: "OK",
            headers: {},
            config,
          };
        },
      };
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
    run: (action, props) => action.run.call({
      htmlCssToImageApp: connection,
      ...props,
    }, {
      $,
    }),
    connection,
    $,
  };
};

nodeTest("legacy HTML and URL inputs preserve request bodies and response shape", async () => {
  for (const [
    action,
    props,
  ] of [
      [
        htmlAction,
        {
          html: "<h1>Hello</h1>",
          css: "h1 { color: red; }",
        },
      ],
      [
        urlAction,
        {
          url: "https://example.com",
        },
      ],
    ]) {
    const harness = makeHarness();
    const response = await harness.run(action, props);
    assert.deepEqual(harness.requests[0].data, props);
    assert.equal(harness.requests[0].url, "https://hcti.io/v1/image");
    assert.equal(harness.requests[0].method, "post");
    assert.equal(harness.requests[0].headers.Authorization, `Basic ${Buffer.from("test-id:test-key").toString("base64")}`);
    assert.deepEqual(response, {
      id: "image-id",
      url: "https://hcti.io/v1/image/image-id",
    });
    assert.equal(harness.exports[0][0], "$summary");
  }
});

nodeTest("existing app method signatures remain supported", async () => {
  const harness = makeHarness();
  await harness.connection.createImageFromHTML(harness.$, "<div>Hello</div>");
  assert.deepEqual(harness.requests[0].data, {
    html: "<div>Hello</div>",
  });
});

nodeTest("HTML controls encode fonts, fractional scale, and explicit false and zero", async () => {
  const harness = makeHarness();
  await harness.run(htmlAction, {
    html: "<div>Hello</div>",
    googleFonts: [
      " Open Sans ",
      "Roboto",
      "Open Sans",
      "  ",
    ],
    deviceScale: "1.5",
    viewportWidth: 1200,
    viewportHeight: 630,
    msDelay: 0,
    dedupeDurationS: 0,
    disableTwemoji: false,
    transparentBackground: false,
    renderWhenReady: false,
    format: "webp",
  });
  assert.deepEqual(harness.requests[0].data, {
    html: "<div>Hello</div>",
    google_fonts: "Open+Sans|Roboto",
    device_scale: 1.5,
    viewport_width: 1200,
    viewport_height: 630,
    ms_delay: 0,
    dedupe_duration_s: 0,
    disable_twemoji: false,
    transparent_background: false,
    render_when_ready: false,
    format: "webp",
  });
});

nodeTest("URL controls map webpage headers without changing API authentication", async () => {
  const harness = makeHarness();
  await harness.run(urlAction, {
    url: "https://example.com",
    css: ".banner { display: none; }",
    fullScreen: true,
    blockConsentBanners: true,
    headers: {
      Authorization: "Bearer webpage-token",
    },
    additionalHeaderOrigins: [
      "https://api.example.com",
    ],
    includeHeadersOnSubrequests: false,
    identifyAsHcti: true,
    colorScheme: "dark",
    mediaType: "screen",
    timezone: "America/New_York",
  });
  assert.deepEqual(harness.requests[0].data, {
    url: "https://example.com",
    css: ".banner { display: none; }",
    full_screen: true,
    block_consent_banners: true,
    headers: {
      Authorization: "Bearer webpage-token",
    },
    additional_header_origins: [
      "https://api.example.com",
    ],
    include_headers_on_subrequests: false,
    identify_as_hcti: true,
    color_scheme: "dark",
    media_type: "screen",
    timezone: "America/New_York",
  });
  assert.notEqual(harness.requests[0].headers.Authorization, "Bearer webpage-token");
});

nodeTest("PDF controls serialize dimensions and ordered margins for either creation action", async () => {
  for (const [
    action,
    content,
  ] of [
      [
        htmlAction,
        {
          html: "<h1>Invoice</h1>",
        },
      ],
      [
        urlAction,
        {
          url: "https://example.com",
        },
      ],
    ]) {
    const harness = makeHarness();
    await harness.run(action, {
      ...content,
      format: "pdf",
      pdfPageWidth: "8.5in",
      pdfPageHeight: "11in",
      pdfMargins: [
        "0px",
        "1cm",
        "2mm",
        "0.5in",
      ],
      pdfScale: "0.75",
      pdfPrintBackground: false,
    });
    assert.deepEqual(harness.requests[0].data, {
      ...content,
      format: "pdf",
      pdf_options: {
        page_width: "8.5in",
        page_height: "11in",
        margins: [
          "0px",
          "1cm",
          "2mm",
          "0.5in",
        ],
        scale: 0.75,
        print_background: false,
      },
    });
  }
});

nodeTest("invalid pairs, scales, and PDF dimensions fail before any API request", async () => {
  for (const options of [
    {
      viewportWidth: 1200,
    },
    {
      viewportHeight: 630,
    },
    {
      jumboMaxWidth: 10000,
    },
    {
      jumboMaxHeight: 10000,
    },
    {
      deviceScale: "0",
    },
    {
      deviceScale: "NaN",
    },
    {
      deviceScale: "",
    },
    {
      pdfScale: "0.01",
    },
    {
      pdfScale: "3",
    },
    {
      pdfScale: "abc",
    },
    {
      pdfPageWidth: "8.5",
    },
    {
      pdfPageHeight: "-1in",
    },
    {
      pdfMargins: [
        "1cm",
      ],
    },
    {
      pdfMargins: [
        "1cm",
        "bad",
        "1cm",
        "1cm",
      ],
    },
  ]) {
    const harness = makeHarness();
    await assert.rejects(harness.run(htmlAction, {
      html: "<div>Hello</div>",
      ...options,
    }), ConfigurationError);
    assert.equal(harness.requests.length, 0);
  }
});

nodeTest("omitted and empty font controls add no Google Fonts or PDF options", () => {
  for (const props of [
    {},
    {
      googleFonts: [],
    },
    {
      googleFonts: [
        " ",
      ],
    },
  ]) {
    const options = JSON.parse(JSON.stringify(buildRenderingOptions(props)));
    assert.deepEqual(options, {});
  }
});

nodeTest("template creation preserves nested typed values and optional pinned version", async () => {
  for (const templateVersion of [
    undefined,
    1594409399761,
  ]) {
    const harness = makeHarness();
    const values = {
      title: "Hello",
      price: 19.99,
      featured: false,
      optional: null,
      items: [
        1,
        2,
      ],
      nested: {
        a: true,
      },
    };
    await harness.run(templateAction, {
      templateId: "t-template",
      templateValues: values,
      templateVersion,
      format: "pdf",
    });
    assert.equal(harness.requests[0].method, "post");
    assert.equal(harness.requests[0].url, templateVersion === undefined
      ? "https://hcti.io/v1/image/t-template"
      : `https://hcti.io/v1/image/t-template/${templateVersion}`);
    assert.deepEqual(harness.requests[0].data, {
      template_values: values,
      format: "pdf",
    });
  }
});

nodeTest("empty template object is accepted and invalid template values fail before requests", async () => {
  const harness = makeHarness();
  await harness.run(templateAction, {
    templateId: "t-template",
    templateValues: {},
  });
  assert.equal(harness.requests[0].url, "https://hcti.io/v1/image/t-template");
  assert.deepEqual(harness.requests[0].data, {
    template_values: {},
  });
  for (const templateValues of [
    undefined,
    null,
    [],
    "{}",
    42,
  ]) {
    const invalid = makeHarness();
    await assert.rejects(invalid.run(templateAction, {
      templateId: "t-template",
      templateValues,
    }), ConfigurationError);
    assert.equal(invalid.requests.length, 0);
  }
});

nodeTest("template listing uses max_version cursor and respects total result limit", async () => {
  const harness = makeHarness([
    {
      data: [
        {
          id: "t-1",
        },
        {
          id: "t-2",
        },
      ],
      pagination: {
        next_page_start: 12345,
      },
    },
    {
      data: [
        {
          id: "t-3",
        },
      ],
      pagination: {
        next_page_start: 12340,
      },
    },
  ]);
  assert.deepEqual(await harness.run(listAction, {
    maxResults: 3,
  }), [
    {
      id: "t-1",
    },
    {
      id: "t-2",
    },
    {
      id: "t-3",
    },
  ]);
  assert.deepEqual(harness.requests.map(({ params }) => params), [
    {
      count: 3,
    },
    {
      count: 1,
      max_version: 12345,
    },
  ]);
  assert.equal(harness.requests[0].url, "https://hcti.io/v1/template");
  assert.equal(harness.requests[0].method, "get");
});

nodeTest("template listing stops at the final page including an empty first page", async () => {
  for (const data of [
    [],
    [
      {
        id: "t-1",
      },
    ],
  ]) {
    const harness = makeHarness([
      {
        data,
        pagination: {
          next_page_start: null,
        },
      },
    ]);
    assert.deepEqual(await harness.run(listAction, {}), data);
    assert.equal(harness.requests.length, 1);
    assert.deepEqual(harness.requests[0].params, {
      count: 100,
    });
  }
});

nodeTest("API failures propagate without a success summary", async () => {
  const harness = makeHarness();
  const error = new Error("API quota exceeded");
  harness.connection._makeRequest = async () => { throw error; };
  await assert.rejects(harness.run(htmlAction, {
    html: "<div>Hello</div>",
  }), (result) => result === error);
  assert.deepEqual(harness.exports, []);
});
