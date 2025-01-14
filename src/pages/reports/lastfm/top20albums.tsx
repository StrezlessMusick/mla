import FourOhFour from "../../404";
import { webFrameworkVendorSSR } from "@src/vendors/integrations/web.framework/vendor.ssr";
import ReportPage from "@src/web/reports/lastfm/generics/components/report.page/report.page";
import Top20AlbumsReport from "@src/web/reports/lastfm/top20.albums/components/top20.albums.container";
import type { userHookAsLastFMTop20AlbumReport } from "@src/types/user/hook.types";

export default function LastFMTop20Albums() {
  return (
    <ReportPage<userHookAsLastFMTop20AlbumReport>
      NoUserComponent={FourOhFour}
      ReportContainer={Top20AlbumsReport}
    />
  );
}

export const getServerSideProps =
  webFrameworkVendorSSR.utilities.serverSideProps({
    pageKey: "lastfm",
    translations: ["cards", "lastfm"],
  });
