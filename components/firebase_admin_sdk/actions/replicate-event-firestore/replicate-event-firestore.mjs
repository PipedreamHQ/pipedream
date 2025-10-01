// legacy_hash_id: a_rJipb5
import admin from "firebase-admin";
import lodash from "lodash";

export default {
  key: "firebase_admin_sdk-replicate-event-firestore",
  name: "Save Event to Firestore",
  description: "Replicate event in Firestore",
  version: "0.4.7",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    firebase_admin_sdk: {
      type: "app",
      app: "firebase_admin_sdk",
    },
    deliveryId: {
      type: "string",
    },
    firestoreCollection: {
      type: "string",
    },
    data: {
      type: "string",
    },
  },
  async run({ $ }) {
    // Enter values for the following parameters below this code step,
    // These get passed to the initializeApp method below.
    const {
      projectId,
      clientEmail,
      privateKey,
    } = this.firebase_admin_sdk.$auth;

    // Before passing the privateKey to the initializeApp constructor,
    // we have to replace newline characters with literal newlines
    const formattedPrivateKey = privateKey.replace(/\\n/g, "\n");

    const app = admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey: formattedPrivateKey,
      }),
    });

    const db = admin.firestore();
    const deliveryId = this.deliveryId;

    let updates = [];
    updates.push(`updating ${deliveryId}`);

    const p1 = db.collection(this.firestoreCollection).doc(deliveryId)
      .set(lodash.assign({}, this.data, {
        pipedream: {
          updatedAt: (new Date().toISOString()),
        },
      }))
      .then(function () {
        updates.push("Updated successfully");
        app.delete().then(function () {
          updates.push("App deleted successfully");
        })
          .catch(function (error) {
            updates.push("Error deleting app:", error);
          });
      })
      .catch(function (error) {
        updates.push("Error writing:", error);
      });

    const result = await Promise.all([
      p1,
    ]);

    $.export("updates", updates);

    return result;
  },
};
