import { render } from "@testing-library/react";
import ReportPage from "../../../components/reports/lastfm/common/report.page/report.page";
import Top20ArtistsReport from "../../../components/reports/lastfm/top20.artists/top20.artists.container";
import routes from "../../../config/routes";
import FourOhFour from "../../../pages/404";
import Page from "../../../pages/reports/lastfm/top20artists";
import getPageProps from "../../../utils/page.props.static";
import mockCheckCall from "../../fixtures/mock.component.call";

jest.mock("../../../utils/page.props.static", () => jest.fn());

jest.mock(
  "../../../components/reports/lastfm/common/report.page/report.page",
  () => createMockedComponent("ReportPage")
);

jest.mock(
  "../../../components/reports/lastfm/top20.artists/top20.artists.container",
  () => createMockedComponent("Top20ArtistsReport")
);

jest.mock("../../../pages/404", () => createMockedComponent("FourOhFour"));

const createMockedComponent = (name: string) => {
  const {
    factoryInstance,
  } = require("../../../tests/fixtures/mock.component.children.factory.class");
  return factoryInstance.create(name);
};

describe("getStaticProps", () => {
  it("should be generated by the correct call to pagePropsGenerator", () => {
    expect(getPageProps).toBeCalledTimes(1);
    expect(getPageProps).toBeCalledWith({
      pageKey: "lastfm",
      translations: ["cards", "lastfm"],
    });
  });
});

describe(routes.reports.lastfm.top20artists, () => {
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
      mockCheckCall(
        ReportPage,
        {
          ReportContainer: Top20ArtistsReport,
          NoUserComponent: FourOhFour,
        },
        0,
        ["stateReset"]
      );
    });
  });
});