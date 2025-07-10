# Belco Component

This component provides integration with the Belco API for managing conversations and customer support.

## Sources

### New Conversation
- **Key**: `belco-new-conversation`
- **Description**: Emits a new conversation event when a new conversation is created.
- **Documentation**: [Get Conversations API](https://developers.belco.io/reference/get_conversations)

## Actions

### List All Conversations
- **Key**: `belco-list-all-conversations`
- **Description**: Get a list of conversations
- **Documentation**: [Get Conversations API](https://developers.belco.io/reference/get_conversations)

### Create Conversation
- **Key**: `belco-create-conversation`
- **Description**: Create a conversation. Required props: shopId, channel and body. Optional props: type, from, to and subject.
- **Documentation**: [Post Conversations API](https://developers.belco.io/reference/post_conversations)

### Send Message
- **Key**: `belco-send-message`
- **Description**: Send a message to a conversation. Required props: shopId, channel and body. Optional props: type, from, to and subject.
- **Documentation**: [Post Conversations Send Message API](https://developers.belco.io/reference/post_conversations-sendmessage)

### Retrieve Conversation
- **Key**: `belco-retrieve-conversation`
- **Description**: Retrieve a conversation. Required props: conversationId. Optional props: fromDate, toDate, and sortOrder.
- **Documentation**: [Get Conversations Conversation ID API](https://developers.belco.io/reference/get_conversations-conversationid)

### Close Conversation
- **Key**: `belco-close-conversation`
- **Description**: Close a conversation. Required props: conversationId.
- **Documentation**: [Put Conversations Conversation ID Close API](https://developers.belco.io/reference/put_conversations-conversationid-close)

### Reopen Conversation
- **Key**: `belco-reopen-conversation`
- **Description**: Reopen a conversation. Required props: conversationId.
- **Documentation**: [Put Conversations Conversation ID Open API](https://developers.belco.io/reference/put_conversations-conversationid-open)

### Reply to Conversation
- **Key**: `belco-reply-to-conversation`
- **Description**: Reply to a conversation. Required props: conversationId and body.
- **Documentation**: [Put Conversations Conversation ID Reply API](https://developers.belco.io/reference/put_conversations-conversationid-reply)

### Add Note to Conversation
- **Key**: `belco-add-note-to-conversation`
- **Description**: Add a note to a conversation. Required props: conversationId and body.
- **Documentation**: [Put Conversations Conversation ID Add Note API](https://developers.belco.io/reference/put_conversations-conversationid-addnote)

## Authentication

This component uses API key authentication. You'll need to provide your Belco API key in the component configuration.

## API Documentation

For more information about the Belco API, visit: https://developers.belco.io/reference 