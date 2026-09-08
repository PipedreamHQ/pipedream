# Overview

Check arbitrary text with DeepKeep using either pre-model or post-model moderation.

# Example Use Cases

1. Test a DeepKeep firewall from Pipedream without building a full LLM workflow.
2. Moderate non-LLM text before forwarding it to another app.
3. Use one generic DeepKeep action when the workflow decides the moderation phase dynamically.

# Getting Started

Choose **Moderation Phase**, set **Model** to your DeepKeep firewall ID, and provide **Text**.

# Troubleshooting

## Workflow Stopped

The action stops the workflow by default when DeepKeep returns a `block` action. Disable **Stop Workflow on Block** to return the verdict instead.
