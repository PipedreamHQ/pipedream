import linguapop from "../../linguapop.app.mjs";

export default {
  key: "linguapop-new-placement-test-result-instant",
  name: "New Placement Test Result Instant",
  description: "Emit new event when a placement test is completed. [See the documentation](https://docs.linguapop.eu/api/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    linguapop: {
      type: "app",
      app: "linguapop",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    language: {
      propDefinition: [
        linguapop,
        "language",
      ],
    },
    userId: {
      propDefinition: [
        linguapop,
        "userId",
      ],
    },
    testLevel: {
      propDefinition: [
        linguapop,
        "testLevel",
      ],
    },
  },
  hooks: {
    async activate() {
      const opts = {
        language: this.language,
        recipientEmail: this.http.endpoint,
        invitationContent: "Please complete the placement test",
      };
      const invitation = await this.linguapop.createTestInvitation(opts);
      this.db.set("invitationId", invitation.invitationId);
    },
    async deactivate() {
      this.db.set("invitationId", null);
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;

    if (headers["Content-Type"] !== "application/json") {
      this.http.respond({
        status: 400,
        body: "Invalid content type",
      });
      return;
    }

    if (!body || body.invitationId !== this.db.get("invitationId")) {
      this.http.respond({
        status: 404,
        body: "Not found",
      });
      return;
    }

    this.http.respond({
      status: 200,
    });

    const {
      externalIdentifier: userId, finalLevelCode: testLevel,
    } = body;
    const language = this.language;
    await this.linguapop.emitTestCompletionEvent({
      language,
      userId,
      testLevel,
    });
  },
};
