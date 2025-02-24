export default {
  "id": "id",
  "orgId": "orgId",
  "createdAt": "2024-01-15T09:30:00Z",
  "updatedAt": "2024-01-15T09:30:00Z",
  "type": "inboundPhoneCall",
  "costs": [
    {
      "type": "analysis",
      "analysisType": "summary",
      "completionTokens": 1.1,
      "cost": 1.1,
      "model": {
        "key": "value"
      },
      "promptTokens": 1.1
    }
  ],
  "messages": [
    {
      "role": "role",
      "message": "message",
      "time": 1.1,
      "endTime": 1.1,
      "secondsFromStart": 1.1
    }
  ],
  "phoneCallProvider": "twilio",
  "phoneCallTransport": "sip",
  "status": "queued",
  "endedReason": "assistant-not-invalid",
  "destination": {
    "type": "sip",
    "sipUri": "destination",
    "description": "destination",
    "message": "destination",
    "sipHeaders": {
      "key": "value"
    },
    "transferPlan": {
      "mode": "blind-transfer"
    }
  },
  "startedAt": "2024-01-15T09:30:00Z",
  "endedAt": "2024-01-15T09:30:00Z",
  "cost": 1.1,
  "costBreakdown": {
    "transport": 1.1,
    "stt": 1.1,
    "llm": 1.1,
    "tts": 1.1,
    "vapi": 1.1,
    "total": 1.1,
    "llmPromptTokens": 1.1,
    "llmCompletionTokens": 1.1,
    "ttsCharacters": 1.1
  },
  "artifactPlan": {
    "recordingEnabled": true,
    "videoRecordingEnabled": false,
    "transcriptPlan": {
      "enabled": true
    },
    "recordingPath": "recordingPath"
  },
  "analysis": {
    "summary": "summary",
    "structuredData": {
      "key": "value"
    },
    "successEvaluation": "successEvaluation"
  },
  "monitor": {
    "listenUrl": "listenUrl",
    "controlUrl": "controlUrl"
  },
  "artifact": {
    "messages": [
      {
        "role": "role",
        "message": "message",
        "time": 1.1,
        "endTime": 1.1,
        "secondsFromStart": 1.1
      }
    ],
    "messagesOpenAIFormatted": [
      {
        "role": "assistant"
      }
    ],
    "recordingUrl": "recordingUrl",
    "stereoRecordingUrl": "stereoRecordingUrl",
    "videoRecordingUrl": "videoRecordingUrl",
    "videoRecordingStartDelaySeconds": 1.1,
    "transcript": "transcript"
  },
  "transport": {
    "provider": "twilio",
    "assistantVideoEnabled": true
  },
  "phoneCallProviderId": "phoneCallProviderId",
  "assistantId": "assistantId",
  "assistant": {
    "transcriber": {
      "provider": "talkscriber"
    },
    "model": {
      "provider": "xai",
      "model": "grok-beta"
    },
    "voice": {
      "provider": "tavus",
      "voiceId": "r52da2535a"
    },
    "firstMessage": "Hello! How can I help you today?",
    "firstMessageMode": "assistant-speaks-first",
    "hipaaEnabled": false,
    "clientMessages": [
      "conversation-update",
      "function-call",
      "hang",
      "model-output",
      "speech-update",
      "status-update",
      "transfer-update",
      "transcript",
      "tool-calls",
      "user-interrupted",
      "voice-input"
    ],
    "serverMessages": [
      "conversation-update",
      "end-of-call-report",
      "function-call",
      "hang",
      "speech-update",
      "status-update",
      "tool-calls",
      "transfer-destination-request",
      "user-interrupted"
    ],
    "silenceTimeoutSeconds": 30,
    "maxDurationSeconds": 600,
    "backgroundSound": "off",
    "backgroundDenoisingEnabled": false,
    "modelOutputInMessagesEnabled": false,
    "transportConfigurations": [
      {
        "provider": "twilio",
        "timeout": 60,
        "record": false
      }
    ],
    "credentials": [
      {
        "provider": "xai",
        "apiKey": "credentials"
      }
    ],
    "name": "name",
    "voicemailDetection": {
      "provider": "twilio"
    },
    "voicemailMessage": "voicemailMessage",
    "endCallMessage": "endCallMessage",
    "endCallPhrases": [
      "endCallPhrases"
    ],
    "metadata": {
      "key": "value"
    },
    "artifactPlan": {
      "recordingEnabled": true,
      "videoRecordingEnabled": false
    },
    "startSpeakingPlan": {
      "waitSeconds": 0.4,
      "smartEndpointingEnabled": false
    },
    "stopSpeakingPlan": {
      "numWords": 0,
      "voiceSeconds": 0.2,
      "backoffSeconds": 1
    },
    "monitorPlan": {
      "listenEnabled": false,
      "controlEnabled": false
    },
    "credentialIds": [
      "credentialIds"
    ],
    "server": {
      "url": "url",
      "timeoutSeconds": 20
    }
  },
  "assistantOverrides": {
    "transcriber": {
      "provider": "talkscriber"
    },
    "model": {
      "provider": "xai",
      "model": "grok-beta"
    },
    "voice": {
      "provider": "tavus",
      "voiceId": "r52da2535a"
    },
    "firstMessage": "Hello! How can I help you today?",
    "firstMessageMode": "assistant-speaks-first",
    "hipaaEnabled": false,
    "clientMessages": [
      "conversation-update",
      "function-call",
      "hang",
      "model-output",
      "speech-update",
      "status-update",
      "transfer-update",
      "transcript",
      "tool-calls",
      "user-interrupted",
      "voice-input"
    ],
    "serverMessages": [
      "conversation-update",
      "end-of-call-report",
      "function-call",
      "hang",
      "speech-update",
      "status-update",
      "tool-calls",
      "transfer-destination-request",
      "user-interrupted"
    ],
    "silenceTimeoutSeconds": 30,
    "maxDurationSeconds": 600,
    "backgroundSound": "off",
    "backgroundDenoisingEnabled": false,
    "modelOutputInMessagesEnabled": false,
    "transportConfigurations": [
      {
        "provider": "twilio",
        "timeout": 60,
        "record": false
      }
    ],
    "credentials": [
      {
        "provider": "xai",
        "apiKey": "credentials"
      }
    ],
    "variableValues": {
      "key": "value"
    },
    "name": "name",
    "voicemailDetection": {
      "provider": "twilio"
    },
    "voicemailMessage": "voicemailMessage",
    "endCallMessage": "endCallMessage",
    "endCallPhrases": [
      "endCallPhrases"
    ],
    "metadata": {
      "key": "value"
    },
    "artifactPlan": {
      "recordingEnabled": true,
      "videoRecordingEnabled": false
    },
    "startSpeakingPlan": {
      "waitSeconds": 0.4,
      "smartEndpointingEnabled": false
    },
    "stopSpeakingPlan": {
      "numWords": 0,
      "voiceSeconds": 0.2,
      "backoffSeconds": 1
    },
    "monitorPlan": {
      "listenEnabled": false,
      "controlEnabled": false
    },
    "credentialIds": [
      "credentialIds"
    ],
    "server": {
      "url": "url",
      "timeoutSeconds": 20
    }
  },
  "squadId": "squadId",
  "squad": {
    "members": [
      {}
    ],
    "name": "name",
    "membersOverrides": {
      "firstMessage": "Hello! How can I help you today?",
      "hipaaEnabled": false,
      "silenceTimeoutSeconds": 30,
      "maxDurationSeconds": 600,
      "backgroundDenoisingEnabled": false,
      "modelOutputInMessagesEnabled": false
    }
  },
  "phoneNumberId": "phoneNumberId",
  "phoneNumber": {
    "twilioAccountSid": "twilioAccountSid",
    "twilioAuthToken": "twilioAuthToken",
    "twilioPhoneNumber": "twilioPhoneNumber",
    "fallbackDestination": {
      "type": "sip",
      "sipUri": "fallbackDestination"
    },
    "name": "name",
    "assistantId": "assistantId",
    "squadId": "squadId",
    "server": {
      "url": "url",
      "timeoutSeconds": 20
    }
  },
  "customerId": "customerId",
  "customer": {
    "numberE164CheckEnabled": true,
    "extension": "extension",
    "number": "number",
    "sipUri": "sipUri",
    "name": "name"
  },
  "name": "name"
}