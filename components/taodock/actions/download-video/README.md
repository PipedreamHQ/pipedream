# Overview

Download the finished video file of a completed Taodock video task. The action returns the file as base64 along with the file name, MIME type and byte size.

# Example Use Cases

- Download a completed video and upload it to Google Drive or S3.
- Attach the generated video to an email or a CMS asset.

# Getting Started

Pass the `task_id` of a task whose status is `completed` (see Get Video Status). For large videos, prefer decoding the base64 in a subsequent step that writes the file to storage.

# Troubleshooting

- **The action fails with a 4xx error**: the task is not completed yet or the task ID is wrong. Check the task state with Get Video Status first.
