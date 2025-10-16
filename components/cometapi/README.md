# CometAPI Integration for Pipedream

This integration provides access to CometAPI's powerful AI models through Pipedream workflows. CometAPI offers access to various LLM models including GPT, Claude, Gemini, Grok, DeepSeek, and Qwen series.

## Features

- **Retrieve Available Models**: Get a list of all available models from CometAPI
- **Chat Completion**: Send conversational messages to AI models
- **Text Completion**: Generate text completions from prompts

## Authentication

To use this integration, you'll need a CometAPI API key:

1. Visit [CometAPI Console](https://api.cometapi.com/console/token)
2. Generate your API key
3. Add it to your Pipedream account in the CometAPI app configuration

## Supported Models

CometAPI provides access to state-of-the-art models including:

### GPT Series
- `gpt-5-chat-latest`
- `chatgpt-4o-latest`
- `gpt-5-mini`
- `gpt-4o-mini`

### Claude Series
- `claude-opus-4-1-20250805`
- `claude-sonnet-4-20250514`
- `claude-3-5-haiku-latest`

### Gemini Series
- `gemini-2.5-pro`
- `gemini-2.5-flash`
- `gemini-2.0-flash`

### Other Models
- Grok series (`grok-4-0709`, `grok-3`)
- DeepSeek series (`deepseek-v3.1`, `deepseek-chat`)
- Qwen series (`qwen3-30b-a3b`)

## Usage Examples

### Chat Completion
```javascript
// Example messages array for chat completion
[
  {
    "role": "system",
    "content": "You are a helpful assistant."
  },
  {
    "role": "user", 
    "content": "What is the capital of France?"
  }
]
```

### Text Completion
```javascript
// Simple prompt for text completion
"Once upon a time in a land far away"
```

## Configuration Options

### Common Parameters
- **Model**: Choose from available CometAPI models
- **Max Tokens**: Maximum number of tokens to generate (default: varies by model)
- **Temperature**: Controls randomness (0.0 = deterministic, 2.0 = very random)
- **Top P**: Nucleus sampling parameter (0.0 to 1.0)
- **Top K**: Limits vocabulary to top K tokens
- **Frequency Penalty**: Reduces repetition of frequent tokens
- **Presence Penalty**: Encourages discussing new topics
- **Seed**: For deterministic outputs

### Advanced Parameters
- **Stop**: Array of stop sequences
- **Stream**: Enable streaming responses (default: false)
- **Repetition Penalty**: Additional repetition control

## Error Handling

The integration includes comprehensive error handling:
- Authentication errors with clear messages
- API rate limit handling
- Invalid parameter validation
- Network timeout protection (5-minute default)

## Rate Limits

Please refer to [CometAPI Pricing](https://api.cometapi.com/pricing) for current rate limits and usage policies.

## Support

For CometAPI-specific issues:
- [CometAPI Documentation](https://api.cometapi.com/doc)
- [CometAPI Website](https://www.cometapi.com/)

For Pipedream integration issues:
- [Pipedream Community](https://pipedream.com/community)
- [Pipedream Documentation](https://pipedream.com/docs)

## License

This integration follows Pipedream's component licensing terms.
