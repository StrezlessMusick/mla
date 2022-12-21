import type { ProxyError } from "@src/backend/api/lastfm/proxy/error/proxy.error.class";
import type { ParameterizedVendorApiHandlerType } from "@src/backend/integrations/api.handler/vendor.types";
import type { ApiEndpointRequestType } from "@src/types/api/request.types";
import type { ApiEndpointResponseType } from "@src/types/api/response.types";

export interface ApiHandlerVendorFactoryInterface {
  create: () => ApiHandlerVendorHandlerType;
}

export interface ApiHandlerVendorFactoryConstructorInterface {
  errorHandler: (
    error: ProxyError,
    req: ApiEndpointRequestType,
    res: ApiEndpointResponseType,
    next: () => void
  ) => void;
  fallBackHandler: (
    req: ApiEndpointRequestType,
    res: ApiEndpointResponseType
  ) => void;
}

export type ApiHandlerVendorHandlerType = ParameterizedVendorApiHandlerType<
  ApiEndpointRequestType,
  ApiEndpointResponseType
>;

export interface ApiHandlerVendorInterface {
  HandlerFactory: new (
    props: ApiHandlerVendorFactoryConstructorInterface
  ) => ApiHandlerVendorFactoryInterface;
}