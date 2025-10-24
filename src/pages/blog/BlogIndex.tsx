import React, { useState, useEffect } from "react";
import { blogApi, type BlogPost } from "../../services/blogApi";
import { blogPosts } from "../../data/blogPosts";

export const BlogIndex: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>(blogPosts); // Start with static data as fallback
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const fetchedPosts = await blogApi.getAllPublishedBlogs();

        // If we got data from the backend, use it; otherwise stick with static data
        if (fetchedPosts && fetchedPosts.length > 0) {
          setPosts(fetchedPosts);
        }
      } catch (error) {
        console.error('Failed to fetch blogs, using static data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <section className="bg-black pb-24 pt-32 text-white">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
        <header className="mb-16 text-center sm:text-left">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#fd8a0d]/80">
            Insights & Guides
          </p>
          <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold text-white/85">
            The retail AI playbook your team can put to work today
          </h1>
          <p className="mt-6 text-base sm:text-lg text-white/60 max-w-3xl">
            Deep dives, tactical guides, and real-world experiments from AiPRL strategists helping retailers reduce response times and drive unforgettable store experiences.
          </p>
        </header>

        {loading && posts.length === 0 ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <div className="grid gap-8 sm:gap-10">
            {posts.map((post) => (
            <article
              key={post.id}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-10 shadow-lg shadow-black/10 transition hover:border-white/25 hover:bg-white/[0.06]"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-semibold uppercase tracking-wide text-[#fd8a0d]/80">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#fd8a0d]"></span>
                  {post.tag}
                </span>
                <span className="text-white/40">{post.date} | {post.readingTime}</span>
              </div>

              <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-white/85 group-hover:text-white">
                {post.title}
              </h2>

              <p className="mt-4 text-sm sm:text-base text-white/60 sm:max-w-3xl">
                {post.excerpt}
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <span className="text-sm font-medium text-white/60">{post.author}</span>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-white/70">
                  Read this story
                </span>
              </div>

              <a
                href={`/blog/${post.id}`}
                className="absolute inset-0"
                aria-label={`Read ${post.title}`}
              />
            </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};