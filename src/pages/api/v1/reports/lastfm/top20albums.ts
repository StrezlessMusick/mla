import { body, validationResult } from "express-validator";
import nextConnect from "next-connect";
import apiRoutes from "../../../../../config/apiRoutes";
import { knownStatuses } from "../../../../../config/http";
import * as status from "../../../../../config/status";
import LastFMProxy from "../../../../../integrations/lastfm/proxy.class";
import type { ProxyError } from "../../../../../errors/proxy.error.class";
import type { NextApiRequest, NextApiResponse } from "next";

const onNoMatch = (req: NextApiRequest, res: NextApiResponse) => {
  res.status(405).json(status.STATUS_405_MESSAGE);
};

const handler = nextConnect<NextApiRequest, NextApiResponse>({ onNoMatch });

handler.post(
  apiRoutes.v1.reports.lastfm.top20albums,
  body("userName").isString(),
  body("userName").isLength({ min: 1 }),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json(status.STATUS_400_MESSAGE);
    } else {
      const proxy = new LastFMProxy();
      try {
        const proxyResponse = await proxy.getTopAlbums(req.body.userName);
        res.status(200).json(proxyResponse);
      } catch (err) {
        errorResponse(err as ProxyError, res);
      }
    }
    next();
  }
);

const errorResponse = (err: ProxyError, res: NextApiResponse) => {
  if (err.clientStatusCode && knownStatuses[err.clientStatusCode]) {
    res.status(err.clientStatusCode).json(knownStatuses[err.clientStatusCode]);
  } else {
    res.status(502).json(status.STATUS_502_MESSAGE);
  }
};

export default handler;