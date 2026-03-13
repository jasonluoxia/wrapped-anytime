import { userData } from "./data";
import { ArtistProfile, UserData, Song } from "./types";

export function getTop3Artists(userData: UserData):  { top3: ArtistProfile[] } | null {
    if (!userData.topArtists || userData.topArtists.length == 0) {
        return null;
    }

    const top3 = [];
    let i = 0;
    for (const artist of userData.topArtists) {
        if (i >= 3) {
            break;
        }
        top3.push(artist)
        i++;
    }
    return {
        top3
    };
}

export function getTop10Tracks(userData: UserData):  { top10: Song[] } | null {
    if (!userData.topTracks || userData.topTracks.length == 0) {
        return null;
    }

    const top10 = userData.topTracks.slice(0, 10);
    return {
        top10
    };
}