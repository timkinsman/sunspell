import { UserProfile } from '@/features/user/types';
import { Image, TrackObject } from '@/types';

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
