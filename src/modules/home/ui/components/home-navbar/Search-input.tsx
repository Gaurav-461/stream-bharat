import { SearchIcon } from "lucide-react";

export const SearchInput = () => {
  return (
    <form className="flex w-full max-w-[600px]">
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Search"
          className="w-full rounded-l-full border py-2 pl-4 pr-12 placeholder:text-zinc-500 focus:border-orange-500 focus:outline-none"
        />
      </div>
      <button
        type="submit"
        className="rounded-r-full border border-l-0 bg-green-100 px-5 py-2.5 hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <SearchIcon className="size-5" />
      </button>
    </form>
  );
};
