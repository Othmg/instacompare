import { useState, useEffect } from 'react';
import { InstagramAccount, ComparisonResult } from '../types';
import { compareFollowers } from '../utils/comparator';

export const useFileParser = () => {
  const [followers, setFollowers] = useState<InstagramAccount[]>([]);
  const [following, setFollowing] = useState<InstagramAccount[]>([]);
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleFollowersUpload = (accounts: InstagramAccount[]) => {
    setFollowers(accounts);
  };
  
  const handleFollowingUpload = (accounts: InstagramAccount[]) => {
    setFollowing(accounts);
  };
  
  useEffect(() => {
    // Only process when both files are uploaded
    if (followers.length > 0 && following.length > 0) {
      setIsLoading(true);
      
      // Add a small delay to allow for loading state to show
      const timeoutId = setTimeout(() => {
        const comparisonResult = compareFollowers(following, followers);
        setResult(comparisonResult);
        setIsLoading(false);
      }, 700); // Simulating processing time
      
      return () => clearTimeout(timeoutId);
    }
  }, [followers, following]);
  
  return {
    followers,
    following,
    result,
    isLoading,
    handleFollowersUpload,
    handleFollowingUpload,
    hasFollowersFile: followers.length > 0,
    hasFollowingFile: following.length > 0,
  };
};