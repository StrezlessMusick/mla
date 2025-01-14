import type { BillBoardProgressBarDetails } from "@src/components/billboard/billboard.progress.bar/billboard.progress.bar.component";
import type { userDispatchType } from "@src/types/user/context.types";
import type { LastFMUserStateBase } from "@src/types/user/state.types";
import type { tFunctionType } from "@src/vendors/types/integrations/locale/vendor.types";
import type { EventCreatorType } from "@src/web/analytics/collection/events/types/event.types";
import type LastFMSunburstDataClient from "@src/web/api/lastfm/data/sunburst/sunburst.client.base.class";
import type UserSunBurstReportBaseState from "@src/web/reports/generics/state/providers/encapsulations/lastfm/sunburst/user.state.base.sunburst.report.class";
import type ReportBaseState from "@src/web/reports/generics/state/providers/encapsulations/lastfm/user.state.base.class";
import type {
  d3Node,
  SunBurstData,
} from "@src/web/reports/generics/types/charts/sunburst.types";
import type SunBurstBaseNodeEncapsulation from "@src/web/reports/lastfm/generics/components/report.component/sunburst/encapsulations/sunburst.node.encapsulation.base.class";
import type { LastFMReportStateQueryInterface } from "@src/web/reports/lastfm/generics/types/state/queries/base.types";

export type SunBurstReportStateQueryConstructor<AggregateReportType> = new (
  dispatch: userDispatchType,
  eventCreator: EventCreatorType,
  encapsulatedState: UserSunBurstReportBaseState<AggregateReportType>
) => LastFMSunburstDataClient<AggregateReportType>;

export type SunBurstReportStateEncapsulationConstructor<AggregateReportType> =
  new (
    state: LastFMUserStateBase
  ) => UserSunBurstReportBaseState<AggregateReportType>;

export interface SunBurstReportStateQueryInterface<
  ReportState extends ReportBaseState,
  CompletedReportDataType,
  DrawerComponentProps
> extends LastFMReportStateQueryInterface<
    ReportState,
    CompletedReportDataType,
    DrawerComponentProps
  > {
  getEncapsulatedNode(node: d3Node): SunBurstBaseNodeEncapsulation;

  getEntities(): Array<SunBurstData["entity"]>;

  getEntityLeaf(): SunBurstData["entity"];

  getEntityTopLevel(): SunBurstData["entity"];

  getProgressPercentage(
    reportProperties: ReportState["userProperties"]
  ): number;

  getProgressDetails(
    reportProperties: ReportState["userProperties"],
    t: tFunctionType
  ): BillBoardProgressBarDetails;

  getSunBurstData(
    reportProperties: ReportState["userProperties"],
    rootTag: string,
    remainderTag: string
  ): SunBurstData;

  queryIsResumable(reportProperties: ReportState["userProperties"]): boolean;
}
