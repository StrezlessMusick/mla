import { render } from "@testing-library/react";
import routes from "@src/config/routes";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import FourOhFour from "@src/pages/404";
import Page, {
  getServerSideProps,
} from "@src/pages/reports/lastfm/playCountByArtist";
import {
  mockServerSideProps,
  mockUtilities,
} from "@src/vendors/integrations/web.framework/__mocks__/vendor.ssr.mock";
import ReportPage from "@src/web/reports/lastfm/generics/components/report.page/report.page";
import PlayCountByArtistReport from "@src/web/reports/lastfm/playcount.artists/components/playcount.artists.container";

jest.mock("@src/vendors/integrations/web.framework/vendor.ssr");

jest.mock(
  "@src/web/reports/lastfm/generics/components/report.page/report.page",
  () => require("@fixtures/react/parent").createComponent("ReportPage")
);

jest.mock(
  "@src/web/reports/lastfm/playcount.artists/components/playcount.artists.container",
  () =>
    require("@fixtures/react/parent").createComponent("PlayCountByArtistReport")
);

jest.mock("@src/pages/404", () =>
  require("@fixtures/react/parent").createComponent("FourOhFour")
);

describe("getServerSideProps", () => {
  it("should be the return value of serverSideProps", () => {
    expect(getServerSideProps).toBe(mockServerSideProps);
  });

  it("should be generated by a correct call to serverSideProps", () => {
    expect(mockUtilities.serverSideProps).toBeCalledTimes(1);
    expect(mockUtilities.serverSideProps).toBeCalledWith({
      pageKey: "lastfm",
      translations: ["lastfm", "sunburst"],
    });
  });
});

describe(routes.reports.lastfm.playCountByArtist, () => {
  beforeEach(() => jest.clearAllMocks());

  const arrange = () => {
    render(<Page />);
  };

  describe("when rendered", () => {
    beforeEach(() => {
      arrange();
    });

    it("should call the ReportPage correctly", () => {
      expect(ReportPage).toBeCalledTimes(1);
      checkMockCall(
        ReportPage,
        {
          ReportContainer: PlayCountByArtistReport,
          NoUserComponent: FourOhFour,
        },
        0,
        ["stateReset"]
      );
    });
  });
});
