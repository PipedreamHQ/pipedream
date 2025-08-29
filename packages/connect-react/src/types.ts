import type {
  ConfigureComponentResponse as SdkConfigureComponentResponse,
  ReloadComponentPropsResponse as SdkReloadComponentPropsResponse,
} from "@pipedream/sdk";

export type SdkError = {
    name: string;
    message: string;
}

export type ObservationBase = {
    ts: number;
    k: string;
    h?: string;
}

export type ObservationErrorDetails = {
    name: string;
    message: string;
    stack: string;
}

export type ObservationError = {
    err: ObservationErrorDetails;
}

export type ObservationLog = {
    msg: string;
}

export type Observation = ObservationBase & (
  | ObservationError
  | ObservationLog
)

export type LabelValueOption<T> = {
  label: string;
  value: T;
}

export type NestedLabelValueOption<T> = {
  __lv: LabelValueOption<T> | T;
}

export type RawPropOption<T> =
    | T
    | NestedLabelValueOption<T>
    | LabelValueOption<T>

export type ConfigureComponentContext = Record<string, unknown>

export type ConfigureComponentResponse = SdkConfigureComponentResponse & {
    observations: Observation[];
}

export type ReloadComponentPropsResponse = SdkReloadComponentPropsResponse & {
    observations: Observation[];
}

export type DynamicProps = SdkReloadComponentPropsResponse["dynamicProps"]
