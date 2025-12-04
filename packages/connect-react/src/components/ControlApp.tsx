import Select, { components as ReactSelectComponents } from "react-select";
import { useFrontendClient } from "../hooks/frontend-client-context";
import { useAccounts } from "../hooks/use-accounts";
import { useFormFieldContext } from "../hooks/form-field-context";
import { useFormContext } from "../hooks/form-context";
import { useCustomize } from "../hooks/customization-context";
import type { BaseReactSelectProps } from "../hooks/customization-context";
import { defaultTheme } from "../theme";
import { useMemo } from "react";
import type { CSSProperties } from "react";
import type { OptionProps } from "react-select";
import type {
  Account,
  App,
  ConfigurablePropApp,
} from "@pipedream/sdk";

const BaseOption = (props: OptionProps<SelectValue>) => {
  // const imgSrc =
  //   props.data.img_src ?? `https://pipedream.com/s.v0/${props.data.id}/logo/48`
  return (
    <ReactSelectComponents.Option {...props}>
      {/*<img src={`https://pipedream.com/s.v0/${props.data.id}/logo/48`} style={{width: 24, float: "left", marginRight: 10}} alt={props.data.name} />*/}
      {props.data.name}
    </ReactSelectComponents.Option>
  );
};

type AccountPlaceholder = {
  id: "_new";
  name: string;
}
type SelectValue = Account | AccountPlaceholder;

type ControlAppProps = {
  app: App;
};

export function ControlApp({ app }: ControlAppProps) {
  const client = useFrontendClient();
  const {
    externalUserId, oauthAppConfig,
  } = useFormContext();
  const formFieldCtx = useFormFieldContext<ConfigurablePropApp>();
  const {
    id, prop, value, onChange,
  } = formFieldCtx;

  const {
    getProps, select, theme,
  } = useCustomize();
  const resolveColor = (
    key: keyof typeof defaultTheme.colors,
    fallback: string,
  ) => {
    const current = theme.colors[key];
    const baseline = defaultTheme.colors[key];
    return current && current !== baseline
      ? current
      : fallback;
  };

  const surface = resolveColor("neutral0", "var(--pd-surface, #0f1011)");
  const border = resolveColor("neutral20", "var(--pd-border, rgba(255,255,255,0.16))");
  const text = resolveColor("neutral80", "var(--pd-text, #e5e7eb)");
  const textStrong = resolveColor("neutral90", "var(--pd-text-strong, #f9fafb)");
  const primary25 = resolveColor("primary25", "var(--pd-primary-25, rgba(59,130,246,0.18))");
  const surfaceStrong = resolveColor("neutral10", "var(--pd-surface-strong, rgba(255,255,255,0.06))");

  const baseStyles: CSSProperties = {
    color: theme.colors.neutral60,
    gridArea: "control",
  };
  const baseStylesConnectButton: CSSProperties = {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius,
    border: "solid 1px",
    borderColor: theme.colors.primary25,
    color: theme.colors.primary25,
    padding: "0.25rem 0.5rem",
    gridArea: "control",
  };

  const baseSelectProps: BaseReactSelectProps<SelectValue> = {
    components: {
      Option: BaseOption,
    },
    styles: {
      control: (base) => ({
        ...base,
        gridArea: "control",
        backgroundColor: surface,
        borderColor: border,
        color: text,
        boxShadow: theme.boxShadow.input,
      }),
      menu: (base) => ({
        ...base,
        backgroundColor: surface,
        boxShadow: theme.boxShadow.dropdown,
      }),
      singleValue: (base) => ({
        ...base,
        color: text,
      }),
      input: (base) => ({
        ...base,
        color: text,
      }),
      option: (base, state) => ({
        ...base,
        backgroundColor: state.isSelected
          ? primary25
          : state.isFocused
            ? surfaceStrong
            : base.backgroundColor
              ?? surface,
        color: textStrong,
      }),
    },
  };
  const selectProps = select.getProps("controlAppSelect", baseSelectProps);

  const oauthAppId = oauthAppConfig?.[app.nameSlug];
  const {
    isLoading: isLoadingAccounts,
    // TODO error
    accounts,
    refetch: refetchAccounts,
  } = useAccounts(
    {
      external_user_id: externalUserId,
      app: app.nameSlug,
      oauth_app_id: oauthAppId,
    },
    {
      useQueryOpts: {
        enabled: !!app,
        suspense: !!app,
      },
    },
  );

  const startConnectAccount = async () => {
    client.connectAccount({
      app: prop.app,
      oauthAppId,
      onSuccess: async (res) => {
        await refetchAccounts();
        onChange({
          authProvisionId: res.id,
        });
      },
      onError: () => {
        // TODO
      },
    });
  };

  const newAccountPlaceholder: AccountPlaceholder = {
    id: "_new",
    name: `Connect new ${app.name} account...`,
  };

  const selectOptions = useMemo<SelectValue[]>(() => [
    ...accounts,
    newAccountPlaceholder,
  ], [
    accounts,
  ]);

  const selectValue = useMemo<SelectValue>(() => {
    if (value?.authProvisionId) {
      for (const item of accounts) {
        if (value.authProvisionId === item.id) {
          return item;
        }
      }
    }

    return newAccountPlaceholder;
  }, [
    accounts,
    value,
  ]);

  // XXX loading / skeleton hooks
  return (
    <div {...getProps("controlApp", baseStyles, {
      app,
      ...formFieldCtx,
    })}>
      {isLoadingAccounts
        ? `Loading ${app.name} accounts...`
        : accounts.length
          ? (
            <Select
              instanceId={id}
              value={selectValue}
              options={selectOptions}
              {...selectProps}
              // These must come AFTER selectProps spread to avoid being overridden
              classNamePrefix="react-select"
              required={true}
              placeholder={`Select ${app.name} account...`}
              isLoading={isLoadingAccounts}
              isClearable={true}
              isSearchable={true}
              getOptionLabel={(a) => a.name ?? ""}
              getOptionValue={(a) => a.id}
              menuPortalTarget={
                typeof document !== "undefined"
                  ? document.body
                  : null
              }
              menuPosition="fixed"
              styles={{
                ...selectProps.styles,
                menuPortal: (base) => ({
                  ...base,
                  zIndex: 99999,
                }),
              }}
              onChange={(a) => {
                if (a) {
                  if (a.id === "_new") {
                    // start connect account and then select it, etc.
                    // TODO unset / put in loading state
                    startConnectAccount();
                  } else {
                    onChange({
                      authProvisionId: a.id,
                    });
                  }
                } else {
                  onChange(undefined);
                }
              }}
            />
          )
          : (
            <button type="button" {...getProps("connectButton", baseStylesConnectButton, {
              app,
              ...formFieldCtx,
            })} onClick={() => startConnectAccount()}>
              Connect {app.name}
            </button>
          )
      }
    </div>
  );
}
