import React, { useState } from 'react';
import { Link2, ExternalLink, Loader2 } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import { supabase } from './lib/supabase';

function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [shortUrl, setShortUrl] = useState('');

  const generateShortCode = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      toast.error('Please enter a URL');
      return;
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      toast.error('Please enter a valid URL');
      return;
    }

    setLoading(true);
    
    try {
      const shortCode = generateShortCode();
      
      const { error: insertError } = await supabase
        .from('urls')
        .insert([
          { original_url: url, short_code: shortCode, clicks: 0 }
        ])
        .select()
        .single();

      if (insertError) {
        throw new Error(insertError.message);
      }

      const newShortUrl = `${window.location.origin}/${shortCode}`;
      setShortUrl(newShortUrl);
      setUrl('');
      toast.success('New URL generated successfully!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to generate URL. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      toast.success('Copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex flex-col items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full max-w-md relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
        
        <div className="flex items-center justify-center mb-8">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-500 p-3 rounded-2xl">
            <Link2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-pink-500 ml-4">
            URL Generator
          </h1>
        </div>
        
        <h2 className="text-center text-gray-600 mb-8 font-medium">Create custom, memorable links for your URLs</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter your URL here"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200 outline-none text-gray-700 placeholder-gray-400"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-xl transition duration-200 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Generate URL'
            )}
          </button>
        </form>

        {shortUrl && (
          <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Your generated URL:</span>
              <button
                onClick={copyToClipboard}
                className="text-indigo-500 hover:text-indigo-600 text-sm font-semibold transition-colors duration-200"
              >
                Copy
              </button>
            </div>
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 text-indigo-500 hover:text-indigo-600 flex items-center break-all p-2 rounded-lg hover:bg-indigo-50 transition-colors duration-200 group"
            >
              {shortUrl}
              <ExternalLink className="w-4 h-4 ml-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </a>
          </div>
        )}

        <div className="mt-8 pt-4 border-t border-gray-200">
          <p className="text-center text-sm text-gray-500">
            Created with ❤️ by{' '}
            <a
              href="https://github.com/shivakarnati2004"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-500 hover:text-indigo-600 font-medium"
            >
              shivakarnati2004
            </a>
          </p>
        </div>
      </div>
      <Toaster position="bottom-center" />
    </div>
  );
}

export default App;