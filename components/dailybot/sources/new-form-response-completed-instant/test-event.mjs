export default {
  "event": "forms.response.created",
  "event_timestamp": 1707153522.748586,
  "hook": {
    "id": "12345678-1234-1234-1234-123456789012",
    "name": "Webhook Name",
  },
  "body": {
    "uuid": "12345678-1234-1234-1234-123456789012",
    "user": {
      "uuid": "12345678-1234-1234-1234-123456789012",
      "full_name": "USer Full Name",
      "image": "https://avatars.slack-edge.com/2022-06-21/image.png",
      "role": "ADMIN_ORG",
      "is_active": true,
      "bot_enabled": true,
      "timezone": "America/New_York",
      "occupation": "",
      "birth_date": null,
      "chat_platform_data": {
        "user_external_id": "U03LDQHECDC",
        "external_grid_id": null
      },
      "work_days": [
        1,
        2,
        3,
        4,
        5,
        6,
        7
      ],
      "timeoff_start": null,
      "timeoff_end": null,
      "hour_init_work": "08:30:00",
      "email": "email@test.com"
    },
    "is_anonymous": false,
    "is_guest_user": false,
    "content": {
      "12345678-1234-1234-1234-123456789012": "<p>Content</p>"
    },
    "created_at": "2024-02-05T12:18:42.698988-05:00",
    "metadata": {
      "response_from_workflow": false
    },
    "responses": {
      "question_1": "Q1",
      "question_1_short": "question 01",
      "response_1": "<p>response text</p>"
    },
    "questions": {
      "fields": [
        {
          "uuid": "12345678-1234-1234-1234-123456789012",
          "logic": {
            "next_key": -1,
            "prev_key": -1,
            "question_key": 0
          },
          "question": "Q1",
          "is_hidden": false,
          "is_blocker": false,
          "is_optional": false,
          "extra_params": {
            "special_vars": []
          },
          "question_type": "text",
          "question_short": "question 01",
          "question_without_special_vars": null,
          "question_variations": []
        }
      ],
      "has_questions_variations": false,
      "has_conditional_questions": false
    },
    "has_issue": false,
    "blockers_status": {},
    "edited": false,
    "response_completed": true,
    "updated_at": "2024-02-05T12:18:42.699523-05:00",
    "flow_status": null,
    "flow_details": []
  }
}