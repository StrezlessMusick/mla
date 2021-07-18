import * as status from "../../config/status.js";
import { postData } from "../http";

describe("postData", () => {
  const remotesite = "https://remotesite.com/";
  const postContent = { info: "Love this website!" };
  type responseType = { success: boolean };

  beforeAll(() => {
    window.fetch = require("node-fetch");
    jest.spyOn(window, "fetch");
  });
  afterAll(() => jest.restoreAllMocks());

  afterEach(() => jest.clearAllMocks());

  const setupFetch = ({
    success,
    status,
  }: {
    success: boolean;
    status: number;
  }) => {
    (window.fetch as jest.Mock).mockResolvedValueOnce({
      status,
      ok: success,
      json: async () => ({ success }),
    });
  };

  const setupFetchWithNetworkError = () => {
    (window.fetch as jest.Mock).mockResolvedValueOnce(() => {
      throw Error("Mock Error!");
    });
  };

  const arrange = () => {
    return postData<typeof postContent, responseType>(remotesite, postContent);
  };

  describe("when an 'ok' status is returned", () => {
    beforeEach(() => setupFetch({ success: true, status: 200 }));

    it("should call the underlying fetch function correctly", async () => {
      const response = await arrange();
      expect(fetch).toBeCalledTimes(1);
      expect(fetch).toBeCalledWith(remotesite, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        referrerPolicy: "same-origin",
        body: JSON.stringify(postContent),
      });
    });

    it("should return a success message", async () => {
      const response = await arrange();
      expect(response).toStrictEqual({
        status: 200,
        response: { success: true },
      });
    });
  });

  describe("when a '429' status code is returned", () => {
    beforeEach(() => setupFetch({ success: false, status: 429 }));

    it("should call the underlying fetch function correctly", () => {
      arrange().catch(() => {});
      expect(fetch).toBeCalledTimes(1);
      expect(fetch).toBeCalledWith(remotesite, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        referrerPolicy: "same-origin",
        body: JSON.stringify(postContent),
      });
    });

    it("should throw the correct error message", async () => {
      const response = await arrange();
      expect(response).toStrictEqual({
        status: 429,
        response: status.STATUS_429_MESSAGE,
      });
    });
  });

  describe("when a 'not ok' status is returned", () => {
    beforeEach(() => setupFetch({ success: false, status: 400 }));

    it("should call the underlying fetch function correctly", () => {
      arrange().catch(() => {});
      expect(fetch).toBeCalledTimes(1);
      expect(fetch).toBeCalledWith(remotesite, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        referrerPolicy: "same-origin",
        body: JSON.stringify(postContent),
      });
    });

    it("should throw the correct error message", () => {
      const response = arrange();
      expect(response).rejects.toStrictEqual(
        Error(`Error when fetching: ${remotesite}`)
      );
    });
  });

  describe("when a network error occurs", () => {
    beforeEach(() => setupFetchWithNetworkError());

    it("should call the underlying fetch function correctly", () => {
      arrange().catch(() => {});
      expect(fetch).toBeCalledTimes(1);
      expect(fetch).toBeCalledWith(remotesite, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        referrerPolicy: "same-origin",
        body: JSON.stringify(postContent),
      });
    });

    it("should throw the correct error message", () => {
      const response = arrange();
      expect(response).rejects.toStrictEqual(
        Error(`Error when fetching: ${remotesite}`)
      );
    });
  });
});
