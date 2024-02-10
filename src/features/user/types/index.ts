export type UserProfile = {
  country: string;
  display_name: string;
  email: string;
  explicit_content: {
    filter_enabled: boolean;
    filter_locked: boolean;
  };
  external_urls: { spotify: string };
  followers: { href: string; total: number };
  href: string;
  id: string;
  images: Image[];
  product: string;
  type: string;
  uri: string;
};

export type Image = {
  url: string;
  height: number;
  width: number;
};

export type Results = {
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
  items: /* ArtistObject[] | */ TrackObject[];
};

export type ArtistObject = {
  external_urls: {
    spotify: string;
  };
  followers: {
    href: string | null;
    total: number;
  };
  genres: string[];
  href: string;
  id: string;
  images: Image[];
  name: string;
  popularity: number;
  type: 'artist';
  uri: string;
};

export type TrackObject = {
  album: {
    album_type: 'album' | 'single' | 'compilation';
    total_tracks: number;
    available_markets: string[];
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    images: Image[];
    name: string;
    release_date: string;
    release_date_precision: 'year' | 'month' | 'day';
    type: 'album';
    uri: string;
    artists: {
      external_urls: {
        spotify: string;
      };
      href: string;
      id: string;
      name: string;
      type: 'artist';
      uri: string;
    }[];
  };
  artists: ArtistObject[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: {
    isrc: string;
    ean: string;
    upc: string;
  };
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  name: string;
  popularity: number;
  preview_url: string | null;
  track_number: number;
  type: 'track';
  uri: string;
  is_local: boolean;
};

/**
 * todo: define this
 */
type EpisodeObject = never;

type PlaylistTrackObject = {
  added_at: string;
  added_by: Pick<UserProfile, 'external_urls' | 'followers' | 'href' | 'id' | 'type' | 'uri'>;
  is_local: boolean;
  track: TrackObject | EpisodeObject;
};

export type PlaylistObject = {
  collaborative: boolean;
  description: string | null;
  external_urls: {
    spotify: string;
  };
  followers: {
    href: string | null;
    total: number;
  };
  href: string;
  id: string;
  images: Image[];
  name: string;
  owner: Pick<
    UserProfile,
    'external_urls' | 'followers' | 'href' | 'id' | 'type' | 'uri' | 'display_name'
  >;
  public: boolean;
  snapshot_id: string;
  tracks: {
    href: string;
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
    items: PlaylistTrackObject[];
  };
  type: 'playlist';
  uri: string;
};
