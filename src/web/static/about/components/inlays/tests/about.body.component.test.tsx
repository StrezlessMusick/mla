import { Avatar, Box, Center, Flex, Text } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import Body from "../about.body.component";
import ClickLink from "@src/components/clickable/click.link.external/click.link.external.component";
import SVSIconContainer from "@src/components/icons/svs/svs.icon.container";
import DimOnHover from "@src/components/styles/hover.dim/hover.dim.style";
import dialogueSettings from "@src/config/dialogue";
import externalLinks from "@src/config/external";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import { MockUseTranslation } from "@src/web/locale/translation/hooks/__mocks__/translation.hook.mock";
import mockUseRouter from "@src/web/navigation/routing/hooks/__mocks__/router.hook.mock";

jest.mock("@chakra-ui/react", () =>
  require("@fixtures/chakra").createChakraMock([
    "Avatar",
    "Box",
    "Center",
    "Flex",
    "Text",
  ])
);

jest.mock(
  "@src/components/clickable/click.link.external/click.link.external.component",
  () => require("@fixtures/react/parent").createComponent("ClickLink")
);

jest.mock("@src/components/styles/hover.dim/hover.dim.style", () =>
  require("@fixtures/react/parent").createComponent("DimOnHover")
);

jest.mock("@src/components/icons/svs/svs.icon.container", () =>
  require("@fixtures/react/child").createComponent("SVSIconContainer")
);

describe("AboutBody", () => {
  const mockT = new MockUseTranslation("about").t;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return render(<Body router={mockUseRouter} t={mockT} />);
  };

  describe("when rendered", () => {
    beforeEach(() => arrange());

    it("should call Avatar as expected to display the logo", () => {
      expect(Avatar).toBeCalledTimes(1);
      const call = jest.mocked(Avatar).mock.calls[0][0];
      expect(call.width).toStrictEqual(dialogueSettings.iconSizes);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(renderToString(call.icon!)).toBe(
        renderToString(
          <SVSIconContainer {...dialogueSettings.iconComponentProps} />
        )
      );
      expect(Object.keys(call).length).toBe(2);
    });

    it("should call Box with the correct props", () => {
      expect(Box).toBeCalledTimes(2);
      checkMockCall(
        Box,
        {
          mb: 3,
        },
        0
      );
      checkMockCall(
        Box,
        {
          mb: [5, 5, 8],
        },
        1
      );
    });

    it("should call Center with the correct props", () => {
      expect(Center).toBeCalledTimes(1);
      checkMockCall(Center, {}, 0);
    });

    it("should call Flex with the correct props", () => {
      expect(Flex).toBeCalledTimes(1);
      checkMockCall(
        Flex,
        {
          align: "center",
          justify: "center",
        },
        0
      );
    });

    it("should call Text with the correct props", () => {
      expect(Text).toBeCalledTimes(2);
      checkMockCall(
        Text,
        {
          fontSize: ["xxs"],
          ml: 2,
        },
        0
      );
      checkMockCall(
        Text,
        {
          fontSize: dialogueSettings.mediumTextFontSize,
          ml: 2,
        },
        1
      );
    });

    it("should call ClickLink with the correct props", () => {
      expect(ClickLink).toBeCalledTimes(1);
      checkMockCall(ClickLink, { href: externalLinks.svs });
    });

    it("should call DimOnHover with the correct props", () => {
      expect(DimOnHover).toBeCalledTimes(1);
      checkMockCall(DimOnHover, {});
    });
  });
});
