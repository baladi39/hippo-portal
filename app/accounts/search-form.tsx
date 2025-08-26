"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SearchFormProps {
  initialSearchTerm?: string;
  onSearch?: (searchTerm: string) => void;
}

export function SearchForm({
  initialSearchTerm = "",
  onSearch,
}: SearchFormProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    } else {
      // Default behavior: navigate with search params
      const params = new URLSearchParams();
      if (searchTerm.trim()) {
        params.set("search", searchTerm.trim());
      }
      router.push(
        `/accounts${params.toString() ? `?${params.toString()}` : ""}`
      );
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    if (onSearch) {
      onSearch("");
    } else {
      router.push("/accounts");
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="pr-4 pl-4">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search accounts, plans, carriers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit">Search</Button>
          <Button type="button" variant="outline" onClick={handleClear}>
            Clear
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
