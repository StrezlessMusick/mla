import { render } from "@testing-library/react";
import lastfmTranslations from "@locales/lastfm.json";
import ErrorBoundaryContainer from "@src/components/errors/boundary/error.boundary.container";
import SearchContainer from "@src/components/search/lastfm/search.container";
import routes from "@src/config/routes";
import Events from "@src/events/events";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import { _t } from "@src/hooks/__mocks__/locale.hook.mock";
import Page, { getServerSideProps } from "@src/pages/search/lastfm/top20albums";
import {
  mockServerSideProps,
  mockUtilities,
} from "@src/vendors/integrations/web.framework/__mocks__/vendor.ssr.mock";

jest.mock("@src/hooks/locale.hook");

jest.mock("@src/vendors/integrations/web.framework/vendor.ssr");

jest.mock("@src/components/errors/boundary/error.boundary.container", () =>
  require("@fixtures/react/parent").createComponent("ErrorBoundary")
);

jest.mock("@src/components/search/lastfm/search.container", () =>
  require("@fixtures/react/parent").createComponent("SearchUI")
);

describe("getServerSideProps", () => {
  it("should be the return value of serverSideProps", () => {
    expect(getServerSideProps).toBe(mockServerSideProps);
  });

  it("should be generated by a correct call to serverSideProps", () => {
    expect(mockUtilities.serverSideProps).toBeCalledTimes(1);
    expect(mockUtilities.serverSideProps).toBeCalledWith({
      pageKey: "search",
      translations: ["lastfm"],
    });
  });
});

describe("SearchTopAlbums", () => {
  const arrange = () => {
    render(<Page />);
  };

  beforeEach(() => jest.clearAllMocks());

  describe("when rendered", () => {
    beforeEach(() => arrange());

    it("should render the ErrorBoundary component with the correct props", () => {
      expect(ErrorBoundaryContainer).toBeCalledTimes(1);
      checkMockCall(
        ErrorBoundaryContainer,
        {
          route: routes.home,
          eventDefinition: Events.General.Error,
        },
        0,
        ["stateReset"]
      );
    });

    it("should render the SearchContainer component with the correct props", () => {
      expect(SearchContainer).toBeCalledTimes(1);
      checkMockCall(
        SearchContainer,
        {
          route: routes.reports.lastfm.top20albums,
          titleText: _t(lastfmTranslations.top20Albums.searchTitle),
        },
        0
      );
    });
  });
});
