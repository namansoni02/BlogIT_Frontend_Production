import { useState, useEffect } from "react";
import { RefreshCw, ExternalLink } from "lucide-react";

export default function ExtinctAnimalFact() {
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnimal = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://extinct-api.herokuapp.com/api/v1/animal/');
      if (!response.ok) {
        throw new Error('Failed to fetch extinct animal');
      }
      const result = await response.json();
      if (result.status === 'success' && result.data && result.data.length > 0) {
        // Get a random animal from the array
        const randomIndex = Math.floor(Math.random() * result.data.length);
        const selectedAnimal = result.data[randomIndex];
        setAnimal(selectedAnimal);
        // Save to session storage
        sessionStorage.setItem('cachedExtinctAnimal', JSON.stringify(selectedAnimal));
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching extinct animal:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if we have cached data
    const cachedAnimal = sessionStorage.getItem('cachedExtinctAnimal');
    if (cachedAnimal) {
      try {
        setAnimal(JSON.parse(cachedAnimal));
        setLoading(false);
      } catch (err) {
        // If parsing fails, fetch new data
        fetchAnimal();
      }
    } else {
      // No cached data, fetch new
      fetchAnimal();
    }
  }, []);

  return (
    <div className="card-twitter mb-4">
      <div className="flex items-center justify-between p-4 pb-3 border-b border-[#eff3f4]">
        <h2 className="text-xl font-bold text-[#0f1419]">Extinct Animal</h2>
        <button
          onClick={fetchAnimal}
          disabled={loading}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
          title="Get another animal"
        >
          <RefreshCw size={18} className={`text-[#536471] ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="p-4 max-h-96 overflow-y-auto">
        {loading && !animal && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#1d9bf0] border-t-transparent"></div>
          </div>
        )}

        {error && (
          <div className="text-center py-6 px-4">
            <p className="text-red-500 text-sm mb-2">Failed to load animal</p>
            <button
              onClick={fetchAnimal}
              className="text-[#1d9bf0] text-sm hover:underline"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && animal && (
          <div className="space-y-3">
            {/* Animal Image */}
            {animal.imageSrc && (
              <div className="w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={animal.imageSrc} 
                  alt={animal.commonName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}

            {/* Common Name */}
            <h3 className="font-bold text-[#0f1419] text-lg leading-snug">
              {animal.commonName}
            </h3>

            {/* Scientific Name */}
            {animal.binomialName && (
              <p className="text-[#536471] text-sm italic">
                {animal.binomialName}
              </p>
            )}

            {/* Description */}
            {animal.shortDesc && (
              <p className="text-[#0f1419] text-sm leading-relaxed line-clamp-4">
                {animal.shortDesc}
              </p>
            )}

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-[#eff3f4] text-xs text-[#536471]">
              {animal.location && (
                <span>📍 {animal.location}</span>
              )}
              {animal.lastRecord && (
                <span>📅 Last seen: {animal.lastRecord}</span>
              )}
            </div>

            {/* Wiki Link */}
            {animal.wikiLink && (
              <a
                href={animal.wikiLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#1d9bf0] text-sm hover:underline mt-2"
              >
                <span>Learn more on Wikipedia</span>
                <ExternalLink size={14} />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
