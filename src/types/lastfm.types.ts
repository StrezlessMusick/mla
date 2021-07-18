import { TopAlbumsProxyResponseInterface } from "./proxy.types";

export interface LastFMImageDataInterface {
  size: "small" | "medium" | "large" | "extralarge";
  "#text": string;
}

export interface LastFMArtistDataInterface {
  image?: LastFMImageDataInterface[];
  mbid: string;
  name?: string;
  playcount?: string;
  streamable?: string;
  url?: string;
  "@attr"?: string;
  "#text"?: string;
}

export interface LastFMAlbumDataInterface {
  artist?: LastFMArtistDataInterface;
  image?: LastFMImageDataInterface[];
  mbid: string;
  name?: string;
  playcount?: string;
  url?: string;
  "@attr"?: {
    rank: string;
  };
  "#text"?: string;
}

export interface LastFMProxyInterface {
  getTopAlbums: (
    username: string
  ) => Promise<LastFMTopAlbumsProxyResponseInterface>;
}

export interface LastFMTopAlbumsProxyResponseInterface
  extends TopAlbumsProxyResponseInterface {
  albums: LastFMAlbumDataInterface[];
  image: LastFMImageDataInterface[];
}

export interface LastFMClientInterface {
  secret_key: string;
  getTopAlbums: (username: string) => Promise<LastFMAlbumDataInterface[]>;
  getUserImage: (username: string) => Promise<LastFMImageDataInterface[]>;
}

export interface LastFMTopAlbumsReportInterface {
  retrieveAlbumReport: (userName: string) => void;
}