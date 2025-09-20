import React from "react";
import { blogPosts } from "../../data/blogPosts";

export const BlogPreview = () => {
  return (
    <section id="blog" className="scroll-mt-28 py-12 sm:py-16 lg:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-[#fd8a0d]/80">
              From the AiPRL lab
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold text-white/80">
              Retail AI insights worth a read
            </h2>
            <p className="mt-4 text-sm sm:text-base md:text-lg text-white/60 max-w-2xl">
              Practical stories, data-backed experiments, and playbooks from teams leading connected retail experiences.
            </p>
          </div>
          <a
            href="/blog"
            className="inline-flex w-fit items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/80 transition hover:border-white/40 hover:text-white"
          >
            View all posts
          </a>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogPosts.slice(0, 3).map((post) => (
            <article
              key={post.id}
              className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-white/25 hover:bg-white/[0.06]"
            >
              <div className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#fd8a0d]/80">
                <span className="inline-flex h-2 w-2 rounded-full bg-[#fd8a0d]"></span>
                {post.tag}
              </div>
              <h3 className="mb-3 text-2xl font-semibold text-white/80 group-hover:text-white">
                {post.title}
              </h3>
              <p className="mb-6 flex-1 text-sm text-white/60">
                {post.excerpt}
              </p>
              <div className="mt-auto flex items-center justify-between text-xs text-white/40">
                <span>{post.date}</span>
                <span>{post.readingTime}</span>
              </div>
              <a
                href={`/blog#${post.id}`}
                className="absolute inset-0"
                aria-label={`Read ${post.title}`}
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};