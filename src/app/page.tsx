"use client";

import { useEffect, useState } from "react";

interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

interface Photo {
  id: string;
  url: string;
  title: string;
  desc: string;
  loc: string;
  comments: Comment[];
}

export default function FloridaTripLog() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/photos")
      .then((res) => res.json())
      .then((data) => {
        setPhotos(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const addComment = async (photoId: string, text: string, author: string) => {
    const res = await fetch(`/api/photos/${photoId}/comments`, {
      method: "POST",
      body: JSON.stringify({ text, author }),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      const newComment = await res.json();
      setPhotos((prev) =>
        prev.map((p) =>
          p.id === photoId ? { ...p, comments: [newComment, ...p.comments] } : p
        )
      );
    }
  };

  if (loading) return <div className="p-20 text-center">Loading Trip Log...</div>;

  return (
    <div className="min-h-screen bg-[#fdfdfd] text-[#1a1a1a] font-sans">
      <header className="py-20 px-5 text-center bg-white border-b">
        <h1 className="font-serif text-5xl md:text-7xl mb-4 italic">Florida Trip</h1>
        <p className="uppercase tracking-[0.3em] text-[#7f8c8d]">Carmem & Eric — Feb 2026</p>
      </header>

      <div className="max-w-xl mx-auto my-20 px-5 text-center leading-relaxed text-lg text-[#444]">
        A visual diary of our time exploring Florida's history and architecture. 
        From the Spanish fortifications of St. Augustine to the Frank Lloyd Wright masterpieces in Lakeland.
      </div>

      <main className="max-w-[1400px] mx-auto px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {photos.map((photo) => (
            <div key={photo.id} className="bg-white p-4 shadow-sm border">
              <img src={`${photo.url}=w800`} alt={photo.title} className="w-full block" />
              <div className="py-5 border-b">
                <h2 className="font-serif text-xl italic mb-2">{photo.title}</h2>
                <p className="text-sm leading-relaxed text-[#7f8c8d] mb-3">{photo.desc}</p>
                <div className="text-[10px] uppercase tracking-widest text-[#ccc]">
                  Feb 2026 &middot; {photo.loc}
                </div>
              </div>

              {/* Comment Section */}
              <div className="mt-5">
                <h3 className="text-xs uppercase font-bold mb-3">Comments</h3>
                <div className="space-y-3 mb-5 max-h-40 overflow-y-auto">
                  {photo.comments?.map((c) => (
                    <div key={c.id} className="text-xs border-l-2 border-blue-500 pl-3">
                      <span className="font-bold">{c.author}:</span> {c.text}
                    </div>
                  ))}
                  {(!photo.comments || photo.comments.length === 0) && (
                    <div className="text-xs text-gray-400 italic">No comments yet.</div>
                  )}
                </div>
                <CommentForm onSave={(text, author) => addComment(photo.id, text, author)} />
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="py-20 text-center text-[#7f8c8d] text-xs tracking-widest">
        ST. AUGUSTINE & LAKELAND &middot; FEBRUARY 2026
      </footer>
    </div>
  );
}

function CommentForm({ onSave }: { onSave: (text: string, author: string) => void }) {
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (!text) return;
        onSave(text, author || "Guest");
        setText("");
        setAuthor("");
      }}
    >
      <input
        type="text"
        placeholder="Your name"
        className="text-xs p-2 border outline-none focus:border-blue-500"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />
      <textarea
        placeholder="Write a comment..."
        className="text-xs p-2 border outline-none focus:border-blue-500 min-h-[50px]"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit" className="bg-black text-white text-[10px] uppercase py-2 font-bold hover:bg-gray-800 transition">
        Post
      </button>
    </form>
  );
}
