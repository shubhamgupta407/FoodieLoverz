import { createContext, useContext, useState } from "react";

const OutletContext = createContext(null);

export const OUTLETS = [
  {
    id: "mumbai",
    name: "Mumbai",
    subtitle: "Bandra West, Mumbai",
    image: "https://images.unsplash.com/photo-1567337710282-00832b415979?w=600&auto=format",
    emoji: "🌆",
  },
  {
    id: "delhi",
    name: "Delhi",
    subtitle: "Connaught Place, New Delhi",
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&auto=format",
    emoji: "🏛️",
  },
  {
    id: "pune",
    name: "Pune",
    subtitle: "Koregaon Park, Pune",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format",
    emoji: "🍽️",
  },
  {
    id: "kerala",
    name: "Kerala",
    subtitle: "MG Road, Kochi",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&auto=format",
    emoji: "🌴",
  },
];

export function OutletProvider({ children }) {
  const [selectedOutlet, setSelectedOutlet] = useState(null);

  return (
    <OutletContext.Provider value={{ selectedOutlet, setSelectedOutlet }}>
      {children}
    </OutletContext.Provider>
  );
}

export const useOutlet = () => useContext(OutletContext);
