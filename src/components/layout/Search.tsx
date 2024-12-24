import { Search as SearchIcon } from 'lucide-react';

export const Search = () => {
  return (
    <div className="hidden md:flex items-center gap-2 w-96">
      <div className="relative w-full">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};