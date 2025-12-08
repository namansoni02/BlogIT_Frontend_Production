import { useState, useEffect } from "react";
import { RefreshCw, ExternalLink } from "lucide-react";

export default function ProfileFactBox() {
  const [fact, setFact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFact = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://uselessfacts.jsph.pl/api/v2/facts/random');
      if (!response.ok) {
        throw new Error('Failed to fetch fact');
      }
      const data = await response.json();
      setFact(data);
      // Save to session storage
      sessionStorage.setItem('cachedProfileFact', JSON.stringify(data));
    } catch (err) {
      setError(err.message);
      console.error('Error fetching profile fact:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if we have cached data
    const cachedFact = sessionStorage.getItem('cachedProfileFact');
    if (cachedFact) {
      try {
        setFact(JSON.parse(cachedFact));
        setLoading(false);
      } catch (err) {
        // If parsing fails, fetch new data
        fetchFact();
      }
    } else {
      // No cached data, fetch new
      fetchFact();
    }
  }, []);

  return (
    <div className="card-twitter mb-4">
      <div className="flex items-center justify-between p-4 pb-3 border-b border-[#eff3f4]">
        <h2 className="text-xl font-bold text-[#0f1419]">Useless Fact</h2>
        <button
          onClick={fetchFact}
          disabled={loading}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
          title="Get new fact"
        >
          <RefreshCw size={18} className={`text-[#536471] ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="p-4">
        {loading && !fact && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#1d9bf0] border-t-transparent"></div>
          </div>
        )}

        {error && (
          <div className="text-center py-6 px-4">
            <p className="text-red-500 text-sm mb-2">Failed to load fact</p>
            <button
              onClick={fetchFact}
              className="text-[#1d9bf0] text-sm hover:underline"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && fact && (
          <div className="space-y-3">
            {/* Fact Text */}
            <p className="text-[#0f1419] text-sm leading-relaxed">
              {fact.text}
            </p>

            
          </div>
        )}
      </div>
    </div>
  );
}
