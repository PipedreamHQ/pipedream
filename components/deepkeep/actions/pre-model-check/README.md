# Overview

Check user or workflow input with DeepKeep before sending it to an LLM.

# Example Use Cases

1. Stop unsafe prompts before an OpenAI, Anthropic, or Gemini step.
2. Use `processedText` in a downstream LLM step when DeepKeep returns redacted or modified text.

# Getting Started

Configure **Model** with your DeepKeep firewall ID and **Input** with the text to check.

# Troubleshooting

## Workflow Stopped

The action stops the workflow by default when DeepKeep returns a `block` action. Disable **Stop Workflow on Block** to return the verdict instead.
