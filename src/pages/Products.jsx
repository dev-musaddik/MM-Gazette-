import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, setFilters } from '../redux/slices/productSlice';
import { fetchBrands } from '../redux/slices/brandSlice';
import ProductCard from '../components/product/ProductCard';
import Spinner from '../components/common/Spinner';
import { FiSearch, FiFilter, FiX, FiChevronDown, FiChevronUp, FiCheck, FiGrid, FiList } from 'react-icons/fi';
import { useLanguage } from '../i18n/LanguageContext';

/**
 * Products Page - Refactored with Sidebar Filters
 */
const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  
  const { products, loading, filters } = useSelector((state) => state.products);
  const { brands } = useSelector((state) => state.brands);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 500000 });
  const [selectedAvailability, setSelectedAvailability] = useState([]);
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    availability: true,
    brand: true,
  });

  const { t } = useLanguage();

  const categories = [
    { value: '', label: 'All Gadgets' },
    { value: 'Smartphone', label: 'Smartphones' },
    { value: 'Laptop', label: 'Laptops' },
    { value: 'Smart Home', label: 'Smart Home' },
    { value: 'Wearables', label: 'Wearables' },
    { value: 'Gaming', label: 'Gaming' },
    { value: 'Accessories', label: 'Accessories' },
  ];

  useEffect(() => {
    dispatch(fetchBrands());
  }, [dispatch]);

  useEffect(() => {
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    
    if (category || brand) {
      dispatch(setFilters({ category, brand }));
    }
  }, [searchParams, dispatch]);

  useEffect(() => {
    // Debounce filter dispatch
    const timeoutId = setTimeout(() => {
      dispatch(fetchProducts({
        ...filters,
        minPrice: priceRange.min,
        maxPrice: priceRange.max,
        availability: selectedAvailability.join(','),
      }));
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [dispatch, filters, priceRange, selectedAvailability]);

  const handleCategoryChange = (category) => {
    dispatch(setFilters({ category: category || null }));
    const newParams = {};
    if (category) newParams.category = category;
    if (filters.brand) newParams.brand = filters.brand;
    setSearchParams(newParams);
  };

  const handleBrandChange = (brandName) => {
    const newBrand = filters.brand === brandName ? null : brandName;
    dispatch(setFilters({ brand: newBrand }));
    
    const newParams = {};
    if (filters.category) newParams.category = filters.category;
    if (newBrand) newParams.brand = newBrand;
    setSearchParams(newParams);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setFilters({ search: searchTerm }));
  };

  const clearFilters = () => {
    dispatch(setFilters({ 
      category: null, 
      search: '', 
      brand: null,
      minPrice: 0,
      maxPrice: 500000,
      availability: []
    }));
    setSearchTerm('');
    setPriceRange({ min: 0, max: 500000 });
    setSelectedAvailability([]);
    setSearchParams({});
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleAvailabilityChange = (status) => {
    setSelectedAvailability(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const currentCategoryLabel = categories.find(c => c.value === filters.category)?.label || 'All Gadgets';

  return (
    <div className="min-h-screen bg-black pt-20 pb-12 text-white">
      {/* Breadcrumb / Header */}
      <div className="bg-white/5 border-b border-white/10 py-8 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            {currentCategoryLabel} Price in Bangladesh
          </h1>
          <p className="text-gray-400 text-sm max-w-3xl">
            {currentCategoryLabel} Price in Bangladesh starts from BDT {priceRange.min} and depending on brand and features, price may go up to BDT {priceRange.max}. Buy latest original {currentCategoryLabel} from MM Gazette BD. Browse below and order yours now!
          </p>
          
          {/* Top Brand Pills */}
          <div className="flex flex-wrap gap-2 mt-6">
            {brands.map((brand) => (
              <button
                key={brand._id}
                onClick={() => handleBrandChange(brand.name)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  filters.brand === brand.name
                    ? 'bg-white text-black border-white'
                    : 'bg-transparent text-gray-400 border-white/20 hover:border-white hover:text-white'
                }`}
              >
                {brand.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0 space-y-6">
            
            {/* Price Range */}
            <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
              <button 
                onClick={() => toggleSection('price')}
                className="w-full px-4 py-3 flex justify-between items-center bg-white/5 font-bold text-sm uppercase tracking-wider"
              >
                Price Range
                {expandedSections.price ? <FiChevronUp /> : <FiChevronDown />}
              </button>
              
              {expandedSections.price && (
                <div className="p-4 space-y-4">
                  <div className="relative h-2 bg-gray-700 rounded-full mt-2 mb-6">
                    <div 
                      className="absolute h-full bg-primary-500 rounded-full opacity-50"
                      style={{ 
                        left: `${(priceRange.min / 500000) * 100}%`, 
                        right: `${100 - (priceRange.max / 500000) * 100}%` 
                      }}
                    ></div>
                    {/* Visual handles only - functionality via inputs below for simplicity */}
                    <div 
                      className="absolute w-4 h-4 bg-primary-500 rounded-full -top-1 shadow-lg cursor-pointer"
                      style={{ left: `${(priceRange.min / 500000) * 100}%` }}
                    ></div>
                    <div 
                      className="absolute w-4 h-4 bg-primary-500 rounded-full -top-1 shadow-lg cursor-pointer"
                      style={{ left: `${(priceRange.max / 500000) * 100}%` }}
                    ></div>
                  </div>

                  <div className="flex gap-2 items-center">
                    <input
                      type="number"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                      className="w-full bg-black border border-white/20 rounded px-2 py-1 text-sm text-center focus:border-primary-500 outline-none"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="number"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                      className="w-full bg-black border border-white/20 rounded px-2 py-1 text-sm text-center focus:border-primary-500 outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Availability */}
            <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
              <button 
                onClick={() => toggleSection('availability')}
                className="w-full px-4 py-3 flex justify-between items-center bg-white/5 font-bold text-sm uppercase tracking-wider"
              >
                Availability
                {expandedSections.availability ? <FiChevronUp /> : <FiChevronDown />}
              </button>
              
              {expandedSections.availability && (
                <div className="p-4 space-y-2">
                  {['In Stock', 'Pre Order', 'Up Coming'].map((status) => {
                    const value = status === 'In Stock' ? 'inStock' : status === 'Pre Order' ? 'preOrder' : 'upComing';
                    const isChecked = selectedAvailability.includes(value);
                    return (
                      <label key={status} className="flex items-center cursor-pointer group">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center mr-3 transition-colors ${
                          isChecked ? 'bg-primary-500 border-primary-500' : 'border-gray-500 group-hover:border-primary-400'
                        }`}>
                          {isChecked && <FiCheck className="w-3 h-3 text-black" />}
                        </div>
                        <input 
                          type="checkbox" 
                          className="hidden"
                          checked={isChecked}
                          onChange={() => handleAvailabilityChange(value)}
                        />
                        <span className={`text-sm ${isChecked ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                          {status}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Brand List (Vertical) */}
            <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
              <button 
                onClick={() => toggleSection('brand')}
                className="w-full px-4 py-3 flex justify-between items-center bg-white/5 font-bold text-sm uppercase tracking-wider"
              >
                Brand
                {expandedSections.brand ? <FiChevronUp /> : <FiChevronDown />}
              </button>
              
              {expandedSections.brand && (
                <div className="p-4 space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                  {brands.map((brand) => (
                    <label key={brand._id} className="flex items-center cursor-pointer group">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center mr-3 transition-colors ${
                        filters.brand === brand.name ? 'bg-primary-500 border-primary-500' : 'border-gray-500 group-hover:border-primary-400'
                      }`}>
                        {filters.brand === brand.name && <FiCheck className="w-3 h-3 text-black" />}
                      </div>
                      <input 
                        type="checkbox" 
                        className="hidden"
                        checked={filters.brand === brand.name}
                        onChange={() => handleBrandChange(brand.name)}
                      />
                      <span className={`text-sm ${filters.brand === brand.name ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                        {brand.name}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white/5 rounded-lg border border-white/10 p-4 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <h2 className="font-bold text-lg">{currentCategoryLabel}</h2>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">Show:</span>
                  <select className="bg-black border border-white/20 rounded px-2 py-1 text-sm focus:border-primary-500 outline-none">
                    <option>20</option>
                    <option>40</option>
                    <option>60</option>
                  </select>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">Sort By:</span>
                  <select className="bg-black border border-white/20 rounded px-2 py-1 text-sm focus:border-primary-500 outline-none">
                    <option>Default</option>
                    <option>Price (Low &gt; High)</option>
                    <option>Price (High &gt; Low)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="flex justify-center py-32">
                <Spinner size="lg" />
              </div>
            ) : products?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product, index) => (
                  <div 
                    key={product._id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-32 bg-white/5 rounded-xl border border-dashed border-white/10">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/5 rounded-full mb-6">
                  <FiSearch className="w-8 h-8 text-gray-500" />
                </div>
                <h3 className="text-2xl font-display font-bold text-white mb-2">No Gadgets Found</h3>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                  We couldn't find any products matching your criteria. Try adjusting your filters.
                </p>
                <button 
                  onClick={clearFilters}
                  className="px-8 py-3 bg-primary-500 text-black rounded-sm font-bold hover:bg-white transition-colors shadow-neon-blue uppercase tracking-wider"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
