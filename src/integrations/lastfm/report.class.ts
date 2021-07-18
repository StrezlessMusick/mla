import Events from "../../config/events";
import apiEndpoints from "../../config/apiEndpoints";

import { postData } from "../../utils/http";

import { userDispatchType } from "../../types/user.types";
import { eventCreatorType } from "../../types/analytics.types";
import { ProxyRequestInterface } from "../../types/proxy.types";
import {
  LastFMTopAlbumsProxyResponseInterface,
  LastFMTopAlbumsReportInterface,
} from "../../types/lastfm.types";

class LastFMReportRequest implements LastFMTopAlbumsReportInterface {
  private dispatch: userDispatchType;
  private event: eventCreatorType;

  constructor(dispatch: userDispatchType, event: eventCreatorType) {
    this.dispatch = dispatch;
    this.event = event;
  }

  retrieveAlbumReport(userName: string): void {
    postData<ProxyRequestInterface, LastFMTopAlbumsProxyResponseInterface>(
      apiEndpoints.v1.reports.lastfm.albums,
      {
        userName,
      }
    )
      .then((response) => {
        if (response.status === 200) {
          this.dispatch({
            type: "SuccessFetchUser",
            userName: userName,
            data: response.response as LastFMTopAlbumsProxyResponseInterface,
          });
          this.event(Events.LastFM.SuccessAlbumsReport);
        }
        return Promise.resolve(response);
      })
      .then((response) => {
        if (response.status === 429) {
          this.dispatch({
            type: "RatelimitedFetchUser",
            userName: userName,
          });
          this.event(Events.LastFM.Ratelimited);
        }
        return Promise.resolve(response);
      })
      .catch(() => {
        this.dispatch({
          type: "FailureFetchUser",
          userName: userName,
        });
        this.event(Events.LastFM.ErrorAlbumsReport);
      });
  }
}

export default LastFMReportRequest;