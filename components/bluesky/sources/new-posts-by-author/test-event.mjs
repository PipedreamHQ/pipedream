export default {
  post: {
    uri: "at://did:plc:fakeOne/app.bsky.feed.post/mockPostId",
    cid: "bafyreimachangedxxxyyyzzz",
    author: {
      did: "did:plc:fakeOne",
      handle: "john_doe.bsky.social",
      displayName: "John Doe",
      avatar: "https://mock.cdn/avatar/plain/did:plc:fakeOne/bafkremockavatar@jpeg",
      viewer: {
        muted: false,
        blockedBy: false,
        following: "at://did:plc:someOtherDid/app.bsky.graph.follow/mockFollow"
      },
      labels: [],
      createdAt: "2025-01-01T08:00:00.000Z",
    },
    record: {
      $type: "app.bsky.feed.post",
      createdAt: "2025-01-01T12:00:00.000Z",
      langs: ["en"],
      reply: {
        parent: {
          cid: "bafyreimockparentxyz",
          uri: "at://did:plc:someoneElseDid/app.bsky.feed.post/mockParentPost"
        },
        root: {
          cid: "bafyreimockrootabc",
          uri: "at://did:plc:fakeOne/app.bsky.feed.post/mockRootPost"
        }
      },
      text: "Mock text for demonstration of the post content structure.",
    },
    replyCount: 0,
    repostCount: 0,
    likeCount: 1,
    quoteCount: 0,
    indexedAt: "2025-01-01T12:00:10.000Z",
    viewer: {
      threadMuted: false,
      embeddingDisabled: false,
    },
    labels: [],
  },
  reply: {
    root: {
      $type: "app.bsky.feed.defs#postView",
      uri: "at://did:plc:fakeOne/app.bsky.feed.post/mockRootPost",
      cid: "bafyreimockrootabc",
      author: {
        did: "did:plc:fakeOne",
        handle: "john_doe.bsky.social",
        displayName: "John Doe",
        avatar: "https://mock.cdn/avatar/plain/did:plc:fakeOne/bafkremockavatar@jpeg",
        viewer: {
          muted: false,
          blockedBy: false,
          following: "at://did:plc:someOtherDid/app.bsky.graph.follow/mockFollow"
        },
        labels: [],
        createdAt: "2025-01-01T08:00:00.000Z"
      },
      record: {
        $type: "app.bsky.feed.post",
        createdAt: "2025-01-01T09:00:00.000Z",
        langs: ["en"],
        text: "Mock text to show how the root reply might look.",
      },
      replyCount: 5,
      repostCount: 2,
      likeCount: 10,
      quoteCount: 0,
      indexedAt: "2025-01-01T09:00:05.000Z",
      viewer: {
        threadMuted: false,
        embeddingDisabled: false,
      },
      labels: [],
    },
    parent: {
      $type: "app.bsky.feed.defs#postView",
      uri: "at://did:plc:someoneElseDid/app.bsky.feed.post/mockParentPost",
      cid: "bafyreimockparentxyz",
      author: {
        did: "did:plc:someoneElseDid",
        handle: "alice_example.bsky.social",
        displayName: "Alice Example",
        avatar: "https://mock.cdn/avatar/plain/did:plc:someoneElseDid/bafkremockavatar@jpeg",
        viewer: {
          muted: false,
          blockedBy: false,
        },
        labels: [],
        createdAt: "2025-01-01T07:00:00.000Z"
      },
      record: {
        $type: "app.bsky.feed.post",
        createdAt: "2025-01-01T10:00:00.000Z",
        langs: ["en"],
        reply: {
          parent: {
            cid: "bafyreimockrootabc",
            uri: "at://did:plc:fakeOne/app.bsky.feed.post/mockRootPost"
          },
          root: {
            cid: "bafyreimockrootabc",
            uri: "at://did:plc:fakeOne/app.bsky.feed.post/mockRootPost"
          }
        },
        text: "Mock text showing how a parent comment might appear in the structure."
      },
      replyCount: 1,
      repostCount: 0,
      likeCount: 0,
      quoteCount: 0,
      indexedAt: "2025-01-01T10:00:05.000Z",
      viewer: {
        threadMuted: false,
        embeddingDisabled: false,
      },
      labels: [],
    },
    grandparentAuthor: {
      did: "did:plc:fakeOne",
      handle: "john_doe.bsky.social",
      displayName: "John Doe",
      avatar: "https://mock.cdn/avatar/plain/did:plc:fakeOne/bafkremockavatar@jpeg",
      viewer: {
        muted: false,
        blockedBy: false,
        following: "at://did:plc:someOtherDid/app.bsky.graph.follow/mockFollow"
      },
      labels: [],
      createdAt: "2025-01-01T08:00:00.000Z",
    },
  },
};
