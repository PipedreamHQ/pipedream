import assert from "node:assert/strict";
import { test } from "node:test";
import grain from "../../components/grain/grain.app.mjs";
import newRecording from "../../components/grain/sources/new-recording-instant/new-recording-instant.mjs";
import updatedRecording from "../../components/grain/sources/updated-recording-instant/updated-recording-instant.mjs";
import removedRecording from "../../components/grain/sources/removed-recording-instant/removed-recording-instant.mjs";
import newHighlight from "../../components/grain/sources/new-highlight-instant/new-highlight-instant.mjs";
import updatedHighlight from "../../components/grain/sources/updated-highlight-instant/updated-highlight-instant.mjs";
import removedHighlight from "../../components/grain/sources/removed-highlight-instant/removed-highlight-instant.mjs";
import newStory from "../../components/grain/sources/new-story-instant/new-story-instant.mjs";
import updatedStory from "../../components/grain/sources/updated-story-instant/updated-story-instant.mjs";
import removedStory from "../../components/grain/sources/removed-story-instant/removed-story-instant.mjs";
import listRecordings from "../../components/grain/actions/list-recordings/list-recordings.mjs";
import getRecording from "../../components/grain/actions/get-recording/get-recording.mjs";

// Run from the repository root: node --test scripts/tests/grain.test.mjs

const SOURCES = [
  {
    source: newRecording,
    event: "recording_added",
  },
  {
    source: updatedRecording,
    event: "recording_updated",
  },
  {
    source: removedRecording,
    event: "recording_deleted",
  },
  {
    source: newHighlight,
    event: "highlight_added",
  },
  {
    source: updatedHighlight,
    event: "highlight_updated",
  },
  {
    source: removedHighlight,
    event: "highlight_deleted",
  },
  {
    source: newStory,
    event: "story_added",
  },
  {
    source: updatedStory,
    event: "story_updated",
  },
  {
    source: removedStory,
    event: "story_deleted",
  },
];

function instantiate(source, props = {}) {
  const emitted = [];
  const db = new Map();
  return {
    ...source.methods,
    db,
    emitted,
    http: {
      endpoint: "https://example.com/hook",
    },
    $emit(body, metadata) {
      emitted.push({
        body,
        metadata,
      });
    },
    ...props,
  };
}

for (const {
  source, event,
} of SOURCES) {
  test(`${event}: subscribes to v2, emits its fixture, and removes its hook`, async () => {
    const requests = [];
    const deleted = [];
    const instance = instantiate(source, {
      grain: {
        async createWebhook(request) {
          requests.push(request.data);
          return {
            id: "hook-123",
          };
        },
        async deleteWebhook(id) {
          deleted.push(id);
        },
      },
    });
    assert.equal(source.version, "1.0.0");
    assert.equal(source.props.viewId, undefined);
    await source.hooks.deactivate.call(instance);
    assert.equal(deleted.length, 0);
    await source.hooks.activate.call(instance);
    assert.equal(requests[0].hook_type, event);
    assert.equal(requests[0].hook_url, instance.http.endpoint);
    assert.equal(requests[0].view_id, undefined);
    assert.equal(requests[0].actions, undefined);
    assert.equal(instance.db.get("hookId"), "hook-123");
    if (event.startsWith("story_") || event.endsWith("_deleted")) {
      assert.equal(requests[0].include, undefined);
    }

    const before = Date.now();
    await source.run.call(instance, {
      body: source.sampleEmit,
    });
    const after = Date.now();
    assert.equal(source.sampleEmit.type, event);
    assert.equal(instance.emitted.length, 1);
    assert.equal(instance.emitted[0].body, source.sampleEmit);
    const { metadata } = instance.emitted[0];
    assert.equal(metadata.id, source.sampleEmit.data.id);
    assert.ok(metadata.summary.includes(source.sampleEmit.data.id));
    if (event.endsWith("_added")) {
      const data = source.sampleEmit.data;
      assert.equal(metadata.ts, Date.parse(data.end_datetime ?? data.created_datetime));
    } else if (event === "story_updated") {
      assert.equal(metadata.ts, Date.parse(source.sampleEmit.data.last_edited_datetime));
    } else {
      assert.ok(metadata.ts >= before && metadata.ts <= after);
    }

    if (event.endsWith("_updated")) {
      // No resource-ID deduplication: successive edits and retries must reach the workflow.
      assert.equal(source.dedupe, undefined);
      for (const body of [
        source.sampleEmit,
        {
          ...source.sampleEmit,
          data: {
            ...source.sampleEmit.data,
            title: "Another edit",
          },
        },
      ]) {
        await source.run.call(instance, {
          body,
        });
      }
      assert.equal(instance.emitted.length, 3);
    } else {
      assert.equal(source.dedupe, "unique");
    }
    await source.hooks.deactivate.call(instance);
    assert.deepEqual(deleted, [
      "hook-123",
    ]);
  });
}

test("sources ignore reachability probes, malformed payloads, and other hook types", async () => {
  for (const { source } of SOURCES) {
    const instance = instantiate(source);
    for (const body of [
      undefined,
      null,
      {},
      {
        data: {},
      },
      {
        ...source.sampleEmit,
        type: "upload_status",
      },
    ]) {
      await source.run.call(instance, {
        body,
      });
    }
    assert.equal(instance.emitted.length, 0);
  }
});

