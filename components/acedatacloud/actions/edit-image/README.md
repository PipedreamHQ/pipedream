# Overview

Submit one Seedream image edit using a publicly accessible HTTP or HTTPS image URL and an edit prompt. The action returns a `task_id` immediately; use **Get Image Task** for the final image.

# Getting Started

Enter one publicly accessible image URL, a prompt describing the edit, and a supported model and size. The default is Lite at `2K`. Save the returned `task_id` before continuing the workflow. Each submission may be billed separately. Task lookup requires the separate server-side ownership gate described in the app README.

# Troubleshooting

If submission times out, inspect task history before submitting again. An ambiguous HTTP result does not prove that no paid job was created.
