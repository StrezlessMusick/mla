import LastFMReportBaseClient from "@src/web/api/lastfm/lastfm.api.client.base.class";
import type { userDispatchType } from "@src/types/user/context.types";
import type { EventCreatorType } from "@src/web/analytics/collection/events/types/event.types";
import type { LastFMReportClientParamsInterface } from "@src/web/api/lastfm/types/report.client.types";
import type UserSunBurstReportBaseState from "@src/web/reports/generics/state/providers/encapsulations/lastfm/sunburst/user.state.base.sunburst.report.class";
abstract class LastFMBaseSunBurstDataPointClient<
  ReportType,
  ResponseType
> extends LastFMReportBaseClient<ResponseType> {
  protected encapsulatedState: UserSunBurstReportBaseState<ReportType>;

  constructor(
    dispatch: userDispatchType,
    event: EventCreatorType,
    encapsulatedState: UserSunBurstReportBaseState<ReportType>
  ) {
    super(dispatch, event);
    this.encapsulatedState = encapsulatedState;
  }

  protected isComplete() {
    return this.encapsulatedState.getReportStatus().complete;
  }

  protected getDispatchState() {
    return this.encapsulatedState.getDispatchState();
  }

  protected updateReport(params: LastFMReportClientParamsInterface) {
    this.encapsulatedState.updateWithResponse(
      this.response.response,
      params,
      this.route
    );
  }

  protected isInitialParams(params: LastFMReportClientParamsInterface) {
    return (
      JSON.stringify(params) === JSON.stringify({ userName: params.userName })
    );
  }

  protected handleBegin(params: LastFMReportClientParamsInterface): void {
    if (this.isInitialParams(params)) {
      this.dispatch({
        type: "StartFetch",
        userName: params.userName,
        integration: this.integration,
      });
    } else {
      this.dispatch({
        type: "DataPointStartFetch",
      });
    }
  }

  protected handleFailure(params: LastFMReportClientParamsInterface) {
    if (this.isInitialParams(params)) {
      super.handleFailure(params);
    } else {
      // There may have been a problem updating the entity, so remove it completely as a fall back.
      this.encapsulatedState.removeEntity(params);
      this.dispatch({
        type: "DataPointFailureFetch",
        data: this.getDispatchState(),
      });
    }
  }

  protected handleNotFound(params: LastFMReportClientParamsInterface): void {
    if (this.response.status === 404) {
      if (this.isInitialParams(params)) {
        super.handleNotFound(params);
      } else {
        // There may have been a problem updating the entity, so remove it completely as a fall back.
        this.encapsulatedState.removeEntity(params);
        this.dispatch({
          type: "DataPointNotFoundFetch",
          data: this.getDispatchState(),
        });
      }
    }
  }

  protected handleTimeout(params: LastFMReportClientParamsInterface): void {
    if (this.response.status === 503) {
      const backOff = parseInt(this.response?.headers["retry-after"]);
      if (!isNaN(backOff)) {
        setTimeout(() => {
          this.dispatch({
            type: "DataPointTimeoutFetch",
          });
        }, backOff * 1000);
      } else {
        super.handleFailure(params);
      }
    }
  }

  protected handleSuccessful(params: LastFMReportClientParamsInterface): void {
    if (this.response.status === 200) {
      this.updateReport(params);
      if (this.isComplete()) {
        this.dispatch({
          type: "SuccessFetch",
          userName: params.userName,
          data: this.getDispatchState(),
          integration: this.integration,
        });
      } else {
        this.dispatch({
          type: "DataPointSuccessFetch",
          data: this.getDispatchState(),
        });
      }
    }
  }
}

export default LastFMBaseSunBurstDataPointClient;
