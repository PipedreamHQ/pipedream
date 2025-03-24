export default {
  "event": "activity.created",
  "activity_id": 123456789,
  "date": "2024-11-19T19:57:54+00:00",
  "_links": {
    "activity": {
      "href": "/activities/123456789"
    }
  },
  "_embedded": {
    "activity": {
      "id": 123456789,
      "data_item": {
        "id": 123456789,
        "type": "candidate"
      },
      "date": "2024-11-19T19:57:54+00:00",
      "regarding_id": 123456789,
      "type": "other",
      "notes": null,
      "annotation": "Added candidate to pipeline: No Contact",
      "entered_by_id": 123456789,
      "date_created": "2024-11-19T19:57:54+00:00",
      "date_modified": "2024-11-19T19:57:54+00:00",
      "_links": {
        "self": {
          "href": "/activities/123456789"
        },
        "regarding": {
          "href": "/jobs/123456789"
        },
        "data_item": {
          "href": "/candidates/123456789"
        },
        "entered_by": {
          "href": "/users/123456789"
        }
      }
    }
  }
}