export default {
  uploadAudio: `
    mutation($input: AudioUploadInput) {
      uploadAudio(input: $input) {
        success
        title
        message
      }
    }
  `,
  createAskFredThread: `
    mutation CreateAskFredThread($input: CreateAskFredThreadInput!) {
      createAskFredThread(input: $input) {
        message {
          id
          thread_id
          query
          answer
          suggested_queries
          status
          created_at
        }
      }
    }
  `,
  continueAskFredThread: `
    mutation ContinueAskFredThread($input: ContinueAskFredThreadInput!) {
      continueAskFredThread(input: $input) {
        message {
          id
          thread_id
          query
          answer
          suggested_queries
          status
          created_at
        }
      }
    }
  `,
  updateMeetingTitle: `
    mutation UpdateMeetingTitle($input: UpdateMeetingTitleInput!) {
      updateMeetingTitle(input: $input) {
        title
      }
    }
  `,
  updateMeetingPrivacy: `
    mutation UpdateMeetingPrivacy($input: UpdateMeetingPrivacyInput!) {
      updateMeetingPrivacy(input: $input) {
        id
        title
        privacy
      }
    }
  `,
  updateMeetingChannel: `
    mutation UpdateMeetingChannel($input: UpdateMeetingChannelInput!) {
      updateMeetingChannel(input: $input) {
        id
        title
        channels {
          id
        }
      }
    }
  `,
  shareMeeting: `
    mutation ShareMeeting($input: ShareMeetingInput!) {
      shareMeeting(input: $input) {
        success
        message
      }
    }
  `,
  revokeSharedMeetingAccess: `
    mutation RevokeSharedMeetingAccess($input: RevokeSharedMeetingAccessInput!) {
      revokeSharedMeetingAccess(input: $input) {
        success
        message
      }
    }
  `,
  createLiveSoundbite: `
    mutation CreateLiveSoundbite($input: CreateLiveSoundbiteInput!) {
      createLiveSoundbite(input: $input) {
        success
      }
    }
  `,
  createBite: `
    mutation CreateBite(
      $transcriptId: ID!
      $startTime: Float!
      $endTime: Float!
      $name: String
      $mediaType: String
      $privacies: [String]
      $summary: String
    ) {
      createBite(
        transcript_id: $transcriptId
        start_time: $startTime
        end_time: $endTime
        name: $name
        media_type: $mediaType
        privacies: $privacies
        summary: $summary
      ) {
        id
        transcript_id
        name
        status
        summary
        start_time
        end_time
        media_type
        thumbnail
        preview
        created_at
      }
    }
  `,
  setUserRole: `
    mutation SetUserRole($userId: String!, $role: Role!) {
      setUserRole(user_id: $userId, role: $role) {
        user_id
        name
        email
        is_admin
      }
    }
  `,
};
