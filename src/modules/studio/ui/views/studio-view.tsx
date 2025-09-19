import { VideoSection } from "../sections/videos-section";

const StudioView = () => {
    return (
        <div className="w-full flex flex-col gap-y-6 px-4 pt-2.5 mb-10" >
            <div className="px-4">
                <h1 className="text-2xl font-bold">Channel content</h1>
                <p className="text-xs text-muted-foreground">Manage your content and videos</p>
            </div>
            <VideoSection />
        </div>
    );
}

export default StudioView;