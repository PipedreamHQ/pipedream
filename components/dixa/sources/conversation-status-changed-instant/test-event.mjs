export default {
	"event_fqn": "CONVERSATION_PENDING",
	"event_id": "12345678-1234-1234-1234-1234567890",
	"event_timestamp": "2025-01-14T22:01:05.429Z",
	"event_version": "1",
	"organization": {
		"id": "12345678-1234-1234-1234-1234567890",
		"name": "Org Name"
	},
	"data": {
		"conversation": {
			"assignee": {
				"email": "email@dixa.com",
				"id": "12345678-1234-1234-1234-1234567890",
				"name": "Agent Name",
				"phone": "+123456789",
				"roles": [],
				"user_type": "Member"
			},
			"channel": "EMAIL",
			"contact_point": "contact@email.dixa.io",
			"created_at": "2025-01-13T19:48:33.178Z",
			"csid": 2,
			"direction": "OUTBOUND",
			"queue": {
				"id": "12345678-1234-1234-1234-1234567890",
				"name": "default"
			},
			"requester": {
				"email": "contact@email.com",
				"id": "12345678-1234-1234-1234-1234567890",
				"name": "Contact Name",
				"phone": null,
				"roles": [],
				"user_type": "Contact"
			},
			"status": "PENDING",
			"subject": "Subject Text",
			"tags": []
		}
	}
}