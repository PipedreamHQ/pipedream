export default {
  listTranscripts: `
    query Transcripts($limit: Int, $skip: Int) {
      transcripts(limit: $limit, skip: $skip) {
        id
        title
      }
    }
  `,
  listTranscriptsByDate: `
    query Transcripts($fromDate: DateTime, $limit: Int, $skip: Int) {
      transcripts(fromDate: $fromDate, limit: $limit, skip: $skip) {
        id
        title
        transcript_url
        duration
        date
        audio_url
        video_url
        sentences {
          text
          start_time
          end_time
        }
        calendar_id
        summary {
          action_items
          keywords
          outline
          overview
          shorthand_bullet
        }
        user {
          user_id
          name
        }
      }
    }
  `,
  getTranscript: `
    query Transcript($transcriptId: String!) { 
      transcript(id: $transcriptId) { 
        id 
        title
        transcript_url
        duration
        date
        audio_url
        video_url
        sentences {
          text
          start_time
          end_time
        }
        calendar_id
        summary {
          action_items
          keywords
          outline
          overview
          shorthand_bullet
        }
        user {
          user_id
          name
        }
      } 
    }
  `,
  listUsers: `
    { 
      users { 
        name 
        user_id
      } 
    }
  `,
  getUser: `
    query User($userId: String!) {
      user(id: $userId) {
        name
        user_id
        recent_meeting
      }
    }
  `,
  channels: `
    {
      channels {
        id
        title
        is_private
      }
    }
  `,
  askfredThreads: `
    query AskfredThreads($transcriptId: String) {
      askfred_threads(transcript_id: $transcriptId) {
        id
        title
        transcript_id
        user_id
        created_at
      }
    }
  `,
  bite: `
    query Bite($biteId: ID!) {
      bite(id: $biteId) {
        id
        transcript_id
        name
        status
        summary
        summary_status
        start_time
        end_time
        media_type
        privacies
        thumbnail
        preview
        created_at
        user_id
        sources {
          src
          type
        }
        captions {
          index
          text
          speaker_id
          speaker_name
          start_time
          end_time
        }
        created_from {
          id
          name
          type
          description
          duration
        }
      }
    }
  `,
  // `captions` and `created_from` are deliberately omitted here — captions are
  // per-sentence, so including them on a 50-item list response would be enormous.
  // Use the `bite` query when the full detail is needed.
  bites: `
    query Bites($transcriptId: ID, $mine: Boolean, $myTeam: Boolean, $limit: Int, $skip: Int) {
      bites(transcript_id: $transcriptId, mine: $mine, my_team: $myTeam, limit: $limit, skip: $skip) {
        id
        transcript_id
        name
        status
        summary
        summary_status
        start_time
        end_time
        media_type
        privacies
        thumbnail
        preview
        created_at
        user_id
        sources {
          src
          type
        }
      }
    }
  `,
};
