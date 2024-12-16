import Select, { components as ReactSelectComponents } from "react-select";
import { useFrontendClient } from "../hooks/frontend-client-context";
import { useAccounts } from "../hooks/use-accounts";
import { useFormFieldContext } from "../hooks/form-field-context";
import { useCustomize } from "../hooks/customization-context";
import type { BaseReactSelectProps } from "../hooks/customization-context";
import { useMemo } from "react";
import type { CSSProperties } from "react";
import type { OptionProps } from "react-select";
import type {
  AppResponse, ConfigurablePropApp,
} from "@pipedream/sdk";

const BaseOption = (props: OptionProps<AppResponse>) => {
  // const imgSrc =
  //   props.data.img_src ?? `https://pipedream.com/s.v0/${props.data.id}/logo/48`
  return (
    <ReactSelectComponents.Option {...props}>
      {/*<img src={`https://pipedream.com/s.v0/${props.data.id}/logo/48`} style={{width: 24, float: "left", marginRight: 10}} alt={props.data.name} />*/}
      {props.data.name}
    </ReactSelectComponents.Option>
  );
};

type ControlAppProps = {
  app: AppResponse;
};

export function ControlApp({ app }: ControlAppProps) {
  const client = useFrontendClient();
  const formFieldCtx = useFormFieldContext<ConfigurablePropApp>();
  const {
    id, prop, value, onChange,
  } = formFieldCtx;

  const {
    getProps, select, theme,
  } = useCustomize();

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

  const baseSelectProps: BaseReactSelectProps = {
    components: {
      Option: BaseOption,
    },
    styles: {
      control: (base) => ({
        ...base,
        gridArea: "control",
        boxShadow: theme.boxShadow.input,
      }),
    },
  };
  const selectProps =  select.getProps("controlAppSelect", baseSelectProps);

  const oauthAppId = undefined; // XXX allow customizing
  const {
    isLoading: isLoadingAccounts,
    // TODO error
    accounts,
    refetch: refetchAccounts,
  } = useAccounts(
    {
      app: app.name_slug,
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

  const selectValue = useMemo(() => {
    let ret = value;
    if (ret != null) {
      for (const item of accounts) {
        if (ret.authProvisionId === item.id) {
          ret = item;
          break;
        }
      }
    }
    return ret;
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
      {isLoadingAccounts ?
        `Loading ${app.name} accounts...`
        : accounts.length ?
          <Select
            instanceId={id}
            value={selectValue}
            options={[
              ...accounts,
              {
                id: "_new",
                name: `Connect new ${app.name} account...`,
              },
            ]}
            {...selectProps}
            required={true}
            placeholder={`Select ${app.name} account...`}
            isLoading={isLoadingAccounts}
            isClearable={true}
            isSearchable={true}
            getOptionLabel={(a) => a.name}
            getOptionValue={(a) => a.id}
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
          :
          <button type="button" {...getProps("connectButton", baseStylesConnectButton, {
            app,
            ...formFieldCtx,
          })} onClick={() => startConnectAccount()}>
          Connect {app.name}
          </button>
      }
    </div>
  );
}
