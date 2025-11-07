import * as t from "io-ts";
import axios, { transformConfigForOauth } from "./axios";
import { AxiosRequestConfig as AxiosConfig } from "axios";
export { axios, transformConfigForOauth, };
export { cloneSafe, jsonStringifySafe, } from "./utils";
export { ConfigurationError, } from "./errors";
export { default as sqlProp, } from "./sql-prop";
export type { ColumnSchema, DbInfo, TableInfo, TableMetadata, TableSchema, } from "./sql-prop";
export { default as sqlProxy, } from "./sql-proxy";
export { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL, } from "./constants";
export declare const SendConfigEmail: t.PartialC<{
    html: t.StringC;
    subject: t.StringC;
    text: t.StringC;
}>;
export type SendConfigEmail = t.TypeOf<typeof SendConfigEmail>;
export declare const SendConfigEmit_required: t.ExactC<t.TypeC<{
    raw_event: t.ObjectC;
}>>;
export declare const SendConfigEmit_optional: t.PartialC<{
    event: t.ObjectC;
}>;
export declare const SendConfigEmit: t.IntersectionC<[t.ExactC<t.TypeC<{
    raw_event: t.ObjectC;
}>>, t.PartialC<{
    event: t.ObjectC;
}>]>;
export type SendConfigEmit = t.TypeOf<typeof SendConfigEmit>;
export declare const HTTP_METHODS: string[];
export declare const SendConfigHTTP: t.IntersectionC<[t.ExactC<t.TypeC<{
    method: t.KeyofC<{}>;
    url: t.StringC;
}>>, t.PartialC<{
    auth: t.ExactC<t.TypeC<{
        password: t.StringC;
        username: t.StringC;
    }>>;
    data: t.UnionC<[t.StringC, t.ObjectC]>;
    headers: t.ObjectC;
    params: t.ObjectC;
}>]>;
export type SendConfigHTTP = t.TypeOf<typeof SendConfigHTTP>;
export declare const SendConfigS3: t.ExactC<t.TypeC<{
    bucket: t.StringC;
    payload: t.UnionC<[t.StringC, t.ObjectC]>;
    prefix: t.StringC;
}>>;
export type SendConfigS3 = t.TypeOf<typeof SendConfigS3>;
export declare const SendConfigSQL: t.ExactC<t.TypeC<{
    payload: t.UnionC<[t.StringC, t.ObjectC]>;
    table: t.StringC;
}>>;
export type SendConfigSQL = t.TypeOf<typeof SendConfigSQL>;
export declare const SendConfigSnowflake: t.ExactC<t.TypeC<{
    account: t.StringC;
    database: t.StringC;
    host: t.StringC;
    payload: t.UnionC<[t.StringC, t.ObjectC]>;
    pipe_name: t.StringC;
    private_key: t.StringC;
    schema: t.StringC;
    stage_name: t.StringC;
    user: t.StringC;
}>>;
export type SendConfigSnowflake = t.TypeOf<typeof SendConfigSnowflake>;
export declare const SendConfigSSE: t.ExactC<t.TypeC<{
    channel: t.StringC;
    payload: t.UnionC<[t.StringC, t.ObjectC]>;
}>>;
export type SendConfigSSE = t.TypeOf<typeof SendConfigSSE>;
interface SendFunctionsWrapper {
    email: (config: SendConfigEmail) => void;
    emit: (config: SendConfigEmit) => void;
    http: (config: SendConfigHTTP) => void;
    s3: (config: SendConfigS3) => void;
    sql: (config: SendConfigSQL) => void;
    snowflake: (config: SendConfigSnowflake) => void;
    sse: (config: SendConfigSSE) => void;
}
export declare const sendTypeMap: {
    email: t.PartialC<{
        html: t.StringC;
        subject: t.StringC;
        text: t.StringC;
    }>;
    emit: t.IntersectionC<[t.ExactC<t.TypeC<{
        raw_event: t.ObjectC;
    }>>, t.PartialC<{
        event: t.ObjectC;
    }>]>;
    http: t.IntersectionC<[t.ExactC<t.TypeC<{
        method: t.KeyofC<{}>;
        url: t.StringC;
    }>>, t.PartialC<{
        auth: t.ExactC<t.TypeC<{
            password: t.StringC;
            username: t.StringC;
        }>>;
        data: t.UnionC<[t.StringC, t.ObjectC]>;
        headers: t.ObjectC;
        params: t.ObjectC;
    }>]>;
    s3: t.ExactC<t.TypeC<{
        bucket: t.StringC;
        payload: t.UnionC<[t.StringC, t.ObjectC]>;
        prefix: t.StringC;
    }>>;
    sql: t.ExactC<t.TypeC<{
        payload: t.UnionC<[t.StringC, t.ObjectC]>;
        table: t.StringC;
    }>>;
    snowflake: t.ExactC<t.TypeC<{
        account: t.StringC;
        database: t.StringC;
        host: t.StringC;
        payload: t.UnionC<[t.StringC, t.ObjectC]>;
        pipe_name: t.StringC;
        private_key: t.StringC;
        schema: t.StringC;
        stage_name: t.StringC;
        user: t.StringC;
    }>>;
    sse: t.ExactC<t.TypeC<{
        channel: t.StringC;
        payload: t.UnionC<[t.StringC, t.ObjectC]>;
    }>>;
};
export declare let $event: any;
export declare const END_NEEDLE = "__pd_end";
export declare function $end(message?: string): void;
export declare let $send: SendFunctionsWrapper;
export declare const $sendConfigRuntimeTypeChecker: {};
export interface AxiosRequestConfig extends AxiosConfig {
    debug?: boolean;
    body?: any;
    returnFullResponse?: boolean;
}
