# Overview

**Get YouTube Transcript** returns the transcript for one or more YouTube videos, plus caption lines with start, duration and end times when you ask for them. You can pass video links or ids, search keywords, or a channel's latest videos.

The action runs the Apify Actor `vncntlabs/youtube-transcript-scraper` and returns one dataset row per video. A channel request also adds a short summary row for that channel. Videos with no captions are not charged.

# Example Use Cases

- Save a transcript before you summarize a video or quote it.
- Pull transcripts for the top search results of a keyword.
- Transcribe the latest videos from a channel.

# Getting Started

1. Connect an Apify account in Pipedream. Create the API token in the Apify Console under Settings, then Integrations. See [Apify API tokens](https://docs.apify.com/platform/integrations/api).
2. Add **Get YouTube Transcript** to a workflow.
3. Provide at least one video, keyword, or channel.

Video values can be a watch link, a `youtu.be` link, a Shorts link, an embed link, a live link, or the 11-character video id. Channels can be an `@handle`, a channel link, or a channel id that starts with `UC`.

# Troubleshooting

- **Nothing was transcribed.** Provide at least one video, keyword, or channel. A keyword search uses the country you set (the default is United States).
- **A video has no transcript.** The row status is `no_captions` when that video has no caption track in the language you asked for. Those rows are not charged. Leave language empty to use the video's own language.
- **The run timed out.** The synchronous wait ends at about 300 seconds. Standard pace is usually within 1 to 2 minutes per 100 videos. Lower the maximum videos, or split the batch. Fast mode is billed as its own transcript event.
- **Shorts showed up.** Turn on skip Shorts to leave them out of keyword and channel results.
