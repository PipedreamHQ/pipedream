import Imap from "imap";
import { simpleParser } from "mailparser";
import util from "util";
import Stream from "stream";

export default {
  type: "app",
  app: "imap",
  propDefinitions: {
    mailbox: {
      type: "string",
      label: "Mailbox",
      description: "Name of the mailbox to watch for new emails",
      async options() {
        const connection = await this.getConnection();
        try {
          return await this.getMailboxes(connection);
        } finally {
          await this.closeConnection(connection);
        }
      },
    },
  },
  methods: {
    _makeConnectionConfig() {
      const {
        host,
        email: user,
        password,
        port,
      } = this.$auth;
      return {
        user,
        password,
        host,
        port,
        tls: true,
        tlsOptions: {
          servername: host,
        },
      };
    },
    /**
     * Creates and returns a new authenticated instance of IMAP Connection
     *
     * @see {@link https://github.com/mscdex/node-imap#connection-instance-methods IMAP Connection Instance}
     *
     * @returns {Promise<object>} An IMAP connection
     */
    getConnection() {
      const connection = new Imap(this._makeConnectionConfig());
      return new Promise((resolve, reject) => {
        connection.on("error", reject);
        connection.once("ready", () => {
          resolve(connection);
        });
        connection.connect();
      });
    },
    /**
     * Closes the IMAP connection to the server after all requests in the queue have been sent
     *
     * @param {object} connection - The IMAP connection
     * @returns {Promise<void>}
     */
    async closeConnection(connection) {
      return new Promise((resolve, reject) => {
        connection.once("error", reject);
        connection.once("end", resolve);
        connection.end();
        setTimeout(() => resolve("done"), 5000);
      });
    },
    /**
     * Obtains the full list of mailboxes
     *
     * For the return value format of Imap's `getBoxes()` method, see
     * {@link https://github.com/mscdex/node-imap#connection-instance-methods Connection Methods}
     *
     * @param {object} connection - The IMAP connection
     * @returns {Promise<string[]>} The list of mailboxes
     */
    async getMailboxes(connection) {
      const getBoxes = util.promisify(connection.getBoxes.bind(connection));
      const boxes = await getBoxes();
      const getChildren = (boxName, box) => {
        if (!box.children) {
          return [];
        }
        return Object.keys(box.children).reduce((all, childName) => {
          const childBox = box.children[childName];
          const childBoxName = `${boxName}${box.delimiter}${childName}`;
          const isSelectable = !childBox.attribs.find(
            (attrib) => attrib.toLowerCase() === "\\noselect",
          );
          if (isSelectable) {
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
    /**
     * Opens a specific mailbox that exists on the server. `mailbox` should include any necessary
     * prefix/path.
     *
     * @see {@link https://github.com/mscdex/node-imap#data-types Box Data Type}
     *
     * @param {object} connection - The IMAP connection
     * @param {string} mailbox - The name of the mailbox to open
     * @returns {object} The opened mailbox
     */
    async openMailbox(connection, mailbox) {
      const openBox = util.promisify(connection.openBox.bind(connection));
      return openBox(mailbox, true);
    },
    /**
     * Fetches message(s) in the currently open mailbox. Requires one of `opts.startUid`,
     * `opts.StartSeqno`.
     *
     * @see {@link https://github.com/mscdex/node-imap#data-types ImapMessage Data Type}
     *
     * @param {object} connection - The IMAP connection
     * @param {object} opts - an object containing the options for fetching messages
     * @param {number} [opts.startUid] - The starting uid of messages to fetch
     * @param {number} [opts.startSeqno] - The starting seqno of messages to fetch
     * @returns {Stream.Readable} A Readable stream of messages
     */
    fetchMessages(connection, {
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
        f = connection.fetch(`${startUid}:*`, options);
      } else {
        f = connection.seq.fetch(`${startSeqno}:*`, options);
      }

      const messageStream = new Stream.Readable({
        objectMode: true,
        read() {},
      });
      let promises = [];

      f.on("message", (msg) => {
        const message = {};
        let mailPromise;
        msg.on("body", (stream) => {
          mailPromise = simpleParser(stream);
        });
        msg.once("attributes", (attrs) => {
          message.attributes = attrs;
        });
        msg.once("end", () => {
          if (!mailPromise) {
            return messageStream.push(message);
          }
          const messagePromise = mailPromise.then((mail) => {
            message.mail = mail;
            messageStream.push(message);
          });
          promises.push(messagePromise);
        });
      });
      f.once("error", (err) => {
        messageStream.destroy(err);
      });
      f.once("end", async () => {
        // Wait until all mail promises have been resolved before ending stream
        await Promise.all(promises);
        messageStream.push(null);
      });

      return messageStream;
    },
  },
};
