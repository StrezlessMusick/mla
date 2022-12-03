import SunBurstEntityNodeList from "./node.list.component";
import SunBurstNodeButton from "@src/components/reports/lastfm/common/drawer/sunburst/nodes/node.button/node.button.component";
import SunBurstNodeDisplay from "@src/components/reports/lastfm/common/drawer/sunburst/nodes/node.display/node.display.component";
import useLocale from "@src/hooks/locale";
import type SunBurstNodeAbstractBase from "@src/components/reports/lastfm/common/report.component/sunburst/encapsulations/sunburst.node.encapsulation.base.class";
import type { RefObject } from "react";

export interface SunBurstEntityNodeListContainerProps {
  node: SunBurstNodeAbstractBase;
  scrollRef: RefObject<HTMLDivElement>;
  selectChildNode: (node: SunBurstNodeAbstractBase) => void;
  svgTransition: boolean;
}

export default function SunBurstEntityNodeListContainer({
  node,
  scrollRef,
  selectChildNode,
  svgTransition,
}: SunBurstEntityNodeListContainerProps) {
  const { t: lastFMt } = useLocale("lastfm");
  const { t: sunBurstT } = useLocale("sunburst");

  const getEntityComponent = () => {
    if (node.hasLeafChildren()) {
      return SunBurstNodeDisplay;
    }
    return SunBurstNodeButton;
  };

  const getTitleText = () => {
    return (
      node.getDrawerListTitle(sunBurstT) ||
      lastFMt("playCountByArtist.drawer.noInformation")
    );
  };

  if (svgTransition) return null;

  return (
    <SunBurstEntityNodeList
      EntityComponent={getEntityComponent()}
      node={node}
      scrollRef={scrollRef}
      selectChildNode={selectChildNode}
      svgTransition={svgTransition}
      titleText={getTitleText()}
    />
  );
}