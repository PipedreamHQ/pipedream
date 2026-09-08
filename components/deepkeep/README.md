# Overview

DeepKeep provides AI Firewall guardrails for checking model inputs and outputs before they continue through your workflow.

# Example Use Cases

1. Check a user prompt before sending it to OpenAI, Anthropic, Gemini, or another LLM provider.
2. Check a model response before sending it to Slack, email, a webhook, or a database.
3. Stop a workflow when DeepKeep returns a blocking guardrail action.
4. Use DeepKeep redacted or modified text in downstream workflow steps.

# Getting Started

Connect your DeepKeep account with:

- API Key
- Base URL for your DeepKeep instance, for example `https://api.example.deepkeep.ai`

Then add one of the DeepKeep actions to your workflow.

The actions use Pipedream's managed DeepKeep app connection for the API key and ask for the DeepKeep Base URL as an action field.

# Troubleshooting

## Missing Base URL

DeepKeep requires a base URL. Enter your DeepKeep instance URL without a trailing slash.

## Blocked Content

DeepKeep actions stop the workflow by default when the highest-priority guardrail action is `block`. Disable **Stop Workflow on Block** to return the blocked verdict instead.
