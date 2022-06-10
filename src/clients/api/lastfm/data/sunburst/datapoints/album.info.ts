import LastFMBaseSunBurstDataPointClient from "./sunburst.datapoint.client.base.class";
import apiRoutes from "../../../../../../config/apiRoutes";
import type { LastFMAlbumInfoInterface } from "../../../../../../types/integrations/lastfm/api.types";

class LastFMAlbumInfo<
  EncapsulationType
> extends LastFMBaseSunBurstDataPointClient<
  EncapsulationType,
  LastFMAlbumInfoInterface
> {
  route = apiRoutes.v2.data.artists.albumsGet;
  eventType = "ALBUM INFO" as const;
}

export default LastFMAlbumInfo;