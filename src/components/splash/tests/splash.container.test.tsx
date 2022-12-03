import { render } from "@testing-library/react";
import BodyComponent from "../inlays/splash.body.component";
import FooterComponent from "../inlays/splash.footer.component";
import ToggleComponent from "../inlays/splash.toggle.component";
import SplashContainer from "../splash.container";
import DialogueContainer from "@src/components/dialogues/resizable/dialogue.resizable.container";
import { checkTProp, MockUseLocale } from "@src/hooks/__mocks__/locale.mock";

jest.mock("@src/hooks/locale");

jest.mock(
  "@src/components/dialogues/resizable/dialogue.resizable.container",
  () => require("@fixtures/react/child").createComponent("DialogueContainer")
);

describe("SplashContainer", () => {
  const mockT = new MockUseLocale("splash").t;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return render(<SplashContainer />);
  };

  describe("when rendered", () => {
    beforeEach(() => arrange());

    checkTProp({
      name: "Dialogue",
      component: DialogueContainer,
      namespace: "splash",
    });

    it("should render the Dialogue component as expected", () => {
      expect(DialogueContainer).toBeCalledTimes(1);
      const call = jest.mocked(DialogueContainer).mock.calls[0][0];
      expect(call.t).toBeDefined();
      expect(call.titleText).toBe(mockT("title"));
      expect(call.BodyComponent).toBe(BodyComponent);
      expect(call.HeaderComponent).toBeUndefined();
      expect(call.FooterComponent).toBe(FooterComponent);
      expect(call.ToggleComponent).toBe(ToggleComponent);
      expect(Object.keys(call).length).toBe(5);
    });
  });
});