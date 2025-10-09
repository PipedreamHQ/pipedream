import type {
  PropOptionValue,
  PropOption,
  ConfigurePropResponse as SdkConfigurePropResponse,
  ReloadPropsResponse as SdkReloadPropsResponse,
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

// Redefine to be compatible with SDK's PropOption
// SDK: export interface PropOption { label: string; value?: PropOptionValue }
export type LabelValueOption<
  T extends PropOptionValue = PropOptionValue
> = Omit<PropOption, "value"> & { value?: T };

export type NestedLabelValueOption<
  T extends PropOptionValue = PropOptionValue
> = {
  __lv: LabelValueOption<T> | LabelValueOption<T>[] | T | T[];
}

export type RawPropOption<
  T extends PropOptionValue = PropOptionValue
> =
  | T
  | NestedLabelValueOption<T>
  | { lv: LabelValueOption<T> | LabelValueOption<T>[] }
  | LabelValueOption<T>

export type ConfigureComponentContext = Record<string, unknown>

export type ConfigureComponentResponse = SdkConfigurePropResponse & {
    observations: Observation[];
}

export type ReloadComponentPropsResponse = SdkReloadPropsResponse & {
    observations: Observation[];
}

export type DynamicProps = SdkReloadPropsResponse["dynamicProps"]
