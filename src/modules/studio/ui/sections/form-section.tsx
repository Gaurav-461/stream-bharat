"use client";

import { Suspense, useState } from "react";
import { trpc } from "@/trpc/client";
import { ErrorBoundary } from "react-error-boundary";

import {
  CheckIcon,
  CopyIcon,
  GlobeIcon,
  LockIcon,
  MoreVerticalIcon,
  Trash2Icon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { videoUpdateSchema } from "@/db/schema";
import { toast } from "sonner";
import VideoPlayer from "@/modules/videos/ui/components/video-player";
import Link from "next/link";
import { snakeCaseToTitle } from "@/lib/utils";
import { useRouter } from "next/navigation";

type FormSectionProps = {
  videoId: string;
};

const FormSection = ({ videoId }: FormSectionProps) => {
  return (
    <Suspense fallback={<FormSectionSkeleton />}>
      <ErrorBoundary
        fallback={<div>Error: Error occurred in Form Section</div>}
      >
        <FormSectionSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const FormSectionSkeleton = () => {
  return <div>Loading...</div>;
};

const FormSectionSuspense = ({ videoId }: FormSectionProps) => {
  const router = useRouter();
  const [video] = trpc.studio.getOne.useSuspenseQuery({ id: videoId });
  const [categories] = trpc.categories.getMany.useSuspenseQuery();

  const utils = trpc.useUtils();

  const update = trpc.videos.update.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
      utils.studio.getOne.invalidate({ id: videoId });
      toast.success("Video updated");
    },
    onError: () => {
      toast.error("Something went wrong while updating video");
    },
  });

  const form = useForm<z.infer<typeof videoUpdateSchema>>({
    resolver: zodResolver(videoUpdateSchema),
    defaultValues: video,
  });

  const onSubmit = (data: z.infer<typeof videoUpdateSchema>) => {
    update.mutate(data);
  };

  const fullUrl = `${process.env.VERCEL_URL || "http://localhost:3000"}/videos/${videoId}`;
  const [isCopied, setIsCopied] = useState(false);

  const onCopy = async () => {
    await navigator.clipboard.writeText(fullUrl);
    setIsCopied(true);

    toast.success("Copied to clipboard", { duration: 2000 });

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const remove = trpc.videos.remove.useMutation({
    onSuccess: () => {
      router.push("/studio")
    },
    onError: () => {
      toast.error("Something went wrong while removing video")
    }
  })


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Video details</h1>
            <p className="text-sm text-muted-foreground">
              Manage your video details
            </p>
          </div>
          <div className="flex items-center gap-x-2">
            <Button type="submit" disabled={update.isPending}>
              {update.isPending ? "Saving..." : "Save changes"}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVerticalIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => remove.mutate({ id: videoId})}>
                  <Trash2Icon />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* column 1 */}
          <div className="space-y-8 lg:col-span-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {/* TODO: Add AI generate button */}
                    Title
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Add a title to your video" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {/* TODO: Add AI generate button */}
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      rows={10}
                      {...field}
                      value={field.value ?? ""}
                      className="resize-none pr-10"
                      placeholder="Add a description to your video"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* TODO: Add Thumbnail field here */}
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value ?? undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* column 2 */}
          <div className="flex flex-col gap-8 lg:col-span-2">
            <div className="flex h-fit flex-col gap-4 overflow-hidden rounded-xl bg-[#F9F9F9]">
              <div className="relative aspect-video overflow-hidden">
                <VideoPlayer
                  playbackId={video.muxPlaybackId}
                  thumbnailUrl={video.thumbnailUrl}
                />
              </div>
              <div className="flex flex-col gap-y-6 p-4">
                <div className="flex items-center justify-between gap-x-2">
                  <div className="flex flex-col gap-y-1">
                    <p className="text-xm text-muted-foreground">Video link</p>
                    <div className="flex items-center gap-x-2">
                      <Link href={`/videos/${video.id}`}>
                        <p className="line-clamp-1 text-sm text-blue-500">
                          {fullUrl}
                        </p>
                      </Link>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="shrink-0"
                        onClick={onCopy}
                        disabled={isCopied}
                      >
                        {isCopied ? <CheckIcon /> : <CopyIcon />}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* video status */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-y-1">
                    <p className="text-xs text-muted-foreground">
                      Video status
                    </p>
                    <p className="text-sm">
                      {snakeCaseToTitle(video.muxStatus || "preparing")}
                    </p>
                  </div>
                </div>

                {/* Subtitle status */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-y-1">
                    <p className="text-xs text-muted-foreground">
                      Subtitle status
                    </p>
                    <p className="text-sm">
                      {snakeCaseToTitle(video.muxTrackStatus || "no_subtitle")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <FormField
              control={form.control}
              name="visibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visibility</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value ?? undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select visibility" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Public">
                        <div className="flex justify-between items-center">
                          <GlobeIcon className="mr-2 size-4" /> Public
                        </div>
                      </SelectItem>
                      <SelectItem value="Private">
                        <div className="flex justify-between items-center">
                          <LockIcon className="mr-2 size-4" /> Private
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </form>
    </Form>
  );
};

export default FormSection;
