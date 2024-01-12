import Link from "next/link";

export default function Home() {
  return (
    <main className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center">
      <div className="text-center mb-20">
        <h1 className="text-4xl font-bold mb-4">Dungeons & Dragons GPT API</h1>
        <p className="text-lg mb-8">
          Unleash the power of AI for your DnD adventures!
        </p>
        <Link
          href="/api/documentation"
          className="bg-blue-500 hover:bg-blue-400 py-2 px-4 rounded-full text-lg font-semibold transition duration-300"
        >
          Documentation
        </Link>
      </div>
    </main>
  );
}
