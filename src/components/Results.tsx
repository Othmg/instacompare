import React, { useState, useEffect, useMemo } from 'react';
import { ResultsProps, InstagramAccount } from '../types';
import { Search } from 'lucide-react';

const Results: React.FC<ResultsProps> = ({ notFollowingBack, isLoading }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Filtered and sorted results
  const filteredAndSortedResults = useMemo(() => {
    // First filter by search query
    const filtered = searchQuery
      ? notFollowingBack.filter(account => 
          account.username.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : notFollowingBack;
    
    // Then sort
    return [...filtered].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.username.localeCompare(b.username);
      } else {
        return b.username.localeCompare(a.username);
      }
    });
  }, [notFollowingBack, searchQuery, sortOrder]);

  if (isLoading) {
    return (
      <div className="w-full mt-8 flex flex-col items-center">
        <div className="w-12 h-12 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Comparing your Instagram lists...</p>
      </div>
    );
  }

  if (notFollowingBack.length === 0) {
    return null;
  }

  return (
    <div className="w-full mt-8 bg-white rounded-xl shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4">
        <h2 className="text-white text-xl font-bold">
          Accounts Not Following You Back ({notFollowingBack.length})
        </h2>
      </div>
      
      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search accounts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <div className="w-full md:w-auto">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="asc">Sort A-Z</option>
              <option value="desc">Sort Z-A</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-y-auto max-h-[60vh]">
          {filteredAndSortedResults.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {filteredAndSortedResults.map((account) => (
                <li key={account.username} className="py-4 px-1 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <a
                      href={account.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-purple-600 hover:text-purple-800 transition-colors"
                    >
                      @{account.username}
                    </a>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <a
                      href={account.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-800 text-sm bg-gray-100 hover:bg-gray-200 transition-colors px-3 py-1 rounded-full"
                    >
                      View Profile
                    </a>
                    
                    <button 
                      onClick={() => window.open(account.profileUrl, '_blank')}
                      className="text-sm bg-red-50 text-red-600 hover:bg-red-100 transition-colors px-3 py-1 rounded-full"
                    >
                      Unfollow
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-8 text-center">
              <p className="text-gray-500">No accounts match your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Results;