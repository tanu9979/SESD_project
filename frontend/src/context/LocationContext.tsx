import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LocationContextType {
  countryCode: string;
  currencyCode: string;
  currencySymbol: string;
  isIndia: boolean;
  convertPrice: (inr: number) => string;
}

const SYMBOLS: Record<string, string> = {
  INR: '₹', USD: '$', GBP: '£', EUR: '€', AUD: 'A$', CAD: 'C$', SGD: 'S$', AED: 'د.إ', JPY: '¥',
};

const LocationContext = createContext<LocationContextType>({} as LocationContextType);

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [countryCode,  setCountryCode]  = useState('IN');
  const [currencyCode, setCurrencyCode] = useState('INR');
  const [rates, setRates] = useState<Record<string, number>>({});

  useEffect(() => {
    const stored = localStorage.getItem('folio_location');
    if (stored) {
      const { countryCode: cc, currencyCode: cur } = JSON.parse(stored);
      setCountryCode(cc); setCurrencyCode(cur);
    } else {
      fetch('https://ipapi.co/json/')
        .then(r => r.json())
        .then(d => {
          const cc = d.country_code || 'IN';
          const cur = d.currency || 'INR';
          setCountryCode(cc); setCurrencyCode(cur);
          localStorage.setItem('folio_location', JSON.stringify({ countryCode: cc, currencyCode: cur }));
        }).catch(() => {});
    }

    fetch('https://api.frankfurter.app/latest?from=INR')
      .then(r => r.json())
      .then(d => setRates(d.rates || {}))
      .catch(() => {});
  }, []);

  const convertPrice = (inr: number): string => {
    if (currencyCode === 'INR') return `₹${inr.toFixed(2)}`;
    const rate = rates[currencyCode];
    if (!rate) return `₹${inr.toFixed(2)}`;
    const symbol = SYMBOLS[currencyCode] || currencyCode;
    return `${symbol}${(inr * rate).toFixed(2)}`;
  };

  return (
    <LocationContext.Provider value={{
      countryCode, currencyCode,
      currencySymbol: SYMBOLS[currencyCode] || currencyCode,
      isIndia: countryCode === 'IN',
      convertPrice,
    }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
