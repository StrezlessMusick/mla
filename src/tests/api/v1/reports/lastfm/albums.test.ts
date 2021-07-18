import { NextApiRequest, NextApiResponse } from "next";
import { createMocks, MockRequest, MockResponse } from "node-mocks-http";
import handleProxy from "../../../../../pages/api/v1/reports/lastfm/albums";
import apiEndpoints from "../../../../../config/apiEndpoints";
import { HttpMethodType } from "../../../../../types/https.types";
import * as status from "../../../../../config/status";
import { ProxyError } from "../../../../../errors/proxy.error.class";

const mockBackendResponse = jest.fn();
jest.mock("../../../../../integrations/lastfm/proxy.class.ts", () => {
  return jest.fn().mockImplementation(() => {
    return {
      getTopAlbums: mockBackendResponse,
    };
  });
});

type ArrangeArgs = {
  body: object;
  method: HttpMethodType;
};

describe(apiEndpoints.v1.reports.lastfm.albums, () => {
  let req: MockRequest<NextApiRequest>;
  let res: MockResponse<NextApiResponse>;
  let mockError = "Mock Error";
  let mockResponse = {
    albums: [],
    image: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = async ({ body, method = "POST" }: ArrangeArgs) => {
    ({ req: req, res: res } = createMocks<NextApiRequest, NextApiResponse>({
      url: apiEndpoints.v1.reports.lastfm.albums,
      method,
      body,
    }));
    await handleProxy(req, res);
  };

  describe("receives a GET request", () => {
    beforeEach(async () => {
      await arrange({ body: {}, method: "GET" });
    });

    it("should return a 405", () => {
      expect(res._getStatusCode()).toBe(405);
      expect(res._getJSONData()).toStrictEqual(status.STATUS_405_MESSAGE);
    });
  });

  describe("receives a POST request", () => {
    describe("with no data", () => {
      beforeEach(async () => {
        await arrange({ body: {}, method: "POST" });
      });

      it("should return a 400 status code", () => {
        expect(res._getStatusCode()).toBe(400);
        expect(res._getJSONData()).toStrictEqual(status.STATUS_400_MESSAGE);
      });
    });
    describe("with invalid data", () => {
      beforeEach(async () => {
        await arrange({ body: { userName: 1234 }, method: "POST" });
      });

      it("should return a 400 status code", () => {
        expect(res._getStatusCode()).toBe(400);
        expect(res._getJSONData()).toStrictEqual(status.STATUS_400_MESSAGE);
      });
    });
    describe("with valid data", () => {
      describe("with a lastfm error", () => {
        beforeEach(async () => {
          mockBackendResponse.mockImplementationOnce(() => {
            throw new Error(mockError);
          });
          await arrange({ body: { userName: "string" }, method: "POST" });
        });

        it("should return a 502 status code", () => {
          expect(res._getStatusCode()).toBe(502);
          expect(res._getJSONData()).toStrictEqual(status.STATUS_502_MESSAGE);
        });
      });
      describe("with a lastfm ratelimiting error", () => {
        beforeEach(async () => {
          mockBackendResponse.mockImplementationOnce(() => {
            throw new ProxyError(mockError, 429);
          });
          await arrange({ body: { userName: "string" }, method: "POST" });
        });

        it("should return a 429 status code", () => {
          expect(res._getStatusCode()).toBe(429);
          expect(res._getJSONData()).toStrictEqual(status.STATUS_429_MESSAGE);
        });
      });
      describe("with a valid lastfm response", () => {
        beforeEach(async () => {
          mockBackendResponse.mockReturnValueOnce(
            Promise.resolve(mockResponse)
          );
          await arrange({ body: { userName: "string" }, method: "POST" });
        });

        it("should return a 200 status code", () => {
          expect(res._getStatusCode()).toBe(200);
          expect(res._getJSONData()).toStrictEqual(mockResponse);
        });
      });
    });
  });
});