import LastFMTrackInfo from "../track.info";
import apiRoutes from "@src/config/apiRoutes";
import LastFMReportBaseClient from "@src/web/api/lastfm/lastfm.api.client.base.class";
import type UserSunBurstReportBaseState from "@src/web/reports/generics/state/providers/encapsulations/lastfm/sunburst/user.state.base.sunburst.report.class";

describe("LastFMTrackInfo", () => {
  const mockDispatch = jest.fn();
  const mockEvent = jest.fn();
  const mockEncapsulation =
    jest.fn() as unknown as UserSunBurstReportBaseState<unknown>;
  let instance: LastFMTrackInfo<unknown>;

  const arrange = () => {
    return new LastFMTrackInfo(mockDispatch, mockEvent, mockEncapsulation);
  };

  describe("when a request returns not found", () => {
    beforeEach(() => {
      instance = arrange();
    });

    it("should be an instance of the LastFMBaseClient abstract base class", () => {
      expect(instance).toBeInstanceOf(LastFMReportBaseClient);
    });

    it("should have the correct api route configured", () => {
      expect(instance.route).toBe(apiRoutes.v2.data.artists.tracksGet);
    });
  });
});
