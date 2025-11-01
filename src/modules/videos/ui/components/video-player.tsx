"use client";
import MuxPlayer from '@mux/mux-player-react';

interface VideoPlayerProps {
    playbackId?: string | null | undefined;
    thumbnailUrl?: string | null | undefined;
    autoPlay?: boolean;
    onPlay?: () => void;
}

const VideoPlayer = ({ playbackId, thumbnailUrl, autoPlay, onPlay }: VideoPlayerProps) => {

    if (!playbackId) {
        return null;
    }

    return (
        <MuxPlayer
            playbackId={playbackId || ""}
            poster={thumbnailUrl || '/placeholder.svg'}
            playerInitTime={0}
            thumbnailTime={0}
            autoPlay={autoPlay}
            onPlay={onPlay}
            className='w-full h-full object-contain'
            accentColor='#E8802A'
        />
    );
}

export default VideoPlayer;