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
      async options({
        user, password, host, port,
      }) {
        const connection = await this.getConnection({
          user,
          password,
          host,
          port,
        });
        try {
          const mailboxes = await this.getMailboxes(connection);
          return mailboxes;
        } catch (err) {
          throw new Error(err);
        } finally {
          await this.closeConnection(connection);
        }
      },
    },
  },
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    getConnection(opts) {
      // const { host, user, password, port, } = this.$auth;
      const {
        user,
        password,
        host,
        port,
      } = opts;
      return new Promise((resolve, reject) => {
        const connection = new Imap({
          user: user,
          password: password,
          host: host,
          port: port,
          tls: true,
          tlsOptions: {
            servername: host,
          },
        });
        connection.on("error", reject);
        connection.once("ready", () => {
          resolve(connection);
        });
        connection.connect();
      });
    },
    async closeConnection(connection) {
      const connectionClosed = new Promise((resolve) => {
        connection.once("end", resolve);
      });
      connection.end();
      await connectionClosed;
    },
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
    async openMailbox(connection, mailbox) {
      const openBox = util.promisify(connection.openBox.bind(connection));
      return await openBox(mailbox, true);
    },
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
          }).then(() => {
            messageStream.push(message);
          });
          promises.push(messagePromise);
        });
      });
      f.once("error", (err) => {
        messageStream.destroy(err);
      });
      f.once("end", () => {
        // Wait until all mail promises have been resolved before ending stream
        Promise.all(promises).then(() => {
          messageStream.push(null);
        });
      });

      return messageStream;
    },
  },
};
