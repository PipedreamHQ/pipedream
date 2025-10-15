import elevenlabs from "../../elevenlabs.app.mjs";

export default {
  key: "elevenlabs-create-agent",
  name: "Create Agent",
  description: "Create an agent in Eleventlabs. [See the documentation](https://elevenlabs.io/docs/api-reference/agents/create-agent)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    elevenlabs,
    prompt: {
      type: "string",
      label: "Prompt",
      description: "The prompt for the agent",
    },
    name: {
      type: "string",
      label: "Name",
      description: "A name to make the agent easier to find",
      optional: true,
    },
    llm: {
      type: "string",
      label: "LLM",
      description: "The LLM to query with the prompt and the chat history",
      options: [
        "gpt-4o-mini",
        "gpt-4o",
        "gpt-4",
        "gpt-4-turbo",
        "gpt-3.5-turbo",
        "gemini-1.5-pro",
        "gemini-1.5-flash",
        "gemini-2.0-flash-001",
        "gemini-2.0-flash-lite",
        "gemini-1.0-pro",
        "claude-3-7-sonnet",
        "claude-3-5-sonnet",
      ],
      optional: true,
    },
    temperature: {
      type: "string",
      label: "Temperature",
      description: "The temperature for the LLM. Defaults to `0`",
      optional: true,
    },
    maxTokens: {
      type: "integer",
      label: "Max Tokens",
      description: "If greater than 0, maximum number of tokens the LLM can predict",
      optional: true,
    },
    firstMessage: {
      type: "string",
      label: "First Message",
      description: "If non-empty, the first message the agent will say. If empty, the agent waits for the user to start the discussion.",
      optional: true,
    },
    language: {
      type: "string",
      label: "Language",
      description: "Language of the agent - used for ASR and TTS. Defaults to `en`",
      optional: true,
    },
    maxDurationSeconds: {
      type: "integer",
      label: "Max Duration in Seconds",
      description: "The maximum duration of a conversation in seconds. Defaults to `600`",
      optional: true,
    },
    turnTimeout: {
      type: "string",
      label: "Turn Timeout",
      description: "Maximum wait time for the user’s reply before re-engaging the user. Defaults to `7`",
      optional: true,
    },
    voiceId: {
      propDefinition: [
        elevenlabs,
        "voiceId",
      ],
      description: "The voice ID to use for TTS",
      optional: true,
    },
    ttsModelId: {
      type: "string",
      label: "TTS Model ID",
      description: "The model to use for TTS",
      options: [
        "eleven_turbo_v2",
        "eleven_turbo_v2_5",
        "eleven_flash_v2",
        "eleven_flash_v2_5",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.elevenlabs.createAgent({
      $,
      data: {
        conversation_config: {
          conversation: {
            max_duration_seconds: this.maxDurationSeconds,
          },
          turn: {
            turn_timeout: this.turnTimeout && +this.turnTimeout,
          },
          agent: {
            first_message: this.firstMessage,
            language: this.language,
            prompt: {
              prompt: this.prompt,
              llm: this.llm,
              temperature: this.temperature && +this.temperature,
              max_tokens: this.maxTokens,
            },
          },
          tts: {
            voice_id: this.voiceId,
            model_id: this.ttsModelId,
          },
        },
        name: this.name,
      },
    });
    if (response?.agent_id) {
      $.export("$summary", `Successfully created agent with ID: ${response.agent_id}`);
    }
    return response;
  },
};
