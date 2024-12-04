import { createConsumer } from "@rails/actioncable";
import type {
  Consumer, Subscription,
} from "@rails/actioncable";

/**
 * A generic API response that returns asynchronously.
 * See AsyncResponseManager for details.
 */
export type AsyncResponse = {
  async_handle: string;
};

export type AsyncErrorResponse = {
  errors: string[];
};

export type AsyncResponseManagerOpts = {
  url: string;
  subscriptionParams?: Record<string, string>;
};

type Handle = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resolve: (value: any) => void;
  reject: (reason: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  promise: Promise<any>;
};

const createHandle = (): Handle => {
  const handle: Partial<Handle> = {};
  handle.promise = new Promise((resolve, reject) => {
    handle.resolve = resolve;
    handle.reject = reject;
  });
  return handle as Handle;
};

function randomString(n: number) {
  const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array(n).fill(0)
    .map(() => alphabet[Math.floor(Math.random() * alphabet.length)])
    .join("");
}

export abstract class AsyncResponseManager {
  protected cable?: Consumer;
  protected handles: Record<string, Handle> = {};
  protected subscription?: Subscription;
  protected opts?: AsyncResponseManagerOpts;

  async connect() {
    this.createCable();
    await this.createSubscription();
  }

  createAsyncHandle() {
    const asyncHandle = randomString(12);
    this.handles[asyncHandle] = createHandle();
    return asyncHandle;
  }

  protected createCable(): Consumer {
    if (!this.opts?.url) throw "Missing ActionCable url";
    this.cable = createConsumer(this.opts.url);
    this.cable.ensureActiveConnection();
    return this.cable;
  }

  protected async createSubscription(): Promise<Subscription> {
    this.subscription = await new Promise<Subscription>((resolve, reject) => {
      this.subscription = this.cable?.subscriptions?.create({
        channel: "AsyncResponseChannel",
        ...(this.opts?.subscriptionParams ?? {}),
      }, {
        connected: () => resolve(this.subscription as Subscription),
        rejected: (reason?: string) => reject(reason),
        received: (d: { asyncHandle: string; }) => {
          const handle = this.handles[d.asyncHandle];
          if (handle) {
            handle.resolve(d);
            setTimeout(() => delete this.handles[d.asyncHandle], 60000);
          }
        },
        disconnected: (opts?: { willAttemptReconnect: boolean; }) => {
          if (!opts?.willAttemptReconnect) {
            for (const asyncHandle of Object.keys(this.handles)) {
              const handle: Handle = this.handles[asyncHandle];
              handle.reject("AsyncResponseChannel disconnected");
            }
            this.handles = {};
          }
        },
      });
    });
    return this.subscription;
  }

  async ensureConnected() {
    this.cable?.ensureActiveConnection();
    const _opts = await this.getOpts();
    if (!this.opts || JSON.stringify(_opts) !== JSON.stringify(this.opts) || !this.cable?.connection.isOpen()) {
      this.opts = _opts;
      await this.connect();
    }
  }

  protected abstract getOpts(): Promise<AsyncResponseManagerOpts>;

  async waitFor<T>(asyncHandle: string): Promise<T> {
    await this.connect();
    const handle = this.handles[asyncHandle] ?? createHandle();
    this.handles[asyncHandle] = handle;
    return handle.promise;
  }
}

