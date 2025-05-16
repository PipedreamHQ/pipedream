import { z } from "zod";
import { configurablePropsToZod } from "../configurablePropsToZod";
import { pd } from "../lib/pd-client";
import {
  Account, V1Component,
} from "@pipedream/sdk";
import { componentAppKey } from "../lib/componentAppKey";

type Tool = {
  name: string;
  description?: string;
  schema: z.ZodObject<z.ZodRawShape>;
  execute: (args: Record<string, unknown>) => Promise<unknown>;
};

export class CoreTools {
  userId: string;
  tools: Tool[] = [];

  constructor(userId: string) {
    this.userId = userId;
  }

  async getTools(options?: { app?: string; query?: string }) {
    const { data: components } = await pd.getComponents({
      app: options?.app,
      q: options?.query,
    });

    for (const component of components) {
      this.tools.push({
        name: component.name.replace(/[^a-zA-Z0-9_-]/g, "_"),
        description: component.description,
        schema: z.object(configurablePropsToZod(component)),
        execute: (args) => this.executeTool(component, args),
      });
    }

    return this.tools;
  }

  async getTool(name: string) {
    return this.tools.find((tool) => tool.name === name);
  }

  async executeTool(component: V1Component, args: Record<string, unknown>) {
    const appKey = componentAppKey(component.configurable_props);

    if (!appKey) {
      throw new Error("App name not found");
    }

    const authProvision = await this.getAuthProvision({
      app: appKey,
      uuid: this.userId,
    });

    if (typeof authProvision === "string") {
      return authProvision;
    }

    return pd.runAction({
      actionId: component.key,
      configuredProps: {
        ...args,
        [appKey]: {
          authProvisionId: authProvision.id,
        },
      },
      externalUserId: this.userId,
    });
  }

  async getAuthProvision({
    app,
    uuid,
  }: {
    app: string;
    uuid: string;
  }): Promise<Account | string> {
    const authProvisions = await pd.getAccounts({
      external_user_id: uuid,
      include_credentials: false,
      app,
    });

    const authProvision = authProvisions.data.find((ap) => ap.healthy);

    if (!authProvision) {
      const token = await pd.createConnectToken({
        external_user_id: uuid,
        webhook_uri: "https://eokyfjps7uqmmrk.m.pipedream.net", // https://pipedream.com/@pd/p_G6Ck6Mk/
      });
      return `
  The user MUST be shown the following URL so they can click on it to connect their account and you MUST NOT modify the URL or it will break: https://pipedream.com/_static/connect.html?token=${token.token}&connectLink=true&app=${encodeURIComponent(app)}
              `.trim();
    }

    return authProvision;
  }
}
