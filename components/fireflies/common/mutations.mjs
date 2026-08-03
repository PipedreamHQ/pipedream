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
  setUserRole: `
    mutation SetUserRole($userId: String!, $role: Role!) {
      setUserRole(user_id: $userId, role: $role) {
        id
        name
        email
        role
        is_admin
      }
    }
  `,
};
