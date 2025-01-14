import type { PopUpComponentType } from "./popups/popups.component.types";
import type { PopUpComponentNameType } from "./popups/popups.state.types";
import type {
  VendorColourHookType,
  VendorColourModeType,
  VendorColourType,
  VendorConfigType,
  VendorProviderProps,
  VendorStateType,
} from "@src/vendors/integrations/ui.framework/_types/vendor.service.types";
import type usePopUpsController from "@src/vendors/integrations/ui.framework/web/popups/controller/popups.controller.hook";
import type PopUpsControllerProvider from "@src/vendors/integrations/ui.framework/web/popups/provider/popups.provider";
import type { PopUpsControllerContext } from "@src/vendors/integrations/ui.framework/web/popups/provider/popups.provider";

export type UIVendorColourType = VendorColourType;

export type UIVendorColourHookType = VendorColourHookType;

export interface UIVendorColourModeHookInterface {
  colourMode: VendorColourModeType;
  toggle: () => void;
}

export type UIVendorColourModeType = VendorColourModeType;

export interface UIVendorFormHookInterface {
  error: {
    close: (fieldname: string) => void;
    open: (fieldname: string, message: string) => void;
  };
}

export interface UIVendorCreatePopUpHookInterface {
  name: PopUpComponentNameType;
  message: string;
  component: PopUpComponentType;
}

export type UIVendorProviderComponentProps = VendorProviderProps;

export type UIVendorStateType = VendorStateType;

export interface UIFrameworkVendorInterface {
  core: {
    colourHook: () => UIVendorColourHookType;
    colourModeHook: () => UIVendorColourModeHookInterface;
    config: VendorConfigType;
    formHook: () => UIVendorFormHookInterface;
    Provider: (props: UIVendorProviderComponentProps) => JSX.Element;
  };
  popups: {
    controllerHook: typeof usePopUpsController;
    creatorHook: (props: UIVendorCreatePopUpHookInterface) => null;
    Context: typeof PopUpsControllerContext;
    Provider: typeof PopUpsControllerProvider;
  };
}
