import { useState, useEffect } from "react";
import { RefreshCw, ExternalLink, CheckCircle } from "lucide-react";

export default function FactBox() {
  const [fact, setFact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFact = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://f-api.ir/api/facts/random');
      if (!response.ok) {
        throw new Error('Failed to fetch fact');
      }
      const data = await response.json();
      setFact(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching fact:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFact();
  }, []);

  return (
    <div className="card-twitter mb-4">
      <div className="flex items-center justify-between p-4 pb-3 border-b border-[#eff3f4]">
        <h2 className="text-xl font-bold text-[#0f1419]">Random Fact</h2>
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
            {/* Category and Rating */}
            <div className="flex items-center justify-between">
              <span className="inline-block px-3 py-1 bg-[#1d9bf0] bg-opacity-10 text-[#1d9bf0] text-xs font-semibold rounded-full">
                {fact.category || 'General'}
              </span>
              {fact.verified && (
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle size={14} />
                  <span className="text-xs font-medium">Verified</span>
                </div>
              )}
            </div>

            {/* Title */}
            {fact.title && (
              <h3 className="font-bold text-[#0f1419] text-base leading-snug">
                {fact.title}
              </h3>
            )}

            {/* Fact Text */}
            <p className="text-[#0f1419] text-sm leading-relaxed">
              {fact.fact}
            </p>

            {/* Metadata */}
            <div className="flex items-center gap-4 pt-3 border-t border-[#eff3f4] text-xs text-[#536471]">
              {fact.year_discovered && (
                <span>📅 {fact.year_discovered}</span>
              )}
              {fact.interesting_rating && (
                <span>⭐ {fact.interesting_rating}/10</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
