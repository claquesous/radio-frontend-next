import Link from 'next/link';

interface StreamNavigationProps {
  streamId: string;
}

export default function StreamNavigation({ streamId }: StreamNavigationProps) {
  return (
    <nav className="bg-slate-800 text-white p-4 mb-6 rounded-lg">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-6">
          <Link 
            href={`/manage/streams/${streamId}/plays`} 
            className="hover:text-blue-300 transition-colors duration-200 font-medium"
          >
            Plays
          </Link>
          <Link 
            href={`/manage/streams/${streamId}/requests`} 
            className="hover:text-blue-300 transition-colors duration-200 font-medium"
          >
            Requests
          </Link>
          <Link 
            href={`/manage/streams/${streamId}/choosers`} 
            className="hover:text-blue-300 transition-colors duration-200 font-medium"
          >
            Choosers
          </Link>
        </div>
        
        <Link 
          href={`/manage/streams/${streamId}/edit`} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200 font-medium"
        >
          Edit
        </Link>
      </div>
    </nav>
  );
}
