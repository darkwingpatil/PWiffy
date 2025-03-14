import React, { useState, useEffect } from 'react';
import { Heart, Loader2, RefreshCw, Share2, ExternalLink, RotateCcw } from 'lucide-react';

interface Meme {
  url: string;
  title: string;
  postLink: string;
}

function App() {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMemes = async (count: number) => {
    try {
      const response = await fetch(`https://meme-api.com/gimme/wholesomememes/${count}`);
      if (!response.ok) throw new Error('Failed to fetch memes');
      const data = await response.json();
      return data.memes;
    } catch (error) {
      setError('Failed to load memes. Please try again later.');
      return [];
    }
  };

  useEffect(() => {
    const loadInitialMemes = async () => {
      const initialMemes = await fetchMemes(12);
      setMemes(initialMemes);
      setLoading(false);
    };
    loadInitialMemes();
  }, []);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const currentCount = memes.length;
      const newMemes = await fetchMemes(currentCount + 12);
      setMemes(prevMemes => [...prevMemes, ...newMemes.slice(currentCount)]);
    } finally {
      setLoadingMore(false);
    }
  };

  const shareMeme = async (meme: Meme) => {
    try {
      await navigator.share({
        title: meme.title,
        text: 'Check out this wholesome meme!',
        url: meme.postLink
      });
    } catch (error) {
      window.open(meme.postLink, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-rose-500 mx-auto mb-4" />
          <p className="text-gray-600 animate-pulse">Loading wholesome moments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md mx-4">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-rose-500 text-white px-6 py-2 rounded-full hover:bg-rose-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      <header className="py-12 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 animate-gradient"></div>
        </div>
        <div className="relative">
          <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 mb-4 animate-fade-in">
            For Sudeeksha 
            {/* <Heart className="inline-block text-rose-500 animate-pulse" /> */}
          </h1>
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            A curated collection of wholesome memes to brighten your day and make you smile
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {memes.map((meme, index) => (
            <div
              key={`${meme.url}-${index}`}
              className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-102 hover:shadow-xl group"
            >
              <div className="aspect-square overflow-hidden relative">
                <img
                  src={meme.url}
                  alt={meme.title}
                  className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
                  <button
                    onClick={() => shareMeme(meme)}
                    className="text-white bg-black/30 p-2 rounded-full backdrop-blur-sm hover:bg-black/50 transition-colors"
                    title="Share meme"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  <a
                    href={meme.postLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white bg-black/30 p-2 rounded-full backdrop-blur-sm hover:bg-black/50 transition-colors"
                    title="View original"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
              </div>
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-800 line-clamp-2 mb-2">{meme.title}</h2>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 text-white px-10 py-4 rounded-full font-semibold shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center justify-center gap-3 mx-auto disabled:opacity-50 disabled:hover:scale-100"
          >
            {loadingMore ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <RefreshCw className="w-6 h-6" />
                Load More Memes
                
              </>
              
            )}
          </button>
          <button
            onClick={() => window.location.reload()}
            disabled={loadingMore}
            className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 text-white px-10 py-4 rounded-full font-semibold shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center justify-center gap-3 mx-auto disabled:opacity-50 disabled:hover:scale-100"
          >

              <>
                <RotateCcw className="w-6 h-6" />
                Refresh
                
              </>
              
          </button>
        </div>
      </main>

      <footer className="text-center py-8 text-gray-600">
        <p className="text-sm">for Sudeeksha from darkwingPatil</p>
      </footer>
    </div>
  );
}

export default App;