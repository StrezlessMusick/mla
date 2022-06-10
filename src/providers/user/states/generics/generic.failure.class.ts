import ReducerStateBaseClass from "../user.reducer.states.base.class";
import type { UserStateInterface } from "../../../../types/user/state.types";

class ReducerGenericFailureFetch extends ReducerStateBaseClass<"FailureFetch"> {
  type = "FailureFetch" as const;

  generateState(): UserStateInterface {
    return {
      data: {
        integration: this.action.integration,
        report: this.initialReport,
      },
      error: this.action.type,
      inProgress: false,
      profileUrl: null,
      ready: true,
      retries: this.initialRetries,
      userName: this.action.userName,
    };
  }
}

export default ReducerGenericFailureFetch;