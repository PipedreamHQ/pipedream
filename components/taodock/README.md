# Overview

[Taodock](https://taodock.com) provides a unified AI API for image and video generation. Use the Taodock integration on Pipedream to discover the models authorized for your API key, generate images and videos from prompts, track asynchronous video tasks, and download the finished files — combined with 3,000+ other apps in your workflows.

Available actions:

- **Generate Image** — create one or more images from a prompt (`POST /v1/images/generations`)
- **Create Video** — start an async video generation task and optionally wait for it (`POST /v1/videos`)
- **Get Video Status** — check a video task's current state (`GET /v1/videos/{id}`)
- **Download Video** — fetch the finished video file as base64 (`GET /v1/videos/{id}/content`)

# Getting Started

1. Create an API key in the [Taodock console](https://taodock.com/keys).
2. In Pipedream, add any Taodock action to a workflow and connect a new account with your API key.
3. Pick a model from the dropdown — the list is loaded live from your account, so it always reflects what your key can use. Model availability and pricing are dynamic; check the [model catalog](https://taodock.com/models) for current details.

A typical video flow is: **Create Video** (with *Wait for Completion* set to `0`) → a scheduled or delayed **Get Video Status** → **Download Video** once the status is `completed`.

# Troubleshooting

- **Model list is empty or image/video creation fails with `model_not_found`**: your Taodock account group has no available model channels. Check your Taodock console's model availability for your key group.
- **`401 Unauthorized`**: the API key is invalid or revoked. Create a fresh key in the Taodock console and reconnect.
- **Video tasks time out while waiting**: increase *Wait for Completion (seconds)*, or split the flow into Create Video → Get Video Status → Download Video with a delay between steps.
