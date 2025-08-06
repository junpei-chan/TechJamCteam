import Link from 'next/link';

export default function Top() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Tech Jam Cteam!</h1>
      
      <div className="space-y-4">
        <Link 
          href="/api-test"
          className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          API疎通テストページへ
        </Link>
      </div>
    </main>
  );
}
