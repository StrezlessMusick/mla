import mockUserState from "./states/state.data.set.1.json";
import SunBurstDrawer from "../../common/sunburst.report.drawer/sunburst.report.drawer.component";
import SunBurstBaseReport from "../../common/sunburst.report/sunburst.report.base.class";
import PlayCountByArtistNode from "../playcount.artists.node.class";
import PlayCountByArtistReport from "../playcount.artists.report.class";
import routes from "@src/config/routes";
import PlayCountByArtistState from "@src/providers/user/encapsulations/lastfm/sunburst/playcount.by.artist/user.state.playcount.by.artist.sunburst.report.class";
import type { PlayCountByArtistReportInterface } from "@src/types/clients/api/lastfm/response.types";
import type { AggregateBaseReportResponseInterface } from "@src/types/integrations/base.types";
import type { LastFMUserStateBase } from "@src/types/user/state.types";

describe(PlayCountByArtistReport.name, () => {
  let instance: PlayCountByArtistReport;

  const arrange = () => (instance = new PlayCountByArtistReport());

  describe("when initialized", () => {
    beforeEach(() => arrange());

    it("should be a descendent of SunBurstBaseReport", () => {
      expect(instance).toBeInstanceOf(SunBurstBaseReport);
    });

    it("should have the expected properties", () => {
      expect(instance.drawerComponent).toBe(SunBurstDrawer);
      expect(instance.analyticsReportType).toBe("PLAYCOUNT BY ARTIST");
      expect(instance.encapsulationClass).toBe(PlayCountByArtistState);
      expect(instance.nodeEncapsulationClass).toBe(PlayCountByArtistNode);
      expect(instance.translationKey).toBe("playCountByArtist");
      expect(instance.retryRoute).toBe(routes.search.lastfm.playCountByArtist);
      expect(instance.hookMethod).toBe("playCountByArtist");
      expect(instance.entityKeys).toStrictEqual([
        "artists",
        "albums",
        "tracks",
      ]);
    });

    describe("getReportData", () => {
      let result: AggregateBaseReportResponseInterface<
        PlayCountByArtistReportInterface[]
      >;

      beforeEach(
        () =>
          (result = instance.getReportData(
            mockUserState as LastFMUserStateBase
          ))
      );

      it("should return the correct result", () => {
        expect(result).toBe(mockUserState.data.report.playCountByArtist);
      });
    });
  });
});
