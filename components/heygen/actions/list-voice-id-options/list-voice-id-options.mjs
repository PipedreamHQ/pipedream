import heygen from "../../heygen.app.mjs";

export default {
  key: "heygen-list-voice-id-options",
  name: "List Voice ID Options",
  description: "Retrieves a page of available voices, whose `voice_id` can be used for Voice ID fields. Lists public voices by default; set **Voice Type** to `private` to list your own cloned voices, and use **Language** and **Gender** to narrow results instead of paging through every voice. If `has_more` is true, pass `next_token` as the Token to get the next page. Example: Language `Spanish`, Gender `female` and Limit `2` returns `{\"data\": [{\"voice_id\": \"voice_1\", \"name\": \"Anna\", \"language\": \"English\", \"gender\": \"female\"}, {\"voice_id\": \"voice_2\", \"name\": \"Marcus\", \"language\": \"English\", \"gender\": \"male\"}], \"has_more\": true, \"next_token\": \"abc\"}`. [See the documentation](https://developers.heygen.com/reference/list-voices)",
  version: "1.0.0",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    heygen,
    type: {
      propDefinition: [
        heygen,
        "voiceType",
      ],
    },
    language: {
      propDefinition: [
        heygen,
        "voiceLanguage",
      ],
    },
    gender: {
      propDefinition: [
        heygen,
        "voiceGender",
      ],
    },
    limit: {
      propDefinition: [
        heygen,
        "limit",
      ],
    },
    token: {
      propDefinition: [
        heygen,
        "token",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.heygen.listVoices({
      $,
      params: {
        type: this.type,
        language: this.language,
        gender: this.gender,
        limit: this.limit,
        token: this.token,
      },
    });
    const count = response.data?.length || 0;
    $.export("$summary", `Successfully retrieved ${count} voice${count === 1
      ? ""
      : "s"}`);
    return response;
  },
};
