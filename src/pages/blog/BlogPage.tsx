import React from "react";
import { blogPosts } from "../../data/blogPosts";
import { BlogIndex } from "./BlogIndex";
import { BlogArticle } from "./BlogArticle";

const getPathname = () => {
  if (typeof window === "undefined") return "/";
  return window.location.pathname;
};

const getSlugFromPath = (pathname: string): string | undefined => {
  if (!pathname.startsWith("/blog")) return undefined;
  const [, , slug] = pathname.split("/");
  return slug && slug.length > 0 ? slug : undefined;
};

export const BlogPage: React.FC = () => {
  const pathname = getPathname();
  const slug = getSlugFromPath(pathname);

  if (!slug) {
    return <BlogIndex />;
  }

  const currentPost = blogPosts.find((post) => post.id === slug);

  if (!currentPost) {
    return <BlogIndex />;
  }

  const relatedPosts = blogPosts.filter((post) => post.id !== currentPost.id);

  return <BlogArticle post={currentPost} relatedPosts={relatedPosts} />;
};