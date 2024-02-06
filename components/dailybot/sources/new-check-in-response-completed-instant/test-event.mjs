export default {
  "event": "followups.response.completed",
  "event_timestamp": 1707154471.495433,
  "hook": {
    "id": "12345678-1234-1234-1234-123456789012",
    "name": "Webhook Name",
  },
  "body": {
    "uuid": "12345678-1234-1234-1234-123456789012",
    "user": {
      "uuid": "12345678-1234-1234-1234-123456789012",
      "full_name": "User Full Name",
      "image": "https://avatars.slack-edge.com/2022-06-21/image.png",
      "role": "ADMIN_ORG",
      "occupation": "",
      "email": "email@test.com"
    },
    "checkins": [
      {
        "uuid": "12345678-1234-1234-1234-123456789012",
        "name": "check-in name"
      }
    ],
    "is_anonymous": false,
    "content": {
      "12345678-1234-1234-1234-123456789012": "response 01",
      "12345678-1234-1234-1234-123456789012": "response 02",
      "12345678-1234-1234-1234-123456789012": "response 03"
    },
    "questions": {
      "fields": [
        {
          "uuid": "12345678-1234-1234-1234-123456789012",
          "logic": {
            "next_key": 1,
            "prev_key": -1,
            "question_key": 0
          },
          "question": "Your previous day plan ({previous_response_date}):\n{previous_response_#2}\n\nWhat did you complete in your previous workday?",
          "is_hidden": false,
          "is_blocker": false,
          "is_optional": false,
          "extra_params": {
            "i18n": {
              "es": {
                "question": "Tu plan del día anterior ({previous_response_date}):\n{previous_response_#2}\n\n¿En qué trabajaste en tu anterior día de trabajo?",
                "question_short": "Avances del anterior día de trabajo",
                "question_without_special_vars": "¿En qué trabajaste en tu anterior día de trabajo?"
              },
              "pt": {
                "question": "Seu plano do dia anterior ({previous_response_date}):\n{previous_response_#2}\n\nO que você concluiu em seu dia de trabalho anterior?",
                "question_short": "Progresso do dia de trabalho anterior",
                "question_without_special_vars": "O que você concluiu em seu dia de trabalho anterior?"
              }
            },
            "special_vars": [
              "previous_response_#2",
              "previous_response_date"
            ]
          },
          "question_type": "text",
          "question_short": "Previous work day progress",
          "question_variations": [],
          "question_without_special_vars": "What did you complete in your previous workday?"
        },
        {
          "uuid": "12345678-1234-1234-1234-123456789012",
          "logic": {
            "next_key": 2,
            "prev_key": 0,
            "question_key": 1
          },
          "question": "What are you planning to work on today?",
          "is_hidden": false,
          "is_blocker": false,
          "is_optional": false,
          "extra_params": {
            "i18n": {
              "es": {
                "question": "¿En qué planeas trabajar hoy?",
                "question_short": "Planes para hoy"
              },
              "pt": {
                "question": "No que você vai trabalhar hoje?",
                "question_short": "Planos para hoje"
              }
            }
          },
          "question_type": "text",
          "question_short": "Plans for today",
          "question_variations": [],
          "question_without_special_vars": null
        },
        {
          "uuid": "12345678-1234-1234-1234-123456789012",
          "logic": {
            "next_key": -1,
            "prev_key": 1,
            "question_key": 2
          },
          "question": "Great. Do you have any blockers? If so, just tell me. Otherwise please say: no.",
          "is_hidden": false,
          "is_blocker": true,
          "is_optional": false,
          "extra_params": {
            "i18n": {
              "es": {
                "question": "Genial. ¿Tienes algún bloqueo? Si es así, simplemente dímelo. En otro caso responde 'no'.",
                "question_short": "Problemas?"
              },
              "pt": {
                "question": "Ótimo. Você tem algum problema? Se sim, apenas me diga. Caso contrário por favor diga 'não'.",
                "question_short": "Algum bloqueador?"
              }
            }
          },
          "question_type": "text",
          "question_short": "Any blockers?",
          "question_variations": [],
          "question_without_special_vars": null
        }
      ],
      "response_source_type": "webapp",
      "has_conditional_questions": false
    },
    "has_issue": true,
    "blockers_status": {
      "12345678-1234-1234-1234-123456789012": true
    },
    "record_created_at": "2024-02-05T12:34:29.142575-05:00",
    "created_at": "2024-02-05T12:34:29-05:00",
    "updated_at": "2024-02-05T12:34:29.181095-05:00",
    "edited": false,
    "extra_activity": null,
    "response_completed": true
  }
}
