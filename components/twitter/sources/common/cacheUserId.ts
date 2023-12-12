import { getUserId } from "../../common/methods";

async function getCachedUserId(): Promise<string> {
  const { userNameOrId: name } = this;
  const cache = this.db.get("cachedUser");

  if (cache?.name === name) {
    return cache.id;
  }

  const id = await this.getUserId();
  this.db.set("cachedUser", {
    id,
    name,
  });
  return id;
}

export default {
  getCachedUserId,
  getUserId,
};
