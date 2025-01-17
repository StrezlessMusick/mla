import LastFMReportQueryAbstractBaseClass from "@src/web/reports/lastfm/generics/state/queries/bases/query.base.class";
import type translations from "@locales/lastfm.json";
import type { ImagesControllerHookType } from "@src/hooks/controllers/images.controller.hook";
import type { tFunctionType } from "@src/vendors/types/integrations/locale/vendor.types";
import type FlipCardUserState from "@src/web/reports/generics/state/providers/encapsulations/lastfm/flipcard/user.state.base.flipcard.report.class";
import type { LastFMFlipCardDrawerInterface } from "@src/web/reports/lastfm/generics/types/components/drawer/flip.card.types";
import type { FlipCardReportStateQueryInterface } from "@src/web/reports/lastfm/generics/types/state/queries/flip.card.types";
import type { FC } from "react";

export default abstract class FlipCardAbstractBaseReport<
    ReportState extends FlipCardUserState,
    ReportDataType extends unknown[]
  >
  extends LastFMReportQueryAbstractBaseClass<
    ReportState,
    ReportDataType,
    LastFMFlipCardDrawerInterface<ReportState>
  >
  implements
    FlipCardReportStateQueryInterface<
      ReportState,
      ReportDataType,
      LastFMFlipCardDrawerInterface<ReportState>
    >
{
  protected abstract drawerComponent: FC<
    LastFMFlipCardDrawerInterface<ReportState>
  >;
  protected abstract encapsulationClass: new (
    reportProperties: ReportState["userProperties"],
    t: tFunctionType
  ) => ReportState;
  protected abstract drawerArtWorkAltTextTranslationKey: string;

  protected abstract hookMethod: "top20albums" | "top20artists" | "top20tracks";
  protected abstract translationKey: keyof typeof translations;

  getDrawerArtWorkAltTextTranslationKey() {
    return this.drawerArtWorkAltTextTranslationKey;
  }

  queryIsImagesLoaded(
    reportProperties: ReportState["userProperties"],
    imagesController: ImagesControllerHookType
  ) {
    return !(
      imagesController.count < this.getNumberOfImageLoads(reportProperties)
    );
  }

  queryUserHasNoData(reportProperties: ReportState["userProperties"]) {
    return (
      reportProperties.ready &&
      reportProperties.userName !== null &&
      this.getReportData(reportProperties).length === 0
    );
  }
  abstract getNumberOfImageLoads(
    reportProperties: ReportState["userProperties"]
  ): number;

  abstract getReportData(
    reportProperties: ReportState["userProperties"]
  ): ReportDataType;
}
