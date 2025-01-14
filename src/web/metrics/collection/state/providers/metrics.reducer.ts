import UserReducerStates from "./metrics.reducer.states.class";
import reducerLoggingMiddleware from "@src/utilities/react/state/reducers/reducer.logger";
import withMiddleware from "@src/utilities/react/state/reducers/reducer.middleware";
import type { MetricsActionType } from "@src/web/metrics/collection/types/state/action.types";
import type { MetricsStateType } from "@src/web/metrics/collection/types/state/state.types";

const metricsReducer = (state: MetricsStateType, action: MetricsActionType) => {
  const stateMethod = action.type;
  const stateGenerator = new UserReducerStates();
  const newState = stateGenerator[stateMethod](state, action);
  return newState;
};

const middlewares = [reducerLoggingMiddleware];
export const MetricsReducer = withMiddleware<
  MetricsStateType,
  MetricsActionType
>(metricsReducer, middlewares);
