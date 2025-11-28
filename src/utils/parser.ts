import { InstagramAccount } from '../types';

/**
 * Parses HTML content from Instagram followers/following export
 * and extracts usernames
 */
export const parseInstagramHtml = (htmlContent: string): InstagramAccount[] => {
  try {
    // Create a temporary DOM element to parse the HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    
    // Instagram exports contain usernames in anchor tags
    const anchorTags = doc.querySelectorAll('a');
    const accounts: InstagramAccount[] = [];
    
    anchorTags.forEach(anchor => {
      const href = anchor.getAttribute('href');
      if (href && href.startsWith('https://www.instagram.com/')) {
        let username = href.replace('https://www.instagram.com/', '');

        // Handle new /_u/ format FIRST (before removing slashes)
        if (username.startsWith('_u/')) {
          username = username.substring(3); // Remove '_u/'
        }

        // Now remove trailing slash if present
        if (username.endsWith('/')) {
          username = username.slice(0, -1);
        }

        // Skip non-username hrefs (like "/explore/", etc.)
        if (username === 'explore' || username === 'direct' || !username) {
          return;
        }

        // Normalize profile URL to standard format
        const profileUrl = `https://www.instagram.com/${username}`;

        accounts.push({
          username,
          profileUrl
        });
      }
    });
    
    // Remove duplicates by username
    const uniqueAccounts = accounts.reduce((acc, current) => {
      const x = acc.find(item => item.username === current.username);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, [] as InstagramAccount[]);
    
    return uniqueAccounts;
  } catch (error) {
    console.error('Error parsing Instagram HTML:', error);
    return [];
  }
}

/**
 * Reads and parses a file as text
 */
export const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}