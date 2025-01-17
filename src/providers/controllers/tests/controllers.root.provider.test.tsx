import { render, screen } from "@testing-library/react";
import ControllerRootProvider from "../controllers.root.provider";
import ImagesControllerProvider from "../images/images.provider";
import ScrollBarsControllerProvider from "../scrollbars/scrollbars.provider";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import NavBarControllerProvider from "@src/web/navigation/navbar/state/providers/navbar.provider";

jest.mock("../images/images.provider", () =>
  require("@fixtures/react/parent").createComponent("ImagesControllerProvider")
);

jest.mock("@src/web/navigation/navbar/state/providers/navbar.provider", () =>
  require("@fixtures/react/parent").createComponent("NavBarControllerProvider")
);

jest.mock("../scrollbars/scrollbars.provider", () =>
  require("@fixtures/react/parent").createComponent(
    "ScrollBarsControllerProvider"
  )
);

describe("UserInterfaceRootProvider", () => {
  const mockChildComponent = "MockChildComponent";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return render(
      <ControllerRootProvider>
        <div>{mockChildComponent}</div>
      </ControllerRootProvider>
    );
  };

  describe("when rendered", () => {
    beforeEach(() => arrange());

    it("should call ImagesControllerProvider with the correct props", () => {
      expect(ImagesControllerProvider).toBeCalledTimes(1);
      checkMockCall(ImagesControllerProvider, {});
    });

    it("should call NavBarControllerProvider with the correct props", () => {
      expect(NavBarControllerProvider).toBeCalledTimes(1);
      checkMockCall(NavBarControllerProvider, {});
    });

    it("should call ScrollBarsControllerProvider with the correct props", () => {
      expect(ScrollBarsControllerProvider).toBeCalledTimes(1);
      checkMockCall(ScrollBarsControllerProvider, {});
    });

    it("should return the mock child component", async () => {
      expect(await screen.findByText(mockChildComponent)).toBeTruthy();
    });
  });
});
