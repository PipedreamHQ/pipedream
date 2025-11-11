import { axios } from "@pipedream/platform";
export default {
  type: "app",
  app: "planview_leankit",
  propDefinitions: {
    blockReason: {
      type: "string",
      label: "Block Reason",
      description: "The block reason",
    },
    boardId: {
      type: "string",
      label: "Board ID",
      description: "The ID of the board",
      async options({ page }) {
        const { boards } = await this.listBoards({
          params: {
            offset: 200 * page,
          },
        });

        return boards.map(({
          id: value, title: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    cardId: {
      type: "string",
      label: "Card ID",
      description: "The ID of the card",
      async options({
        page, boardId,
      }) {
        const { cards } = await this.listCards({
          params: {
            offset: 200 * page,
            board: boardId,
          },
        });

        return cards.map(({
          id: value, title: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    cardTags: {
      type: "string[]",
      label: "Tag Ids",
      description: "Tag IDs",
      async options({ cardId }) {
        const { tags } = await this.getCard({
          cardId,
        });

        return tags;
      },
    },
    childCardId: {
      type: "string[]",
      label: "Child Card IDs",
      description: "Collection of child card IDs",
      async options({
        page, cardId, boardId,
      }) {
        const arrayCards = [];
        if (boardId) {
          const { cards } = await this.listCards({
            params: {
              offset: 200 * page,
              boardId,
              preset: "quickConnection",
              minimumAccess: 1,
            },
          });
          arrayCards.push(...cards);
        } else {
          const { cards } = await this.listConnectionCards({
            level: "children",
            cardId,
            params: {
              offset: 200 * page,
            },
          });
          arrayCards.push(...cards);
        }

        return arrayCards.map(({
          id: value, title: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    customIconId: {
      type: "string",
      label: "Custom Icon ID",
      description: "The custom icon",
      async options({ cardId }) {
        const { board: { id: boardId } } = await this.getCard({
          cardId,
        });

        const { customIcons } = await this.listCustomIcons({
          boardId,
        });

        return customIcons.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    customId: {
      type: "string",
      label: "Custom ID",
      description: "The card header",
    },
    customFieldId: {
      type: "string",
      label: "Custom Field ID",
      description: "The Id of the custom field",
      async options({ boardId }) {
        const { customFields } = await this.listCustomFields({
          boardId,
        });

        return customFields.map(({
          id: value, label,
        }) => ({
          label,
          value,
        }));
      },
    },
    customFields: {
      type: "object",
      label: "Custom Fields",
      description: "Collection of custom fields. Each field has a string fieldId and string value property.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The card description",
    },
    deleted: {
      type: "boolean",
      label: "Deleted",
      description: "Return the card IDs for deleted cards",
    },
    externalLink: {
      type: "object",
      label: "External Link",
      description: "External link object with string label and string url fields",
    },
    index: {
      type: "integer",
      label: "Index",
      description: "The position of the card in the lane starting at 0 as the first position",
    },
    isBlocked: {
      type: "boolean",
      label: "Is Blocked",
      description: "The blocked state of the card. Should be specified with the blockReason property operation in the same request.",
    },
    laneId: {
      type: "string",
      label: "Lane Id",
      description: "The ID of the lane",
      async options({
        boardId, cardId,
      }) {
        if (!boardId) {
          const { board: { id } } = await this.getCard({
            cardId,
          });
          boardId = id;
        }
        const { lanes } = await this.getBoard({
          boardId,
        });

        return lanes.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    laneClassTypes: {
      type: "string",
      label: "Lane Class Types",
      description: "Only return cards in lane class types specified in a csv list.",
      options: [
        "backlog",
        "active",
        "archive",
      ],
    },
    laneType: {
      type: "string",
      label: "Lane Type",
      description: "The type of the lane",
      async options({ boardId }) {
        const { laneTypes } = await this.getBoard({
          boardId,
        });

        return laneTypes.map(({ name }) => name);
      },
    },
    only: {
      type: "string",
      label: "Only",
      description: "Return only the fields specified in a csv list.",
    },
    omit: {
      type: "string",
      label: "Omit",
      description: "Return all fields except the ones specified in a csv list.",
    },
    parentCardId: {
      type: "string[]",
      label: "Parent Card IDs",
      description: "Collection of parent card IDs.",
      async options({
        page, cardId, boardId,
      }) {
        const arrayCards = [];
        if (boardId) {
          const { cards } = await this.listCards({
            params: {
              offset: 200 * page,
              boardId,
              preset: "quickConnection",
              minimumAccess: 1,
            },
          });
          arrayCards.push(...cards);
        } else {
          const { cards } = await this.listConnectionCards({
            level: "parents",
            cardId,
            params: {
              offset: 200 * page,
            },
          });
          arrayCards.push(...cards);
        }

        return arrayCards.map(({
          id: value, title: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    planningIncrementIds: {
      type: "string[]",
      label: "Planning Increment IDs",
      description: "Collection of planning increment IDs.",
      async options({
        page, planningSeriesId,
      }) {
        const { increments } = await this.listPlanningIncrements({
          params: {
            offset: page * 100,
          },
          planningSeriesId,
        });

        return increments.map(({
          id: value, label,
        }) => ({
          label,
          value,
        }));
      },
    },
    planningSeriesId: {
      type: "string",
      label: "Planning Series ID",
      description: "Planning series for an account",
      async options({ page }) {
        const { series } = await this.listPlanningSeries({
          params: {
            offset: page * 100,
          },
        });

        return series.map(({
          id: value, label,
        }) => ({
          label,
          value,
        }));
      },
    },
    plannedStart: {
      type: "string",
      label: "Planned Start",
      description: "The card planning start date. String format: `YYYY-MM-DD`",
    },
    plannedFinish: {
      type: "string",
      label: "Planned Finish",
      description: "The card planning finish date. String format: `YYYY-MM-DD`",
    },
    priority: {
      type: "string",
      label: "Priority",
      description: "The priority of the card",
      options: [
        "critical",
        "high",
        "normal",
        "low",
      ],
    },
    size: {
      type: "integer",
      label: "Size",
      description: "The card size",
    },
    search: {
      type: "string",
      label: "Search",
      description: "Full text search on card title and external card ID",
    },
    since: {
      type: "string",
      label: "Since",
      description: "Only return cards updated after this ISO8601 date. String format: `YYYY-MM-DD`",
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "Sort results by. Defaults to rank if there is a search param, otherwise activity.",
      options: [
        "activity",
        "rank",
        "title",
      ],
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Collection of tags",
      async options({
        boardId, cardId,
      }) {
        if (!boardId) {
          const { board: { id } } = await this.getCard({
            cardId,
          });
          boardId = id;
        }

        const { tags } = await this.listTags({
          boardId,
        });
        const tagsArray = Object.keys(tags);
        return tagsArray;
      },
    },
    taskId: {
      type: "string",
      label: "Task ID",
      description: "The ID of the task",
      async options({
        page, cardId,
      }) {
        const { cards } = await this.listTasks({
          params: {
            offset: 200 * page,
          },
          cardId,
        });

        return cards.map(({
          id: value, title: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    taskLaneId: {
      type: "string",
      label: "Lane ID",
      description: "The Id of the lane",
      async options({
        cardId, status,
      }) {
        const { lanes } = await this.listTaskboard({
          cardId,
        });

        let responseLanes = lanes;
        if (status) responseLanes = lanes.filter(({ laneType }) => laneType === status);

        return responseLanes.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    title: {
      type: "string",
      label: "Title",
      description: "The card title",
    },
    typeId: {
      type: "string",
      label: "Type ID",
      description: "The ID of the type",
      async options({
        boardId, cardId, isTask = false,
      }) {
        if (!boardId) {
          const { board: { id } } = await this.getCard({
            cardId,
          });
          boardId = id;
        }
        const { cardTypes } = await this.getBoard({
          boardId,
        });

        const typesResponse = isTask
          ? cardTypes.filter((type) => type.isTaskType)
          : cardTypes;

        return typesResponse.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of the user",
      async options({
        page, cardId,
      }) {
        let usersArray = [];
        if (cardId) {
          const { assignedUsers } = await this.getCard({
            cardId,
          });
          usersArray = assignedUsers;
        } else {
          const { users } = await this.listUsers({
            params: {
              offset: page * 100,
            },
          });
          usersArray = users;
        }

        return usersArray.map(({
          id: value, emailAddress, username,
        }) => ({
          label: emailAddress || username,
          value,
        }));
      },
    },
    wipOverrideComment: {
      type: "string",
      label: "WIP Override Comment",
      description: "This is needed if user WIP is violated on a board.",
    },
  },
  methods: {
    _apiUrl() {
      return `https://${this.$auth.domain}.leankit.com/io`;
    },
    _getAuth() {
      return {
        username: `${this.$auth.username}`,
        password: `${this.$auth.password}`,
      };
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        auth: this._getAuth(),
        headers: {
          "Content-Type": "application/json",
          "Accept": "",
        },
        ...opts,
      };

      return axios($, config);
    },
    assignUserToCard(args = {}) {
      return this._makeRequest({
        path: "card/assign",
        method: "POST",
        ...args,
      });
    },
    createCard(args = {}) {
      return this._makeRequest({
        path: "card",
        method: "POST",
        ...args,
      });
    },
    createCardType({
      boardId, ...args
    }) {
      return this._makeRequest({
        path: `board/${boardId}/cardType`,
        method: "POST",
        ...args,
      });
    },
    createComment({
      cardId, ...args
    }) {
      return this._makeRequest({
        path: `card/${cardId}/comment`,
        method: "POST",
        ...args,
      });
    },
    createTask({
      cardId, ...args
    }) {
      return this._makeRequest({
        path: `card/${cardId}/tasks`,
        method: "POST",
        ...args,
      });
    },
    createConnections(args = {}) {
      return this._makeRequest({
        path: "card/connections",
        method: "POST",
        ...args,
      });
    },
    deleteConnections(args = {}) {
      return this._makeRequest({
        path: "card/connections",
        method: "DELETE",
        ...args,
      });
    },
    getBoard({
      boardId, ...args
    }) {
      return this._makeRequest({
        path: `board/${boardId}`,
        ...args,
      });
    },
    getCard({
      cardId, ...args
    }) {
      return this._makeRequest({
        path: `card/${cardId}`,
        ...args,
      });
    },
    listActivity({
      boardId, ...args
    }) {
      return this._makeRequest({
        path: `board/${boardId}/activity`,
        ...args,
      });
    },
    listBoards(args = {}) {
      return this._makeRequest({
        path: "board",
        ...args,
      });
    },
    listCards(args = {}) {
      return this._makeRequest({
        path: "card",
        ...args,
      });
    },
    listCustomIcons({
      boardId, ...args
    }) {
      return this._makeRequest({
        path: `board/${boardId}/customIcon`,
        ...args,
      });
    },
    listCustomFields({
      boardId, ...args
    }) {
      return this._makeRequest({
        path: `board/${boardId}/customField`,
        ...args,
      });
    },
    listConnectionCards({
      level, cardId, ...args
    }) {
      return this._makeRequest({
        path: `card/${cardId}/connection/${level}`,
        ...args,
      });
    },
    listPlanningIncrements({
      planningSeriesId, ...args
    }) {
      return this._makeRequest({
        path: `series/${planningSeriesId}/increment`,
        ...args,
      });
    },
    listPlanningSeries(args = {}) {
      return this._makeRequest({
        path: "series",
        ...args,
      });
    },
    listTags({ boardId }) {
      return this._makeRequest({
        path: `board/${boardId}/tag`,
      });
    },
    listTaskboard({
      cardId, ...args
    }) {
      return this._makeRequest({
        path: `card/${cardId}/taskboard`,
        ...args,
      });
    },
    listTasks({
      cardId, ...args
    }) {
      return this._makeRequest({
        path: `card/${cardId}/tasks`,
        ...args,
      });
    },
    listUsers(args = {}) {
      return this._makeRequest({
        path: "user",
        ...args,
      });
    },
    moveCards(args = {}) {
      return this._makeRequest({
        path: "card/move",
        method: "POST",
        ...args,
      });
    },
    updateCard({
      cardId, ...args
    }) {
      return this._makeRequest({
        path: `card/${cardId}`,
        method: "PATCH",
        ...args,
      });
    },
    updateCustomField({
      boardId, ...args
    }) {
      return this._makeRequest({
        path: `board/${boardId}/customField`,
        method: "PATCH",
        ...args,
      });
    },
    async *activityPaginate({
      fn, boardId, params = {}, maxResults = null,
    }) {
      let lastPage = false;
      let eventId = "";
      let count = 0;

      do {
        params.eventId = eventId;
        const { events } = await fn({
          boardId,
          params,
        });
        for (const d of events) {
          eventId = d.id;
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        lastPage = !(events.length);

      } while (lastPage);
    },
  },
};
