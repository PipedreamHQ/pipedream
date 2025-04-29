export type SdkError = {
    name: string;
    message: string;
}

export type Observation = {
    ts: number;
    k: string;
    h?: string;
    err?: Error;
}
