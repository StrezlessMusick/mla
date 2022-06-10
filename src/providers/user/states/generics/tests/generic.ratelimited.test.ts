import { mockInitialReportData } from "../../../tests/fixtures/mock.user.state.data";
import ReducerState from "../generic.ratelimited.class";
import type { UserActionType } from "../../../../../types/user/action.types";
import type { UserStateInterface } from "../../../../../types/user/state.types";

const testType = "RatelimitedFetch";
type actionType = UserActionType & { type: typeof testType };

describe(testType, () => {
  let stateClass: ReducerState;
  let action: actionType;
  let received: UserStateInterface;
  const emptyState = {} as UserStateInterface;
  const testIntegrationType = "TEST";
  const testUserName = "testUserName";

  const arrange = (state: UserStateInterface, action: actionType) => {
    stateClass = new ReducerState(state, action);
    received = stateClass.apply();
  };

  describe("When Initialized", () => {
    describe("apply", () => {
      describe("with a matching action", () => {
        beforeEach(() => {
          action = {
            type: testType,
            userName: testUserName,
            integration: testIntegrationType,
          };
          arrange(emptyState, action);
        });

        it("should return the correct state", () => {
          expect(received.inProgress).toBe(false);
          expect(received.profileUrl).toBe(null);
          expect(received.userName).toBe(testUserName);
          expect(received.data).toStrictEqual({
            integration: testIntegrationType,
            report: mockInitialReportData,
          });
          expect(received.error).toBe(testType);
          expect(received.ready).toBe(true);
          expect(received.retries).toBe(stateClass.initialRetries);
        });
      });

      describe("with a NON matching action", () => {
        beforeEach(() => {
          action = {
            type: "UnknownType",
          } as unknown as actionType;
          arrange(emptyState, action);
        });

        it("should return the correct state", () => {
          expect(received).toStrictEqual(emptyState);
        });
      });
    });
  });
});