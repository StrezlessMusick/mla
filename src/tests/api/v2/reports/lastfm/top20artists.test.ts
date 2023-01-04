import { LastFMApiEndpointFactory } from "@src/backend/api/exports";
import { mockLastFMProxyMethods } from "@src/backend/api/services/lastfm/proxy/__mocks__/proxy.class.mock";
import apiRoutes from "@src/config/apiRoutes";
import handleProxy, {
  endpointFactory,
} from "@src/pages/api/v2/reports/lastfm/top20artists/[username]";
import { createAPIMocks } from "@src/tests/fixtures/mock.authentication";
import type { MockAPIRequestType } from "@src/backend/api/types/services/request.types";
import type { MockAPIResponseType } from "@src/backend/api/types/services/response.types";
import type { APIClientHttpMethodType } from "@src/contracts/api/exports.types";

jest.mock("@src/backend/api/integrations/auth/vendor", () =>
  require("@fixtures/api/auth").authenticated()
);

jest.mock("@src/backend/api/integrations/api.logger/vendor");

jest.mock("@src/backend/api/services/lastfm/proxy/proxy.class");

const endpointUnderTest = apiRoutes.v2.reports.lastfm.top20artists;

type ArrangeArgs = {
  username: string;
  method: APIClientHttpMethodType;
};

describe(endpointUnderTest, () => {
  let mockReq: MockAPIRequestType;
  let mockRes: MockAPIResponseType;
  const mockResponse = {
    artists: [],
    image: [],
  };
  let username: string;
  let method: APIClientHttpMethodType;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const actRequest = async ({ username, method = "GET" }: ArrangeArgs) => {
    ({ req: mockReq, res: mockRes } = createAPIMocks({
      url: endpointUnderTest,
      method,
      query: { username },
    }));
    await handleProxy(mockReq, mockRes);
  };

  describe("An instance of the endpoint factory class", () => {
    it("should inherit from LastFMApiEndpointFactory", () => {
      expect(endpointFactory).toBeInstanceOf(LastFMApiEndpointFactory);
    });

    it("should have the correct route set", () => {
      expect(endpointFactory.route).toBe(endpointUnderTest);
    });

    it("should have the correct maxAgeValue set", () => {
      expect(endpointFactory.cacheMaxAgeValue).toBe(3600 * 24);
    });

    it("should have flag restrictions bypassed", () => {
      expect(endpointFactory.flag).toBe(null);
    });
  });

  describe("with a valid session", () => {
    describe("receives a GET request", () => {
      beforeEach(() => {
        method = "GET" as const;
      });

      describe("with valid data", () => {
        beforeEach(async () => {
          username = "test_user";
        });

        describe("with a valid lastfm response", () => {
          beforeEach(async () => {
            mockLastFMProxyMethods.getUserTopArtists.mockReturnValueOnce(
              Promise.resolve(mockResponse)
            );
            await actRequest({ username, method });
          });

          it("should return a 200 status code", () => {
            expect(mockRes._getStatusCode()).toBe(200);
            expect(mockRes._getJSONData()).toStrictEqual(mockResponse);
          });

          it("should set a Cache-Control header", () => {
            expect(mockRes._getHeaders()["cache-control"]).toStrictEqual([
              "public",
              `max-age=${endpointFactory.cacheMaxAgeValue}`,
            ]);
          });

          it("should call the proxy method with the correct params", () => {
            expect(mockLastFMProxyMethods.getUserTopArtists).toBeCalledWith(
              username
            );
          });
        });
      });
    });
  });
});
