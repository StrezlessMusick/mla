import { Box } from "@chakra-ui/react";
import { render, screen, within } from "@testing-library/react";
import mockControllerHook from "../../navbar.hooks/__mocks__/navbar.ui.controller.mock";
import NavBarOptions from "../../navbar.options/navbar.options.component";
import NavBarMobileMenu, { testIDs } from "../navbar.mobile.menu.component";
import navConfig from "@src/config/navbar";
import mockAnalyticsHook from "@src/hooks/__mocks__/analytics.mock";
import mockRouterHook from "@src/hooks/__mocks__/router.mock";
import checkMockCall from "@src/tests/fixtures/mock.component.call";

jest.mock("../../navbar.options/navbar.options.component", () =>
  require("@fixtures/react/parent").createComponent("NavBarOptions")
);

jest.mock("@chakra-ui/react", () =>
  require("@fixtures/chakra").createChakraMock(["Box"])
);

describe("NavBarMobileMenu", () => {
  let mockTransaction: boolean;

  const mockConfig = navConfig.menuConfig;
  const mockedNavBarComponents = {
    NavBarOptions: "NavBarOptions",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    render(
      <NavBarMobileMenu
        analytics={{ trackButtonClick: mockAnalyticsHook.trackButtonClick }}
        config={mockConfig}
        controls={mockControllerHook.controls}
        transaction={mockTransaction}
        router={{ path: mockRouterHook.path }}
      />
    );
  };

  const checkNotRendered = () => {
    it("should NOT render the mobile menu", () => {
      expect(Box).toBeCalledTimes(0);
      expect(screen.queryByTestId(testIDs.NavBarMobileMenu)).toBeNull();
    });
  };

  const checkRendered = () => {
    it("should render the mobile menu Chakra Box component with the expected props", () => {
      expect(Box).toBeCalledTimes(1);
      checkMockCall(
        Box,
        {
          "data-testid": testIDs.NavBarMobileMenu,
          pb: 4,
          display: { sm: "none" },
        },
        0
      );
    });

    it("should ALSO render the mobile menu NavBarOptions component inside the mobile menu Box component", async () => {
      expect(NavBarOptions).toBeCalledTimes(1);
      const menu = await screen.findByTestId(testIDs.NavBarMobileMenu);
      within(menu).findByTestId(mockedNavBarComponents.NavBarOptions);
      checkMockCall(
        NavBarOptions,
        {
          closeMobileMenu: mockControllerHook.controls.mobileMenu.setFalse,
          config: mockConfig,
          currentPath: mockRouterHook.path,
          transaction: mockTransaction,
          tracker: mockAnalyticsHook.trackButtonClick,
        },
        0
      );
    });
  };

  describe("when there is a transaction in progress", () => {
    beforeEach(() => (mockTransaction = true));

    describe("when the mobile menu is open", () => {
      beforeEach(() => {
        mockControllerHook.controls.mobileMenu.state = true;

        arrange();
      });

      checkRendered();
    });

    describe("when the mobile menu is closed", () => {
      beforeEach(() => {
        mockControllerHook.controls.mobileMenu.state = false;

        arrange();
      });

      checkNotRendered();
    });
  });

  describe("when there is NOT a transaction in progress", () => {
    beforeEach(() => (mockTransaction = false));

    describe("when the mobile menu is open", () => {
      beforeEach(() => {
        mockControllerHook.controls.mobileMenu.state = true;

        arrange();
      });

      checkRendered();
    });

    describe("when the mobile menu is closed", () => {
      beforeEach(() => {
        mockControllerHook.controls.mobileMenu.state = false;

        arrange();
      });

      checkNotRendered();
    });
  });
});