export default {
  "post": {
    "uri": "at://did:plc:mockDid/app.bsky.feed.post/mockUri",
    "cid": "mockCid",
    "author": {
      "did": "did:plc:mockDid",
      "handle": "mockUser.bsky.social",
      "displayName": "Mock User",
      "avatar": "https://cdn.bsky.app/img/avatar/plain/did:plc:mockDid/mockAvatar@jpeg",
      "viewer": {
        "muted": false,
        "blockedBy": false,
        "following": "at://did:plc:mockFollow/app.bsky.graph.follow/mockId"
      },
      "labels": [],
      "createdAt": "2025-01-01T00:00:00.000Z"
    },
    "record": {
      "$type": "app.bsky.feed.post",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "langs": ["en"],
      "reply": {
        "parent": {
          "cid": "mockParentCid",
          "uri": "at://did:plc:mockParentDid/app.bsky.feed.post/mockParentUri"
        },
        "root": {
          "cid": "mockRootCid",
          "uri": "at://did:plc:mockRootDid/app.bsky.feed.post/mockRootUri"
        }
      },
      "text": "This is some mock post content."
    },
    "replyCount": 0,
    "repostCount": 0,
    "likeCount": 0,
    "quoteCount": 0,
    "indexedAt": "2025-01-01T00:00:00.000Z",
    "viewer": {
      "threadMuted": false,
      "embeddingDisabled": false
    },
    "labels": []
  },
  "reply": {
    "root": {
      "$type": "app.bsky.feed.defs#postView",
      "uri": "at://did:plc:mockRootDid/app.bsky.feed.post/mockRootUri",
      "cid": "mockRootCid",
      "author": {
        "did": "did:plc:mockRootDid",
        "handle": "mockRootUser.bsky.social",
        "displayName": "Mock Root User",
        "avatar": "https://cdn.bsky.app/img/avatar/plain/did:plc:mockRootDid/mockRootAvatar@jpeg",
        "viewer": {
          "muted": false,
          "blockedBy": false,
          "following": "at://did:plc:mockOtherFollow/app.bsky.graph.follow/mockRootFollowId"
        },
        "labels": [],
        "createdAt": "2025-01-01T01:11:00.000Z"
      },
      "record": {
        "$type": "app.bsky.feed.post",
        "createdAt": "2025-01-01T01:12:00.000Z",
        "langs": ["en"],
        "text": "Mock text for root post."
      },
      "replyCount": 9,
      "repostCount": 8,
      "likeCount": 36,
      "quoteCount": 0,
      "indexedAt": "2025-01-01T01:13:00.000Z",
      "viewer": {
        "threadMuted": false,
        "embeddingDisabled": false
      },
      "labels": []
    },
    "parent": {
      "$type": "app.bsky.feed.defs#postView",
      "uri": "at://did:plc:mockParentDid/app.bsky.feed.post/mockParentUri",
      "cid": "mockParentCid",
      "author": {
        "did": "did:plc:mockParentDid",
        "handle": "mockParentUser.bsky.social",
        "displayName": "Mock Parent User",
        "avatar": "https://cdn.bsky.app/img/avatar/plain/did:plc:mockParentDid/mockParentAvatar@jpeg",
        "viewer": {
          "muted": false,
          "blockedBy": false
        },
        "labels": [],
        "createdAt": "2025-01-01T02:15:00.000Z"
      },
      "record": {
        "$type": "app.bsky.feed.post",
        "createdAt": "2025-01-01T02:16:00.000Z",
        "langs": ["en"],
        "reply": {
          "parent": {
            "cid": "mockRootCid",
            "uri": "at://did:plc:mockRootDid/app.bsky.feed.post/mockRootUri"
          },
          "root": {
            "cid": "mockRootCid",
            "uri": "at://did:plc:mockRootDid/app.bsky.feed.post/mockRootUri"
          }
        },
        "text": "Mock text for parent post."
      },
      "replyCount": 1,
      "repostCount": 0,
      "likeCount": 1,
      "quoteCount": 0,
      "indexedAt": "2025-01-01T02:17:00.000Z",
      "viewer": {
        "threadMuted": false,
        "embeddingDisabled": false
      },
      "labels": []
    },
    "grandparentAuthor": {
      "did": "did:plc:mockDid",
      "handle": "mockUser.bsky.social",
      "displayName": "Mock User",
      "avatar": "https://cdn.bsky.app/img/avatar/plain/did:plc:mockDid/mockAvatar@jpeg",
      "viewer": {
        "muted": false,
        "blockedBy": false,
        "following": "at://did:plc:anotherMockDid/app.bsky.graph.follow/mockGrandparentFollowId"
      },
      "labels": [],
      "createdAt": "2025-01-01T03:00:00.000Z"
    }
  }
};
