import { useEffect } from "react";
import NavBar from "./navbar.root.component";
import useAnalytics from "@src/web/analytics/collection/state/hooks/analytics.hook";
import useAuth from "@src/web/authentication/session/hooks/auth.hook";
import useTranslation from "@src/web/locale/translation/hooks/translation.hook";
import useRouter from "@src/web/navigation/routing/hooks/router.hook";
import useLastFM from "@src/web/reports/lastfm/generics/state/hooks/lastfm.hook";
import type { NavBarControllerHookType } from "@src/web/navigation/navbar/state/controllers/navbar.layout.controller.hook";

interface NavBarRootContainerProps {
  config: { [index: string]: string };
  controller: NavBarControllerHookType;
}

export default function NavBarRootContainer({
  config,
  controller,
}: NavBarRootContainerProps) {
  const analytics = useAnalytics();
  const { status: authStatus, user } = useAuth();
  const { t: navBarT } = useTranslation("navbar");
  const { userProperties } = useLastFM();
  const router = useRouter();

  const isTransaction = () =>
    !userProperties.ready || authStatus === "processing";

  useEffect(() => {
    if (isTransaction()) controller.controls.mobileMenu.setFalse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProperties, authStatus]);

  return (
    <NavBar
      analytics={{ trackButtonClick: analytics.trackButtonClick }}
      controls={controller.controls}
      config={config}
      navBarT={navBarT}
      transaction={isTransaction()}
      router={{ path: router.path }}
      rootReference={controller.rootReference}
      user={{
        name: user?.name,
        image: user?.image,
      }}
    />
  );
}
