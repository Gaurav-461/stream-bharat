import { useState, useEffect, useRef } from "react";

export const useInterSectionObserver = (options: IntersectionObserverInit) => {
    const [isInterSecting, setIsInterSecting] = useState(false);
    const targetRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            setIsInterSecting(entry.isIntersecting);
        }, options);

        if(targetRef.current) {
            observer.observe(targetRef.current);
        }

        return () => observer.disconnect();
    },[options]);

    return { isInterSecting, targetRef };
}