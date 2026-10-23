# Get Song

## Overview

Fetches one song generation by its **Generation ID**. The response includes the status (`queued`, `processing`, `succeeded` or `failed`) and, when the generation succeeded, the audio file URLs.

Use this action after **Generate Song** with **Wait for Completion** off, or when a workflow needs the current state of a generation later.

# Example Use Cases

1. Poll a generation on a schedule until its audio files are ready, then post them to a channel.
2. Re-check a failed generation to read the error details.

# Getting Started

1. Connect the Muziek maken met AI app with an API key from the [developer portal](https://muziekmakenmetai.nl/developers/).
2. Add the **Get Song** action and pass a generation ID, for example from the output of **Generate Song** or from a **New Song Ready** event.

# Troubleshooting

## Not found

The generation ID must be the `id` returned by **Generate Song** or a **New Song Ready** event. IDs from other services do not work.
