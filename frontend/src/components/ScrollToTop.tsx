import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // On remonte tout en haut dès que le chemin change
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' // On utilise 'instant' pour que le changement de page semble "propre" et immédiat
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
