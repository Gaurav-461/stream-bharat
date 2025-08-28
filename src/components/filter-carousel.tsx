"use client";

import {
  CarouselItem,
  Carousel,
  CarouselNext,
  CarouselPrevious,
  CarouselApi,
  CarouselContent,
} from "./ui/carousel";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";

interface FilterCarouselProps {
  value?: string | null;
  isLoading?: boolean;
  onSelect?: (value: string | null) => void;
  data: {
    value: string;
    label: string;
  }[];
}
export function FilterCarousel({
  data,
  value,
  onSelect,
  isLoading,
}: FilterCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);
  return (
    <div className="relative w-full">
      {/* left fade */}
      <div
        className={cn(
          "pointer-events-none absolute bottom-0 left-12 top-0 z-10 h-full w-12 bg-gradient-to-r from-white to-transparent",
          current === 1 && "hidden",
        )}
      />
      <Carousel
        setApi={setApi}
        opts={{ align: "start", dragFree: true }}
        className="w-full px-12"
      >
        <CarouselContent className="ml-1">
          {!isLoading && (
            <CarouselItem
              className="basis-auto pl-3"
              onClick={() => onSelect?.(null)}
            >
              <Badge
                variant={!value ? "default" : "secondary"}
                className="cursor-pointer whitespace-nowrap rounded-lg px-3 py-1 text-sm"
              >
                All
              </Badge>
            </CarouselItem>
          )}

          {isLoading &&
            Array.from({ length: 14 }).map((_, index) => (
              <CarouselItem key={index} className="basis-auto pl-3">
                <Skeleton className="h-full w-[100px] rounded-lg px-3 py-1 text-sm font-semibold">
                  &nbsp;
                </Skeleton>
              </CarouselItem>
            ))}

          {!isLoading &&
            data.map((item) => (
              <CarouselItem
                key={item.value}
                className="basis-auto pl-3"
                onClick={() => onSelect?.(item.value)}
              >
                <Badge
                  className="cursor-pointer whitespace-nowrap rounded-lg px-3 py-1 text-sm"
                  variant={value === item.value ? "default" : "secondary"}
                  onClick={() => onSelect?.(item.value)}
                >
                  {item.label}
                </Badge>
              </CarouselItem>
            ))}
        </CarouselContent>

        <CarouselPrevious className="left-0" />
        <CarouselNext className="right-0" />
      </Carousel>

      {/* right fade */}
      <div
        className={cn(
          "pointer-events-none absolute bottom-0 right-12 top-0 z-10 h-full w-12 bg-gradient-to-l from-white to-transparent",
          current === count && "hidden",
        )}
      />
    </div>
  );
}
