import Link from 'next/link';

export default function AdminNavigation() {
  return (
    <nav className="bg-slate-800 text-white p-4 mb-6 rounded-lg">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-6">
          <Link 
            href="/admin/songs" 
            className="hover:text-blue-300 transition-colors duration-200 font-medium"
          >
            Songs
          </Link>
          <Link 
            href="/admin/artists" 
            className="hover:text-blue-300 transition-colors duration-200 font-medium"
          >
            Artists
          </Link>
          <Link 
            href="/admin/albums" 
            className="hover:text-blue-300 transition-colors duration-200 font-medium"
          >
            Albums
          </Link>
        </div>
        
        <Link 
          href="/admin/songs/new" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200 font-medium"
        >
          + New Song
        </Link>
      </div>
    </nav>
  );
}
