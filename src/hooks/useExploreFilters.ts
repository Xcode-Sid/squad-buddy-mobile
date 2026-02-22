import { useState, useMemo } from 'react';
import { FIELDS } from '../data/mockData';
import type { SportId } from '../data/mockData';

type SortKey = 'rating' | 'price';

export function useExploreFilters() {
  const [search, setSearch] = useState('');
  const [selectedSport, setSelectedSport] = useState<SportId | ''>('');
  const [selectedCity, setSelectedCity] = useState('');
  const [sortBy, setSortBy] = useState<SortKey>('rating');
  const [showFilters, setShowFilters] = useState(false);

  const cities = useMemo(() => [...new Set(FIELDS.map((f) => f.city))], []);

  const filteredFields = useMemo(() => {
    const q = search.toLowerCase();
    return FIELDS.filter((f) => {
      if (q && !f.name.toLowerCase().includes(q)) return false;
      if (selectedSport && !f.sports.includes(selectedSport)) return false;
      if (selectedCity && f.city !== selectedCity) return false;
      return true;
    }).sort((a, b) => (sortBy === 'price' ? a.pricePerHour - b.pricePerHour : b.rating - a.rating));
  }, [search, selectedSport, selectedCity, sortBy]);

  const toggleFilters = () => setShowFilters((v) => !v);
  const clearSport = () => setSelectedSport('');
  const clearCity = () => setSelectedCity('');
  const hasActiveFilters = Boolean(selectedSport || selectedCity);

  return {
    search, setSearch,
    selectedSport, setSelectedSport, clearSport,
    selectedCity, setSelectedCity, clearCity,
    sortBy, setSortBy,
    showFilters, toggleFilters,
    cities, filteredFields, hasActiveFilters,
  };
}
