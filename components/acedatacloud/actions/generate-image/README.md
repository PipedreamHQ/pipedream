# Overview

Submit one Seedream image generation request and return its `task_id` immediately. The action uses `async: true` and does not wait for the image. Run **Get Image Task** later to inspect the result.

# Getting Started

Choose Seedream 5.0 Lite or Pro, enter a prompt, and choose a size supported by that model. The default is Lite at `2K`. This action sends one paid submission request; save its `task_id` before continuing the workflow. Repeating submission after a network timeout may start a second job. Task lookup requires the separate server-side ownership gate described in the app README.

# Troubleshooting

`state: submitted` means the task was accepted. It does not mean the image is complete. If no task ID is returned, check task history before submitting again.
