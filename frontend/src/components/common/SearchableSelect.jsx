import { useEffect, useMemo, useRef, useState } from 'react';
import { FiCheck, FiChevronDown, FiSearch } from 'react-icons/fi';

const SearchableSelect = ({
  options = [],
  value = '',
  onChange,
  placeholder = 'Search...',
  emptyMessage = 'No results found',
  disabled = false,
  getOptionLabel = (option) => option?.name || '',
  getOptionDescription = () => '',
  getOptionValue = (option) => option?.id
}) => {
  const wrapperRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  const selectedOption = useMemo(
    () => options.find((option) => String(getOptionValue(option)) === String(value)),
    [options, value, getOptionValue]
  );

  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return options;

    return options.filter((option) => {
      const label = getOptionLabel(option)?.toLowerCase() || '';
      const description = getOptionDescription(option)?.toLowerCase() || '';
      return label.includes(normalizedQuery) || description.includes(normalizedQuery);
    });
  }, [options, query, getOptionLabel, getOptionDescription]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        setQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onChange?.(String(getOptionValue(option)));
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((current) => !current)}
        className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-left outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400"
      >
        <span className={selectedOption ? 'text-gray-900' : 'text-gray-400'}>
          {selectedOption ? getOptionLabel(selectedOption) : placeholder}
        </span>
        <FiChevronDown className="h-4 w-4 text-gray-400" />
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-30 mt-2 w-full rounded-xl border border-gray-200 bg-white shadow-lg">
          <div className="border-b border-gray-100 p-3">
            <div className="relative">
              <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={placeholder}
                className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-3 outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="max-h-72 overflow-y-auto p-2">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-4 text-sm text-gray-500">{emptyMessage}</div>
            ) : (
              filteredOptions.map((option) => {
                const optionValue = String(getOptionValue(option));
                const isSelected = String(value) === optionValue;
                const description = getOptionDescription(option);

                return (
                  <button
                    key={optionValue}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className="flex w-full items-start justify-between gap-3 rounded-lg px-3 py-2.5 text-left transition hover:bg-gray-50"
                  >
                    <div className="min-w-0">
                      <div className="font-medium text-gray-900">{getOptionLabel(option)}</div>
                      {description && <div className="mt-0.5 text-sm text-gray-500">{description}</div>}
                    </div>
                    {isSelected && <FiCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
