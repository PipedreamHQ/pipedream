# Overview

Start an asynchronous Taodock video generation task from a text prompt. By default the action returns the task immediately; set **Wait for Completion (seconds)** to poll until the video is ready (or the timeout is reached).

# Example Use Cases

- Kick off video generation when a new brief arrives in a project management tool, then poll with Get Video Status.
- Generate short clips for social posts and notify the team when the task completes.
- Chain with Download Video to fetch the finished file once the status is `completed`.

# Getting Started

Connect your Taodock account, pick a video-capable model, and describe the video. Optional fields include duration, resolution, aspect ratio, first/last frame URLs, input video URL, negative prompt, audio, and seed.

# Troubleshooting

Video generation takes time. For long generations prefer **Wait for Completion = 0** and poll with **Get Video Status** from a scheduled step instead of blocking this action.
