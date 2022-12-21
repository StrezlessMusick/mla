import LastFMEndpointBase from "@src/backend/api/lastfm/endpoints/bases/endpoint.base.class";
import type { ApiRequestPathParamType } from "@src/types/api/request.types";

export default class ConcreteBaseEndpointTimeoutErrorClass extends LastFMEndpointBase {
  public route = "/api/v1/endpoint";
  public timeOut = 100;

  protected setUpHandler(): void {
    this.handler.get(this.route, async (req, res, next) => {
      this.setRequestTimeout(req, res, next);
      const response = await this.getProxyResponse({});
      res.status(200).json(response);
      next();
    });
  }

  protected async getProxyResponse(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _: ApiRequestPathParamType
  ): Promise<never[]> {
    function timeout(ms: number) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms * 2);
      });
    }
    await timeout(this.timeOut * 2);
    return [];
  }
}