# Overview

Check the current status of a Taodock video generation task (`queued`, `processing`, `completed`, `failed`, or `succeeded`).

# Example Use Cases

- Poll a task created by Create Video on a schedule until it completes, then download the result.
- Send a Slack alert when a long-running video task fails.

# Getting Started

Pass the `task_id` returned by the Create Video action. The response includes the normalized `task_id` and `status` fields alongside the full task payload.
