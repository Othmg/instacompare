import { InstagramAccount, ComparisonResult } from '../types';

/**
 * Compares followers and following lists to find accounts 
 * that don't follow back
 */
export const compareFollowers = (
  following: InstagramAccount[],
  followers: InstagramAccount[]
): ComparisonResult => {
  // Find accounts you follow that don't follow you back
  const notFollowingBack = following.filter(
    followingAccount => !followers.some(
      follower => follower.username === followingAccount.username
    )
  );
  
  return {
    notFollowingBack
  };
}