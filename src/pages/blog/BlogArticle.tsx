import React from "react";
import type { BlogPost } from "../../services/blogApi";

interface BlogArticleProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

export const BlogArticle: React.FC<BlogArticleProps> = ({ post, relatedPosts }) => {
  return (
    <article className="bg-black pb-24 pt-32 text-white">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6">
        <header className="mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#fd8a0d]/80">
            {post.tag}
          </p>
          <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold text-white/90">
            {post.title}
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-white/50">
            <span>{post.author}</span>
            <span className="h-1 w-1 rounded-full bg-white/30" aria-hidden />
            <span>
              {post.date} | {post.readingTime}
            </span>
          </div>
        </header>

        {post.heroImage ? (
          <div className="mb-12 overflow-hidden rounded-3xl border border-white/10">
            <img src={post.heroImage} alt={post.title} className="h-full w-full object-cover" />
          </div>
        ) : null}

        <div className="space-y-6 text-white/70">
          {post.body?.map((paragraph, index) => (
            <p key={index} className="text-base leading-7 sm:text-lg sm:leading-8">
              {paragraph}
            </p>
          )) || (
            <p className="text-base leading-7 sm:text-lg sm:leading-8">
              No content available.
            </p>
          )}
        </div>
      </div>

      {relatedPosts.length > 0 ? (
        <div className="mx-auto mt-20 w-full max-w-5xl px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-semibold text-white/85">
            Keep exploring
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {relatedPosts.slice(0, 2).map((related) => (
              <article
                key={related.id}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-white/25 hover:bg-white/[0.06]"
              >
                <div className="text-xs font-semibold uppercase tracking-wide text-[#fd8a0d]/80">
                  {related.tag}
                </div>
                <h3 className="mt-3 text-xl font-bold text-white/85 group-hover:text-white">
                  {related.title}
                </h3>
                <p className="mt-3 text-sm text-white/60">
                  {related.excerpt}
                </p>
                <div className="mt-5 text-xs text-white/40">
                  {related.date} | {related.readingTime}
                </div>
                <a
                  href={`/blog/${related.id}`}
                  className="absolute inset-0"
                  aria-label={`Read ${related.title}`}
                />
              </article>
            ))}
          </div>
        </div>
      ) : null}
    </article>
  );
};