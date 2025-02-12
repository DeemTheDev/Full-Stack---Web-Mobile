// components/SearchInput.tsx
"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

export const SearchInput = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <input
      type="text"
      placeholder="Search"
      defaultValue={searchParams.get("search")?.toString()}
      onChange={(e) => handleSearch(e.target.value)}
      className="input input-bordered w-24 md:w-auto"
    />
  );
};
