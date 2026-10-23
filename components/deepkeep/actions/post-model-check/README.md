# Overview

Check LLM output with DeepKeep before returning or forwarding it downstream.

# Example Use Cases

1. Stop unsafe model responses before sending them to Slack, email, webhooks, or databases.
2. Use `processedText` in downstream steps when DeepKeep returns redacted or modified text.

# Getting Started

Configure **Model** with your DeepKeep firewall ID and **Output** with the text to check.

# Troubleshooting

## Workflow Stopped

The action stops the workflow by default when DeepKeep returns a `block` action. Disable **Stop Workflow on Block** to return the verdict instead.
