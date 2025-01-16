# Overview

Gistly API allows you to fetch transcripts or subtitles from YouTube videos in various formats. It's a powerful tool for integrating video content into your applications, enabling you to process and analyze video transcripts programmatically.

- Instantly fetch transcripts from a library of billions of YouTube videos
- Extract accurate and time-stamped video transcripts for content analysis
- High performance and high availability API for bulk requests

# API Details

- **Endpoint**: `GET https://api.gist.ly/youtube/transcript`
- **Authorization**: Requires an API key in the Authorization header.
- **Parameters**:
  - `url` or `videoId`: Specify the YouTube video.
  - `text`: Boolean to return plain text transcript.
  - `chunkSize`: Maximum characters per transcript chunk (optional).

For more details, visit [Gistly's API documentation](https://gist.ly/youtube-transcript-api#doc).
