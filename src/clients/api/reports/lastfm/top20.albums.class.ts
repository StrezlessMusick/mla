import LastFMBaseReport from "./lastfm.base.class";
import apiRoutes from "../../../../config/apiRoutes";
import type { LastFMTopAlbumsReportResponseInterface } from "../../../../types/clients/api/reports/lastfm.types";

class LastFMTopAlbumsReport extends LastFMBaseReport<LastFMTopAlbumsReportResponseInterface> {
  route = apiRoutes.v1.reports.lastfm.top20albums;
  integration = "LAST.FM" as const;
  eventType = "TOP20 ALBUMS" as const;
}

export default LastFMTopAlbumsReport;