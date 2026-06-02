import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Resets scroll to the top whenever the route changes. Without this, clicking a
 * footer link (rendered at the bottom of the page) keeps the previous scroll
 * position, leaving the user staring at the bottom of the new page — which reads
 * as "nothing happened" on short pages.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);

  return null;
}
