# Generate Song

## Overview

Starts a song generation. Each generation costs 1 credit, regardless of the model.

Two modes are available:

- **Standard mode** (default): the **Prompt** describes the music you want, in max 500 characters. The vocals are generated in the **Language** you set (default `Nederlands`).
- **Custom mode**: the **Prompt** holds the full song lyrics (max 5,000 characters) and **Style** (required) describes genre, instruments, tempo and mood. The remaining options — vocal gender, weights, duration, variety, negative tags and personas — only apply in custom mode.

With **Wait for Completion** on (default), the action polls the generation every 10 seconds for up to 6 minutes and returns the final result, including the audio URLs when it succeeded. With it off, the action returns immediately with status `queued`; fetch the result later with **Get Song**.

# Example Use Cases

1. Turn new blog posts into a short jingle and post it to a team channel when it is ready.
2. Generate a personalized birthday song from a form submission and email the audio file.
3. Batch-produce radio spots from a spreadsheet of copy.

# Getting Started

1. Get an API key in the [developer portal](https://muziekmakenmetai.nl/developers/).
2. Connect the Muziek maken met AI app with that key.
3. Add the **Generate Song** action, write a prompt and run it. Check your credit balance first with **Get Account** — each generation costs 1 credit.

# Troubleshooting

## Insufficient credits

The generation fails when the account has no credits left. Top up via [muziekmakenmetai.nl](https://muziekmakenmetai.nl) and check the balance with **Get Account**.

## Generation still processing after 6 minutes

With **Wait for Completion** on, the action returns the latest known status when the song takes longer than 6 minutes. Run **Get Song** with the returned generation ID to fetch the final result.

## Style is required in custom mode

In custom mode the **Style** prop must describe the genre, instruments, tempo and mood; the **Prompt** is then used as the lyrics.
