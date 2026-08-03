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
  userGroups: `
    query UserGroups($mine: Boolean) {
      user_groups(mine: $mine) {
        id
        name
        handle
        members {
          user_id
          first_name
          last_name
          email
        }
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
};
