import React, { useState, useRef } from 'react';
import { FileUploadProps, InstagramAccount } from '../types';
import { parseInstagramHtml, readFileAsText } from '../utils/parser';
import { Upload } from 'lucide-react';

const FileUpload: React.FC<FileUploadProps> = ({ 
  label, 
  onFileUpload, 
  fileType,
  isUploaded 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (file: File) => {
    setError(null);

    // Validate file type
    if (file.type !== 'text/html' && !file.name.endsWith('.html')) {
      setError('Please upload an HTML file');
      return;
    }

    setFileName(file.name);

    try {
      const content = await readFileAsText(file);
      const accounts = parseInstagramHtml(content);
      
      if (accounts.length === 0) {
        setError('No Instagram accounts found in this file');
        return;
      }
      
      onFileUpload(accounts);
    } catch (err) {
      console.error('Error processing file:', err);
      setError('Could not process the file. Please try again.');
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files.length) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileChange(e.target.files[0]);
    }
  };

  return (
    <div className="w-full mb-6">
      <p className="text-gray-700 mb-2 font-medium">{label}</p>
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-8 transition-all duration-200 cursor-pointer
          flex flex-col items-center justify-center
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${isUploaded ? 'bg-green-50 border-green-500' : ''}
        `}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden" 
          accept=".html"
          onChange={handleInputChange}
        />
        
        {isUploaded ? (
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-green-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <p className="font-medium text-green-700">{fileName || `${fileType === 'followers' ? 'Followers' : 'Following'} file uploaded!`}</p>
          </div>
        ) : (
          <>
            <Upload className="w-12 h-12 text-gray-400 mb-3" />
            <p className="text-gray-600 text-center">
              Drag and drop your <span className="font-medium">{fileType}</span> .html file here, or click to browse
            </p>
            <p className="text-gray-400 text-sm mt-2">Only HTML files are accepted</p>
          </>
        )}
      </div>
      
      {error && (
        <p className="mt-2 text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
};

export default FileUpload;