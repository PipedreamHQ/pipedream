const axios = require('axios')
const _ = require('lodash')
const events = `addAttachmentToCard
addChecklistToCard
addLabelToCard
addMemberToBoard
addMemberToCard
commentCard
convertToCardFromCheckItem
copyCard
createCard
createCheckItem
createLabel
createList
deleteAttachmentFromCard
deleteCard
deleteCheckItem
deleteComment
deleteLabel
emailCard
moveCardFromBoard
moveCardToBoard
moveListFromBoard
moveListToBoard
removeChecklistFromCard
removeLabelFromCard
removeMemberFromBoard
removeMemberFromCard
updateBoard
updateCard
updateCheckItem
updateCheckItemStateOnCard
updateChecklist
updateComment
updateLabel
updateList`.split('\n')

const trello = {
  type: "app",
  app: "trello",
  propDefinitions: {
    cardIds: {
      // after should be array + assume after apps
      type: "string[]",
      label: "Cards",
      optional: true,
      // options needs to support standardized opts for pagination
      async options(opts) {
        const cards = await this.getCards(opts.boardId)
        // XXX short hand where value and label are same value
        return cards.map(card => {
          return { label: card.name, value: card.id }
        })
      },
    },
    boardId: {
      // after should be array + assume after apps
      type: "string",
      label: "Board",
      // options needs to support standardized opts for pagination
      async options(opts) {
        const boards = await this.getBoards(this.$auth.oauth_uid)
        // XXX short hand where value and label are same value
        const activeBoards = boards.filter(board => board.closed === false)
        return activeBoards.map(board => {
          return { label: board.name, value: board.id }
        })
      },
      // XXX validate
    },
    eventTypes: {
      // after should be array + assume after apps
      type: "string[]",
      label: "Event Types",
      optional: true,
      description: "Only emit events for the selected event types (e.g., `updateCard`).",
      // options needs to support standardized opts for pagination
      options: events,
      // XXX validate
    },
    listIds: {
      // after should be array + assume after apps
      type: "string[]",
      label: "Lists",
      optional: true,
      // options needs to support standardized opts for pagination
      async options(opts) {
        const lists = await this.getLists(opts.boardId)
        // XXX short hand where value and label are same value
        return lists.map(list => {
          return { label: list.name, value: list.id }
        })
      },
      // XXX validate
    },
  },
  methods: {
    async _getAuthorizationHeader({ data, method, url }) {
      const requestData = {
        data,
        method,
        url,
      }
      const token = {
        key: this.$auth.oauth_access_token,
        secret: this.$auth.oauth_refresh_token,
      }
      return (await axios({
        method: 'POST',
        url: this.$auth.oauth_signer_uri,
        data: {
          requestData,
          token,
        }
      })).data
    },
    async _makeRequest(config) {
      if (!config.headers) config.headers = {}
      const authorization = await this._getAuthorizationHeader(config)
      config.headers.authorization = authorization
      try {
        return await axios(config)
      } catch (err) {
        console.log(err) // TODO
      }
    },
    async getBoards(id) {   
      const config = {
        url: `https://api.trello.com/1/members/${id}/boards`,
      }
      return (await this._makeRequest(config)).data
    },
    async getCards(id) {   
      const config = {
        url: `https://api.trello.com/1/boards/${id}/cards`,
      }
      return (await this._makeRequest(config)).data
    },
    async getLists(id) {   
      const config = {
        url: `https://api.trello.com/1/boards/${id}/lists`,
      }
      return (await this._makeRequest(config)).data
    },
    async createHook({ id, endpoint }) {
      console.log(`id: ${id}`)
      const resp = await this._makeRequest({
        method: "post",
        url: `https://api.trello.com/1/webhooks/`,
        headers: {
          "Content-Type": "applicaton/json" 
        },
        params: {
          idModel: id,
          description: "Pipedream Source ID", //todo add ID
          callbackURL: endpoint,
        },
      })

      console.log(resp)

      return resp.data
    },
    async deleteHook({ hookId }) {
      return (await this._makeRequest({
        method: "delete",
        url: `https://api.trello.com/1/webhooks/${hookId}`,
      })).data
    },
  },
}

module.exports = {
  name: "new-activity",
  version: "0.0.1",
  props: {
    db: "$.service.db",
    http: "$.interface.http",
    trello,
    boardId: { propDefinition: [trello, "boardId"] },
    eventTypes: { propDefinition: [trello, "eventTypes"] },
    listIds: { propDefinition: [trello, "listIds", c => ({ boardId: c.boardId })] },
    cardIds: { propDefinition: [trello, "cardIds", c => ({ boardId: c.boardId })] },
  },
  methods: {
    generateSecret() {
      return ""+Math.random()
    },
  },
  hooks: {
    async activate() {
      //const secret = this.generateSecret()
      const { id } = await this.trello.createHook({
        id: this.boardId,
        endpoint: this.http.endpoint,
      })
      this.db.set("hookId", id)
      this.db.set("eventTypes", this.eventTypes)
      this.db.set("listIds", this.listIds)
      this.db.set("cardIds", this.cardIds)
      //this.db.set("secret", secret)
    },
    async deactivate() {
      await this.trello.deleteHook({
        hookId: this.db.get("hookId"),
      })
    },
  },
  async run(event) {
    // have to be careful about where this event came from to respond
    this.http.respond({
      status: 200,
    })

    const body = _.get(event, 'body')
    if (body) {
      const eventTypes = this.db.get("eventTypes")
      const listIds = this.db.get("listIds")
      const cardIds = this.db.get("cardIds")

      const eventType = _.get(body, 'action.type', '')
      const listId = _.get(body, 'action.data.list.id')
      const cardId = _.get(body, 'action.data.card.id')

      let emitEvent
      if (eventTypes || listIds || cardIds) {
        emitEvent = false
      }  else {
        emitEvent = true
      }
      if ((eventType && eventTypes.includes(eventType)) || (listId && listIds.includes(listId)) || (cardId && cardIds.includes(cardId))) { 
        emitEvent = true 
      }

      if (emitEvent) {
        this.$emit(body, {
          summary: _.get(body, 'action.type', ''),
        })
      }
    }
  },
}