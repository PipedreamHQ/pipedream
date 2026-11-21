import assert from "node:assert/strict";
import test from "node:test";

const specs = [
  ["generate-song", { prompt: "spring" }, { action: "generate", custom: false, model: "acemusic-v1.1", prompt: "spring" }],
  ["generate-custom-song", { title: "Home", lyric: "Verse", style: "folk" }, { action: "generate", custom: true, model: "acemusic-v1.1", title: "Home", lyric: "Verse", style: "folk" }],
  ["import-mp3", { audio_url: "https://example.com/song.mp3" }, { action: "upload", audio_url: "https://example.com/song.mp3" }],
  ["cover-track", { audio_id: "one", style: "folk", lyric: "Verse" }, { action: "cover", model: "acemusic-v1.1", audio_id: "one", style: "folk", lyric: "Verse", audio_influence: 60 }],
  ["blend-tracks", { first_audio_id: "one", second_audio_id: "two", style: "folk", lyric: "Verse" }, { action: "mashup", model: "acemusic-v1.1", mashup_audio_ids: ["one", "two"], style: "folk", lyric: "Verse", audio_influence: 60 }],
];
for (const [name, values, expected] of specs) {
  test("registers and submits " + name + " once", async () => {
    const { default: component } = await import("../../actions/acemusic-" + name + "/acemusic-" + name + ".mjs");
    const calls = [];
    const result = await component.run.call({ ...values, acedatacloud: { request: async ({ path, data }) => {
      calls.push({ path, data: JSON.parse(JSON.stringify(data)) }); return { task_id: "saved" };
    } } }, { $: { export() {} } });
    assert.equal(result.state, "submitted");
    assert.equal(result.task_id, "saved");
    assert.deepEqual(calls, [{ path: "/acemusic/audios", data: { ...expected, async: true } }]);
  });
}
