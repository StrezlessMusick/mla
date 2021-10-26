import { render } from "@testing-library/react";
import mockLastFMHook from "../../../../../hooks/tests/lastfm.mock.hook";
import UserInterfaceImageProvider from "../../../../../providers/ui/ui.images/ui.images.provider";
import FlipCardReportContainer from "../../common/flip.card.report/flip.card.report.container";
import Top20ArtistsContainer from "../top20.artists.container";
import Top20ArtistsReport from "../top20.artists.report.class";
import type { userHookAsLastFMTop20ArtistReport } from "../../../../../types/user/hook.types";

jest.mock("../../common/flip.card.report/flip.card.report.container", () =>
  createMockedComponent("FlipCardReport")
);

const createMockedComponent = (name: string) => {
  const {
    factoryInstance,
  } = require("../../../../../tests/fixtures/mock.component.children.factory.class");
  return factoryInstance.create(name);
};

describe("Top20ReportContainer", () => {
  const mockUsername = "niall-byrne";
  const mockTypedLastFMHook =
    mockLastFMHook as userHookAsLastFMTop20ArtistReport;

  beforeEach(() => {
    jest.clearAllMocks();
    arrange();
  });

  const arrange = () => {
    render(
      <UserInterfaceImageProvider>
        <Top20ArtistsContainer
          userName={mockUsername}
          user={mockTypedLastFMHook}
        />
      </UserInterfaceImageProvider>
    );
  };

  it("should call the FlipCardReport component", () => {
    const call = (FlipCardReportContainer as jest.Mock).mock.calls[0][0];
    expect(call.user).toBe(mockTypedLastFMHook);
    expect(call.userName).toBe(mockUsername);
    expect(call.reportClass).toBe(Top20ArtistsReport);
  });
});
