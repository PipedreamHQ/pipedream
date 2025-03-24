export default {
  "type": "workflow-completed",
  "id": "ab1491fb-c4ae-3496-a958-c248b4732020",
  "happened_at": "2024-12-18T18:44:38.000100Z",
  "webhook": {
    "id": "7d0a502e-0880-414a-8951-97ba4c361aea",
    "name": ""
  },
  "workflow": {
    "id": "7acc6aa9-aac0-40ac-8cf1-48fca8d8455d",
    "name": "say-hello-workflow",
    "created_at": "2024-12-18T18:44:20.682Z",
    "stopped_at": "2024-12-18T18:44:37.867Z",
    "url": "",
    "status": "success"
  },
  "pipeline": {
    "id": "5c8229b0-194a-4942-bddd-2b6a40c5ab35",
    "number": 5,
    "created_at": "2024-12-18T17:23:29.629Z",
    "trigger": {
      "type": "api"
    },
    "trigger_parameters": {
      "github_app": {
        "commit_author_name": "",
        "owner": "",
        "full_ref": "refs/heads/circleci-project-setup",
        "forced": "false",
        "user_username": "",
        "branch": "circleci-project-setup",
        "commit_title": "CircleCI Commit",
        "repo_url": "",
        "ref": "circleci-project-setup",
        "repo_name": "",
        "commit_author_email": "",
        "commit_sha": "9e2e4bed59d2e6c51d00e0e0b49f1b79ff146ab1"
      },
      "git": {
        "commit_author_name": "",
        "repo_owner": "",
        "branch": "circleci-project-setup",
        "commit_message": "CircleCI Commit",
        "repo_url": "",
        "ref": "refs/heads/circleci-project-setup",
        "author_avatar_url": "",
        "checkout_url": "",
        "author_login": "",
        "repo_name": "",
        "commit_author_email": "",
        "checkout_sha": "9e2e4bed59d2e6c51d00e0e0b49f1b79ff146ab1",
        "default_branch": "master"
      },
      "circleci": {
        "event_time": "2024-12-18 17:23:29.361740256 +0000 UTC",
        "provider_actor_id": "864c50f3-d0b6-4929-a524-036d3cd4e23f",
        "actor_id": "864c50f3-d0b6-4929-a524-036d3cd4e23f",
        "event_type": "create pipeline run api",
        "trigger_type": "github_app"
      },
      "webhook": {
        "body": "{}"
      }
    }
  },
  "project": {
    "id": "4b309fd6-d103-401a-bee5-1de19651d969",
    "name": "",
    "slug": "circleci/9z8PamRuKaKWrW91o7Kqvn/AHWysFUuUfBgs6VeUqm6tg"
  },
  "organization": {
    "id": "48c30eda-389d-48a8-ac64-7091f80c69df",
    "name": ""
  }
}