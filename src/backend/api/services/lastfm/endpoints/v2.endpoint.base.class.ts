import LastFMEndpointBase from "./bases/endpoint.base.class";
import * as status from "@src/config/status";
import { authVendorBackend } from "@src/vendors/integrations/auth/vendor.backend";
import { flagVendorBackend } from "@src/vendors/integrations/flags/vendor.backend";
import type { LastFMProxyInterface } from "@src/backend/api/types/services/lastfm/proxy.types";
import type {
  ApiEndpointRequestType,
  ApiEndpointRequestPathParamType,
} from "@src/backend/api/types/services/request.types";
import type { ApiEndpointResponseType } from "@src/backend/api/types/services/response.types";

export default abstract class LastFMApiEndpointFactoryV2 extends LastFMEndpointBase {
  protected readonly delay: number = 500;
  public abstract readonly flag: string | null;
  public readonly cacheMaxAgeValue = 3600 * 24;

  protected setUpHandler(): void {
    this.handler.get(this.route, async (req, res, next) => {
      await this.waitToAvoidRateLimiting();
      const authClient = new authVendorBackend.Client(req);
      const token = await authClient.getSession();
      const [params, paramErrors] = this.getParams(req);
      if (!token) {
        this.unauthorizedRequest(res);
      } else if (paramErrors) {
        this.invalidRequest(res);
      } else if (!(await this.isEnabled())) {
        res.status(404).json(status.STATUS_404_MESSAGE);
      } else {
        const proxyResponse = await this.queryProxy(req, res, next, params);
        if (this.isProxyResponseValid(proxyResponse)) {
          this.validProxyResponse(req, res, proxyResponse);
        } else {
          this.invalidProxyResponse(req, res);
        }
      }
      next();
    });
  }

  protected waitToAvoidRateLimiting(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, this.delay));
  }

  protected getParams(
    req: ApiEndpointRequestType
  ): [ApiEndpointRequestPathParamType, boolean] {
    const params = req.query as ApiEndpointRequestPathParamType;
    const error = !params.username;
    return [params, error];
  }

  protected async isEnabled(): Promise<boolean> {
    if (!this.flag) return true;

    const client = new flagVendorBackend.Client(
      process.env.NEXT_PUBLIC_FLAG_ENVIRONMENT
    );

    return await client.isEnabled(this.flag);
  }

  protected unauthorizedRequest(res: ApiEndpointResponseType): void {
    res.status(401).json(status.STATUS_401_MESSAGE);
  }

  protected invalidRequest(res: ApiEndpointResponseType): void {
    res.status(400).json(status.STATUS_400_MESSAGE);
  }

  protected async queryProxy(
    req: ApiEndpointRequestType,
    res: ApiEndpointResponseType,
    next: () => void,
    params: ApiEndpointRequestPathParamType
  ): Promise<
    ReturnType<Awaited<LastFMProxyInterface[keyof LastFMProxyInterface]>>
  > {
    this.setRequestTimeout(req, res, next);
    const proxyResponse = await this.getProxyResponse(params);
    this.clearRequestTimeout(req);
    return proxyResponse;
  }

  protected isProxyResponseValid(
    proxyResponse: Awaited<
      ReturnType<LastFMProxyInterface[keyof LastFMProxyInterface]>
    >
  ): boolean {
    if (proxyResponse) return true;
    return false;
  }

  protected invalidProxyResponse(
    req: ApiEndpointRequestType,
    res: ApiEndpointResponseType
  ): void {
    req.proxyResponse = "Invalid LAST.FM response, please retry.";
    res.setHeader("retry-after", 0);
    res.status(503).json(status.STATUS_503_MESSAGE);
  }

  protected validProxyResponse(
    req: ApiEndpointRequestType,
    res: ApiEndpointResponseType,
    proxyResponse: Awaited<
      ReturnType<LastFMProxyInterface[keyof LastFMProxyInterface]>
    >
  ): void {
    req.proxyResponse = "Success!";
    res.setHeader("Cache-Control", [
      "public",
      `max-age=${this.cacheMaxAgeValue}`,
    ]);
    res.status(200).json(proxyResponse);
  }
}
