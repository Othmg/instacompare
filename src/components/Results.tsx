import React, { useState, useEffect, useMemo } from 'react';
import { ResultsProps, InstagramAccount } from '../types';
import { Search, UserX2, RotateCcw } from 'lucide-react';

const UNFOLLOWED_KEY = 'instacompare_unfollowed';

const Results: React.FC<ResultsProps> = ({ notFollowingBack, isLoading }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showUnfollowed, setShowUnfollowed] = useState(false);
  const [unfollowedList, setUnfollowedList] = useState<string[]>([]);

  // Load unfollowed list from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(UNFOLLOWED_KEY);
    if (saved) {
      try {
        setUnfollowedList(JSON.parse(saved));
      } catch (e) {
        console.error('Error parsing unfollowed list:', e);
      }
    }
  }, []);

  // Save unfollowed list to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(UNFOLLOWED_KEY, JSON.stringify(unfollowedList));
  }, [unfollowedList]);

  const toggleUnfollow = (username: string) => {
    setUnfollowedList(prev => 
      prev.includes(username)
        ? prev.filter(u => u !== username)
        : [...prev, username]
    );
  };
  
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
          
          <div className="w-full md:w-auto">
            <button
              onClick={() => setShowUnfollowed(!showUnfollowed)}
              className={`w-full md:w-auto px-4 py-2 rounded-lg transition-colors flex items-center gap-2 justify-center
                ${showUnfollowed 
                  ? 'bg-purple-100 text-purple-600 hover:bg-purple-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              <UserX2 className="w-4 h-4" />
              Unfollowed ({unfollowedList.length})
            </button>
          </div>
          
          {unfollowedList.length > 0 && (
            <div className="w-full md:w-auto">
              <button
                onClick={() => setUnfollowedList([])}
                className="w-full md:w-auto px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset All Unfollowed
              </button>
            </div>
          )}
        </div>
        
        <div className="overflow-y-auto max-h-[60vh]">
          {filteredAndSortedResults.length > 0 ? (
            <>
              {!showUnfollowed ? (
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
                          onClick={() => toggleUnfollow(account.username)}
                          className={`text-sm transition-colors px-3 py-1 rounded-full flex items-center gap-1
                            ${unfollowedList.includes(account.username)
                              ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              : 'bg-red-50 text-red-600 hover:bg-red-100'
                            }`}
                        >
                          {unfollowedList.includes(account.username) ? (
                            <>
                              <RotateCcw className="w-4 h-4" />
                              Undo Unfollow
                            </>
                          ) : (
                            <>
                              <UserX2 className="w-4 h-4" />
                              Unfollow
                            </>
                          )}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : unfollowedList.length > 0 ? (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Unfollowed Accounts ({unfollowedList.length})
                  </h3>
                  <ul className="space-y-3">
                    {unfollowedList.map(username => {
                      const account = notFollowingBack.find(a => a.username === username);
                      return (
                        <li key={username} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
                          <a
                            href={account?.profileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-600 hover:text-purple-800"
                          >
                            @{username}
                          </a>
                          <button
                            onClick={() => toggleUnfollow(username)}
                            className="text-sm bg-purple-50 text-purple-600 hover:bg-purple-100 px-3 py-1 rounded-full flex items-center gap-1"
                          >
                            <RotateCcw className="w-4 h-4" />
                            Undo
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No accounts have been unfollowed yet
                </div>
              )}
            </>
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