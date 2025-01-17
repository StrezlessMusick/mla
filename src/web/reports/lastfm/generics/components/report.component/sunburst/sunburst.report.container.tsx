import { useEffect } from "react";
import useSunBurstLayoutController from "./controllers/sunburst.report.layout.controller.hook";
import SunBurstReport from "./sunburst.report.component";
import BillBoardProgressBar from "@src/components/billboard/billboard.progress.bar/billboard.progress.bar.component";
import useSunBurstController from "@src/hooks/controllers/sunburst.controller.hook";
import Events from "@src/web/analytics/collection/events/definitions";
import useAnalytics from "@src/web/analytics/collection/state/hooks/analytics.hook";
import useTranslation from "@src/web/locale/translation/hooks/translation.hook";
import useMetrics from "@src/web/metrics/collection/state/hooks/metrics.hook";
import LastFMErrorDisplayContainer from "@src/web/reports/lastfm/generics/components/error.display/error.display.container";
import type { userHookAsLastFM } from "@src/types/user/hook.types";
import type SunBurstBaseReportState from "@src/web/reports/generics/state/providers/encapsulations/lastfm/sunburst/user.state.base.sunburst.report.class";
import type SunBurstBaseReport from "@src/web/reports/lastfm/generics/state/queries/sunburst.query.base.class";
import type { LastFMSunBurstDrawerInterface } from "@src/web/reports/lastfm/generics/types/components/drawer/sunburst.types";
import type { LastFMAggregateReportResponseInterface } from "@src/web/reports/lastfm/generics/types/state/aggregate.report.types";

interface SunBurstReportContainerProps<
  T extends SunBurstBaseReportState<unknown>
> {
  lastfm: userHookAsLastFM;
  userName: string;
  reportClass: new () => SunBurstBaseReport<T>;
}

export default function SunBurstReportContainer<
  UserStateType extends SunBurstBaseReportState<unknown>
>({
  lastfm,
  userName,
  reportClass,
}: SunBurstReportContainerProps<UserStateType>) {
  const analytics = useAnalytics();
  const { t: lastFMt } = useTranslation("lastfm");
  const { t: sunBurstT } = useTranslation("sunburst");
  const metrics = useMetrics();
  const sunBurstController = useSunBurstController();
  const sunBurstLayoutController = useSunBurstLayoutController();

  const report = new reportClass();

  useEffect(() => {
    lastfm.clear();
    report.startDataFetch(lastfm, userName);
    return () => lastfm.clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!report.getReportData(lastfm.userProperties).status.complete) return;
    analytics.event(
      report
        .getEncapsulatedNode(sunBurstController.node.selected)
        .getDrawerEvent()
    );
    sunBurstLayoutController.update();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sunBurstController.node.selected]);

  useEffect(() => {
    if (report.queryIsResumable(lastfm.userProperties)) {
      report.startDataFetch(lastfm, userName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastfm.userProperties]);

  useEffect(() => {
    if (report.queryIsDataReady(lastfm.userProperties)) {
      lastfm.ready();
      metrics.increment("SearchMetric");
      analytics.event(
        Events.LastFM.ReportPresented(report.getAnalyticsReportType())
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastfm.userProperties]);

  return (
    <LastFMErrorDisplayContainer<
      LastFMAggregateReportResponseInterface<unknown>,
      LastFMSunBurstDrawerInterface
    >
      report={report}
      userProperties={lastfm.userProperties}
    >
      <BillBoardProgressBar
        details={report.getProgressDetails(lastfm.userProperties, sunBurstT)}
        titleText={lastFMt(
          `${String(report.getReportTranslationKey())}.communication`
        )}
        visible={!lastfm.userProperties.ready}
        value={report.getProgressPercentage(lastfm.userProperties)}
      />
      <SunBurstReport<UserStateType>
        encapsulatedReportState={report.getEncapsulatedReportState(
          lastfm.userProperties
        )}
        lastFMt={lastFMt}
        report={report}
        sunBurstT={sunBurstT}
        sunBurstController={sunBurstController}
        sunBurstLayoutController={sunBurstLayoutController}
        visible={lastfm.userProperties.ready}
      />
    </LastFMErrorDisplayContainer>
  );
}
