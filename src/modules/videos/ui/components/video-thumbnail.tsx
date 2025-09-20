import { formatDuration } from "@/lib/utils";
import Image from "next/image";
import React from "react";

interface VideoThumbnailProps {
  thumbnailUrl?: string | null;
  previewUrl?: string | null;
  title: string;
  duration: number;
}

export const VideoThumbnail = ({
  thumbnailUrl,
  title,
  previewUrl,
  duration,
}: VideoThumbnailProps) => {
  return (
    <div className="group relative">
      {/* thumbnail wrapper */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl">
        <Image
          src={thumbnailUrl ?? "/placeholder.svg"}
          alt={title}
          fill
          sizes="100%"
          className="h-full w-full object-cover"
        />
        <Image
          src={previewUrl ?? "/placeholder.svg"}
          alt={title}
          fill
          sizes="100%"
          className="h-full w-full object-cover opacity-0 group-hover:opacity-100"
        />
      </div>

      {/* video duration box */}
      <div className="absolute bottom-2 right-2 rounded bg-black/80 px-1 py-0.5 text-xs font-medium text-white">
        {formatDuration(duration)}
      </div>
    </div>
  );
};
