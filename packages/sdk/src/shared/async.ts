import type { Consumer, Subscription } from "@rails/actioncable"

/**
 * A generic API response that returns asynchronously.
 * See AsyncResponseManager for details.
 */
export type AsyncResponse = {
  async_handle: string
}

export type AsyncErrorResponse = {
  errors: string[]
}


export type AsyncResponseManagerOpts = {
  apiHost: string
}

type Handle = {
  resolve: (value: any) => void
  reject: (reason: any) => void
  promise: Promise<any>
}

const createHandle = (): Handle => {
  const handle: any = {}
  handle.promise = new Promise((resolve, reject) => {
    handle.resolve = resolve
    handle.reject = reject
  })
  return handle
}

function randomString(n: number) {
  const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  return Array(n).fill(0).map(() => alphabet[Math.floor(Math.random()*alphabet.length)]).join('')
}

export abstract class AsyncResponseManager {
  protected apiHost: string
  protected cable?: Consumer
  protected handles: Record<string, Handle> = {}
  protected ready?: Promise<Subscription>
  protected subscription?: Subscription

  constructor(opts: AsyncResponseManagerOpts) {
    this.apiHost = opts.apiHost
  }

  async connect() {
    if (!this.ready) {
      this.cable = await this.createCable()
      this.cable.ensureActiveConnection()
      this.ready = this.createSubscription()
      await this.ready
    }
  }

  createAsyncHandle() {
    const asyncHandle = randomString(12)
    this.handles[asyncHandle] = createHandle()
    return asyncHandle
  }

  protected abstract createCable(): Promise<Consumer>

  protected async createSubscription(): Promise<Subscription> {
    this.subscription = await new Promise<Subscription>((resolve, reject) => {
      this.subscription = this.cable?.subscriptions?.create("AsyncResponseChannel", {
          connected: () => resolve(this.subscription as Subscription),
          rejected: (reason?: any) => reject(reason),
          received: (d: { asyncHandle: string }) => {
            const handle = this.handles[d.asyncHandle]
            if (handle) {
              handle.resolve(d)
              setTimeout(() => delete this.handles[d.asyncHandle], 60000)
            }
          },
          disconnected: (opts?: { willAttemptReconnect: boolean }) => {
            if (!opts?.willAttemptReconnect) {
              for (const asyncHandle of Object.keys(this.handles)) {
                const handle: Handle = this.handles[asyncHandle]
                handle.reject("AsyncResponseChannel disconnected")
              }
              this.handles = {}
            }
          },
        })
    })
    return this.subscription
  }

  async waitFor<T>(asyncHandle: string): Promise<T> {
    await this.connect()
    const handle = this.handles[asyncHandle] ?? createHandle()
    this.handles[asyncHandle] = handle
    return handle.promise
  }
}

