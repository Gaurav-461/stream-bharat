"use client";

import { useEffect } from "react";

import { useInterSectionObserver } from "@/hooks/use-intersection-observer";

import { Button } from "@/components/ui/button";

interface InfiniteScrollProps {
  isManual?: boolean;
  hasNextPage: boolean;
  isFatchingNextPage: boolean;
  fetchNextPage: () => void;
}

export const InfiniteScroll = ({
  isManual = false,
  hasNextPage,
  isFatchingNextPage,
  fetchNextPage,
}: InfiniteScrollProps) => {

    const { isInterSecting, targetRef } = useInterSectionObserver({
        threshold: 0.5,
        rootMargin: "100px",
    })

    useEffect(() => {
        if(isInterSecting && hasNextPage && !isFatchingNextPage && !isManual) {
            fetchNextPage();
        }
    },[isInterSecting, hasNextPage, isFatchingNextPage, fetchNextPage, isManual]);
    
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4 mt-4">
      <div ref={targetRef} className="h-1">
        {hasNextPage ? (
          <Button onClick={() => fetchNextPage()} disabled={!hasNextPage || isFatchingNextPage}>
            {isFatchingNextPage ? "Loading..." : "Load more"}
          </Button>
        ) : (
          <p>You have reached the end of the list</p>
        )}
      </div>
    </div>
  );
};
