import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const BreadCrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Routes that should not be links
  const nonLinkRoutes = ['form-details', 'form-builder', 'response', 'add', ':id'];

  return (
    <nav aria-label="breadcrumb" className="ml-1 text-sm capitalize font-comfortaa">
      <ol className="flex space-x-2 text-gray-600 dark:text-gray-300">
        <li className="breadcrumb-item">
          <Link to="/" className="hover:text-orange-500 dark:hover:text-orange-400">
            Dashboard
          </Link>
        </li>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;

          // Skip rendering dynamic segments (e.g., IDs)
          if (value.match(/^[0-9a-fA-F]{24}$/) || value === ':id') {
            return null; // Hide the ID or dynamic segment
          }

          // Don't make certain routes links
          if (nonLinkRoutes.includes(value)) {
            return (
              <React.Fragment key={to}>
                <span className="mx-1">/</span>
                <li className="breadcrumb-item text-gray-500 dark:text-gray-200" aria-current="page">
                  {value}
                </li>
              </React.Fragment>
            );
          }

          return (
            <React.Fragment key={to}>
              <span className="mx-1">/</span>
              {isLast ? (
                <li className="breadcrumb-item text-gray-500 dark:text-gray-200" aria-current="page">
                  {value}
                </li>
              ) : (
                <li className="breadcrumb-item">
                  <Link to={to} className="hover:text-orange-500 dark:hover:text-orange-400">
                    {value}
                  </Link>
                </li>
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default BreadCrumbs;