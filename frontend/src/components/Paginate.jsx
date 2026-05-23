import React from 'react';
import { Link } from 'react-router-dom';

const Paginate = ({ pages, page, isAdmin = false, keyword = '' }) => {
  return (
    pages > 1 && (
      <div className="flex justify-center mt-12 mb-8">
        <nav className="inline-flex rounded-xl shadow-sm bg-white dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
          {[...Array(pages).keys()].map((x) => (
            <Link
              key={x + 1}
              to={
                !isAdmin
                  ? keyword
                    ? `/search/${keyword}/page/${x + 1}`
                    : `/page/${x + 1}`
                  : `/admin/productlist/${x + 1}`
              }
              className={`
                px-4 py-2 mx-1 rounded-lg text-sm font-medium transition-all duration-200
                ${x + 1 === page 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }
              `}
            >
              {x + 1}
            </Link>
          ))}
        </nav>
      </div>
    )
  );
};

export default Paginate;