test("events with missing or invalid timestamps fall back to receipt time", () => {
  for (const {
    source, event,
  } of SOURCES.filter(({ event }) => event.endsWith("_added") || event === "story_updated")) {
    const instance = instantiate(source);
    for (const value of [
      undefined,
      "invalid",
    ]) {
      const before = Date.now();
      const ts = instance.getTimestamp({
        data: {
          [event === "recording_added"
            ? "end_datetime"
            : event === "story_updated"
              ? "last_edited_datetime"
              : "created_datetime"]: value,
        },
      });
      assert.ok(ts >= before && ts <= Date.now());
    }
  }
});

test("recording and highlight hooks send only enabled include options", () => {
  for (const {
    source, event,
  } of SOURCES.filter(({ event }) => !event.endsWith("_deleted"))) {
    const instance = instantiate(source, {
      highlights: true,
      participants: false,
      aiSummary: true,
      calendarEvent: true,
      transcript: true,
      speakers: false,
    });
    if (event.startsWith("recording_")) {
      assert.deepEqual(instance.getInclude(), {
        highlights: true,
        calendar_event: true,
        ai_summary: true,
      });
    } else if (event.startsWith("highlight_")) {
      assert.deepEqual(instance.getInclude(), {
        transcript: true,
      });
    }
  }
});

test("failed hook creation does not store a hook ID", async () => {
  const { source } = SOURCES[0];
  const instance = instantiate(source, {
    grain: {
      async createWebhook() {
        throw new Error("Hook creation failed");
      },
    },
  });
  await assert.rejects(source.hooks.activate.call(instance), /Hook creation failed/);
  assert.equal(instance.db.get("hookId"), undefined);
});

test("transcript formats use the documented routes and preserve request context", () => {
  const $ = {};
  const instance = {
    _makeRequest: (request) => request,
  };
  for (const format of [
    "json",
    "txt",
    "vtt",
    "srt",
  ]) {
    const request = grain.methods.fetchTranscript.call(instance, {
      $,
      recordingId: "recording-123",
      format,
    });
    assert.equal(request.path, format === "json"
      ? "/recordings/recording-123/transcript"
      : `/recordings/recording-123/transcript.${format}`);
    assert.equal(request.$, $);
  }
});

test("list recordings follows cursors, forwards filters, and respects the result limit", async () => {
  const requests = [];
  const summaries = [];
  const pages = [
    {
      recordings: [
        {
          id: "1",
        },
        {
          id: "2",
        },
      ],
      cursor: "page-2",
    },
    {
      recordings: [
        {
          id: "3",
        },
        {
          id: "4",
        },
      ],
      cursor: "page-3",
    },
  ];
  const $ = {
    export: (key, value) => summaries.push([
      key,
      value,
    ]),
  };
  const result = await listRecordings.run.call({
    titleSearch: "All Hands",
    maxResults: 3,
    grain: {
      async listRecordings(request) {
        assert.equal(request.$, $);
        requests.push(request.data);
        return pages.shift();
      },
    },
  }, {
    $,
  });
  assert.deepEqual(result.map(({ id }) => id), [
    "1",
    "2",
    "3",
  ]);
  assert.equal(requests.length, 2);
  assert.equal(requests[0].cursor, undefined);
  assert.equal(requests[1].cursor, "page-2");
  assert.deepEqual(JSON.parse(JSON.stringify(requests[1].filter)), {
    title_search: "All Hands",
  });
  assert.deepEqual(summaries, [
    [
      "$summary",
      "Successfully fetched 3 recordings",
    ],
  ]);
});

test("list recordings returns an empty array and summary when no recordings match", async () => {
  const summaries = [];
  const result = await listRecordings.run.call({
    maxResults: 100,
    grain: {
      async listRecordings() {
        return {
          recordings: [],
          cursor: null,
        };
      },
    },
  }, {
    $: {
      export: (key, value) => summaries.push([
        key,
        value,
      ]),
    },
  });
  assert.deepEqual(result, []);
  assert.deepEqual(summaries, [
    [
      "$summary",
      "Successfully fetched 0 recordings",
    ],
  ]);
});

test("get recording forwards enabled include flags, returns the response, and exports a summary", async () => {
  const response = {
    id: "recording-123",
    title: "All Hands",
  };
  const summaries = [];
  const $ = {
    export: (key, value) => summaries.push([
      key,
      value,
    ]),
  };
  const result = await getRecording.run.call({
    recordingId: response.id,
    aiSummary: true,
    participants: false,
    screenshares: true,
    grain: {
      async fetchRecording(request) {
        assert.equal(request.$, $);
        assert.equal(request.recordingId, response.id);
        assert.deepEqual(request.data, {
          include: {
            ai_summary: true,
            screenshares: true,
          },
        });
        return response;
      },
    },
  }, {
    $,
  });
  assert.equal(result, response);
  assert.deepEqual(summaries, [
    [
      "$summary",
      "Successfully fetched recording with ID recording-123",
    ],
  ]);
});
