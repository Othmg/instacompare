import React from 'react';
import FileUpload from './components/FileUpload';
import Results from './components/Results';
import { useFileParser } from './hooks/useFileParser';
import { Instagram } from 'lucide-react';

function App() {
  const {
    handleFollowersUpload,
    handleFollowingUpload,
    result,
    isLoading,
    hasFollowersFile,
    hasFollowingFile
  } = useFileParser();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <div className="flex items-center">
            <Instagram className="h-8 w-8 text-pink-600 mr-2" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              InstaCompare
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
            Find Who Doesn't Follow You Back
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Upload your Instagram followers and following HTML files to see who isn't following you back. 
            Your data stays on your device and is never sent to any server.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold mb-6 text-gray-800">Upload Instagram Files</h3>
          
          <div className="mb-6">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    To get your Instagram files, go to Instagram settings, select "Your activity" → "Download your information" and request your data. Choose HTML format. After receiving the email, download and unzip the package, then upload the "followers.html" and "following.html" files found in the "followers_and_following" folder.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <FileUpload 
              label="Your Followers List"
              onFileUpload={handleFollowersUpload}
              fileType="followers"
              isUploaded={hasFollowersFile}
            />
            
            <FileUpload 
              label="Your Following List"
              onFileUpload={handleFollowingUpload}
              fileType="following"
              isUploaded={hasFollowingFile}
            />
          </div>
        </div>
        
        {(result || isLoading) && (
          <Results 
            notFollowingBack={result?.notFollowingBack || []} 
            isLoading={isLoading} 
          />
        )}
      </main>

      <footer className="mt-12 border-t border-gray-200 py-6">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>InstaCompare • Built with React & Tailwind CSS</p>
          <p className="mt-1">Your data never leaves your device</p>
        </div>
      </footer>
    </div>
  );
}

export default App;