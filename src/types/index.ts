export interface InstagramAccount {
  username: string;
  profileUrl: string;
}

export interface ComparisonResult {
  notFollowingBack: InstagramAccount[];
}

export interface FileUploadProps {
  label: string;
  onFileUpload: (accounts: InstagramAccount[]) => void;
  fileType: 'followers' | 'following';
  isUploaded: boolean;
}

export interface ResultsProps {
  notFollowingBack: InstagramAccount[];
  isLoading: boolean;
}