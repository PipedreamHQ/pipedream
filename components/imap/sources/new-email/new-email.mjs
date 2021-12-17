import Imap from "imap";
import { simpleParser } from "mailparser";
import util from "util";
import { once  } from "events";
import Stream from "stream";

/**
 * The number of seconds the source will run before timing out.
 * @constant {number}
 * @default 30
 */
const TIMEOUT = 30;
/**
 * The number of seconds to create an IMAP connection and listen for events.
 * @constant {number}
 * @default 22
 */
const LISTEN_FOR = TIMEOUT - 8;

/**
 * Creates an IMAP server connection and emits emails added to a mailbox after the last emitted
 * email. Watches the mailbox for new emails for `LISTEN_FOR` seconds before closing the IMAP
 * connection.
 */
export default {
  key: "imap-new-email",
  name: "New Email",
  description: "Emit new event for each new email in a mailbox",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    db: "$.service.db",
    host: {
      type: "string",
      label: "Host",
      description: "The URL for your IMAP server",
      default: "imap.gmail.com",
    },
    user: {
      type: "string",
      label: "Username",
      description: "The email address/username you use to login to your email account",
      secret: true,
    },
    password: {
      type: "string",
      label: "Password",
      description: "The password you use to login to your email account. Note: To connect a Gmail account to a third-party IMAP tool (like Pipedream), you must use an [App password](https://support.google.com/accounts/answer/185833).",
      secret: true,
    },
    port: {
      type: "integer",
      label: "Port",
      description: "The port number, either Port 143 or Port 993. Consult your email provider's IMAP instructions if you aren't sure which one you need.",
      min: 1,
      max: 65535,
      options: [
        143,
        993,
      ],
      default: 993,
    },
    mailbox: {
      type: "string",
      label: "Mailbox",
      description: "Name of the mailbox to watch for new emails",
      async options() {
        return new Promise((resolve, reject) => {
          let mailboxes = [];
          const imap = this.imap();
          imap.on("error", reject);
          imap.on("end", () => {
            resolve(mailboxes);
          });
          imap.connect();
          once(imap, "ready")
            .then(() => {
              return this.getMailboxes(imap);
            })
            .then((result) => {
              mailboxes = result;
            })
            .catch(reject)
            .finally(() => {
              return this.closeConnection(imap);
            });
        });
      },
    },
  },
  methods: {
    _getLastUid() {
      return this.db.get("lastUid");
    },
    _setLastUid(lastUid) {
      this.db.set("lastUid", lastUid);
    },
    _getUidValidity() {
      return this.db.get("uidValidity");
    },
    _setUidValidity(uidValidity) {
      this.db.set("uidValidity", uidValidity);
    },
    _handleUidValidityChange(uidValidity) {
      this._setUidValidity(uidValidity);
      this._setLastUid(null);
    },
    imap() {
      const imap = new Imap({
        user: this.user,
        password: this.password,
        host: this.host,
        port: this.port,
        tls: true,
        tlsOptions: {
          servername: this.host,
        },
      });
      return imap;
    },
    async closeConnection(imap) {
      const connectionClosed = new Promise((resolve) => {
        imap.on("end", resolve);
      });
      imap.end();
      await connectionClosed;
    },
    async getMailboxes(imap) {
      const getBoxes = util.promisify(imap.getBoxes.bind(imap));
      const boxes = await getBoxes();
      const getChildren = (boxName, box) => {
        if (!box.children) {
          return [];
        }
        return Object.keys(box.children).reduce((all, childName) => {
          const childBox = box.children[childName];
          const childBoxName = `${boxName}${box.delimiter}${childName}`;
          if (!childBox.attribs.includes("\\NOSELECT")) {
            all.push(childBoxName);
          }
          if (childBox.children) {
            all = all.concat(getChildren(childBoxName, childBox));
          }
          return all;
        }, []);
      };
      return getChildren("", {
        delimiter: "",
        children: boxes,
      });
    },
    async openMailbox(imap) {
      const openBox = util.promisify(imap.openBox.bind(imap));
      return await openBox(this.mailbox, true);
    },
    hasNewMessages(box) {
      const lastUid = this._getLastUid();
      return !lastUid || box.uidnext > lastUid + 1;
    },
    generateMeta(message) {
      const date = message.attributes?.date ?? new Date();
      const ts = Date.parse(date);
      return {
        id: `${message.attributes?.uid}-${ts}`,
        ts,
        summary: message.mail?.subject,
      };
    },
    processMessage(message) {
      const lastUid = message.attributes?.uid ?? lastUid;
      this._setLastUid(lastUid);
      this.$emit(message.mail, this.generateMeta(message));
    },
    async processMessageStream(stream) {
      for await (const message of stream) {
        this.processMessage(message);
      }
    },
    fetchMessages(imap, {
      startUid, startSeqno,
    }) {
      if (!startUid && !startSeqno) {
        throw new Error("One of startUid, startSeqno is required to fetch messages");
      }

      const options = {
        bodies: "",
      };
      let f;
      if (startUid) {
        f = imap.fetch(`${startUid}:*`, options);
      } else {
        f = imap.seq.fetch(`${startSeqno}:*`, options);
      }

      const readableStream = new Stream.Readable({
        objectMode: true,
        read() {},
      });
      let promises = [];

      f.on("message", (msg) => {
        const message = {};
        let mailPromise;
        msg.on("body", (stream) => {
          mailPromise = simpleParser(stream);
          promises.push(mailPromise);
        });
        msg.once("attributes", (attrs) => {
          message.attributes = attrs;
        });
        msg.once("end", async () => {
          message.mail = mailPromise && await mailPromise;
          readableStream.push(message);
        });
      });
      f.once("error", (err) => {
        readableStream.destroy(err);
      });
      f.once("end", async () => {
        // Wait until all mail promises have been resolved before ending stream
        await Promise.all(promises);
        readableStream.push(null);
      });

      return readableStream;
    },
  },
  async run() {
    await new Promise((resolve, reject) => {
      (async () => {
        // Configure imap connection
        const imap = this.imap();

        imap.once("error", reject);
        imap.once("end", () => {
          console.log("Connection ended");
          resolve();
        });

        imap.on("uidvalidity", (uidvalidity) => {
          this._handleUidValidityChange(uidvalidity);
        });

        // Close connection 8s before source TIMEOUT constant
        setTimeout(() => {
          this.closeConnection(imap);
        }, 1000 * (LISTEN_FOR));

        // Connect to imap server
        imap.connect();

        let box;
        try {
          await once(imap, "ready");
          console.log("Connection started");

          // Open mailbox
          box = await this.openMailbox(imap);
        } catch (err) {
          reject(err);
        }

        const uidValidity = this._getUidValidity();
        if (uidValidity !== box.uidvalidity) {
          this._handleUidValidityChange(box.uidvalidity);
        }

        // Listen for new mail
        imap.on("mail", (data) => {
          // eslint-disable-next-line multiline-ternary
          console.log(`Event: ${data} new message${data === 1 ? "" : "s"} in open mailbox`);

          const lastUid = this._getLastUid();
          // Fetch messages after lastUid if it exists, or most recent message otherwise
          const f = this.fetchMessages(imap, {
            startUid: lastUid && lastUid + 1,
            startSeqno: box.messages.total,
          });
          this.processMessageStream(f);
        });

        if (!this.hasNewMessages(box)) {
          console.log("No new messages since last run");
          return;
        }

        const lastUid = this._getLastUid();

        // Fetch messages after lastUid if it exists, or most recent message otherwise
        const f = this.fetchMessages(imap, {
          startUid: lastUid && lastUid + 1,
          startSeqno: box.messages.total,
        });
        try {
          await this.processMessageStream(f);
        } catch (err) {
          reject(err);
        }
      })();
    });
  },
};
