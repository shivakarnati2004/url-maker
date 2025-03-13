import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

export default function Redirect() {
  const { shortCode } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const redirectToOriginalUrl = async () => {
      if (!shortCode) {
        setError('Invalid URL');
        setIsLoading(false);
        return;
      }

      try {
        // First, get the original URL
        const { data, error: fetchError } = await supabase
          .from('urls')
          .select('original_url, clicks')
          .eq('short_code', shortCode)
          .single();

        if (fetchError || !data) {
          throw new Error('URL not found');
        }

        // Update click count
        const { error: updateError } = await supabase
          .from('urls')
          .update({ clicks: (data.clicks || 0) + 1 })
          .eq('short_code', shortCode);

        if (updateError) {
          console.error('Failed to update click count:', updateError);
        }

        // Ensure the URL has a protocol
        let redirectUrl = data.original_url;
        if (!redirectUrl.startsWith('http://') && !redirectUrl.startsWith('https://')) {
          redirectUrl = 'https://' + redirectUrl;
        }

        // Show success message
        toast.success('Redirecting you to the destination...', {
          duration: 2000
        });

        // Set a small delay for the toast to be visible
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 1500);

      } catch (err) {
        setError('URL not found or invalid');
        setIsLoading(false);
        
        // Redirect to home page after showing error
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    };

    redirectToOriginalUrl();
  }, [shortCode, navigate]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <p className="text-sm text-gray-500">Redirecting you to home page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md text-center">
        <Loader2 className="w-12 h-12 animate-spin mx-auto text-purple-500 mb-4" />
        <p className="text-xl font-semibold text-gray-800 mb-2">Redirecting...</p>
        <p className="text-gray-600">Please wait while we take you to your destination</p>
      </div>
    </div>
  );
}