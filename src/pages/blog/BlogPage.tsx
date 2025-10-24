import React, { useState, useEffect } from "react";
import { blogPosts } from "../../data/blogPosts";
import { BlogIndex } from "./BlogIndex";
import { BlogArticle } from "./BlogArticle";
import { blogApi, type BlogPost } from "../../services/blogApi";

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
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogData = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }

      try {
        // Try to fetch from backend first
        const fetchedPost = await blogApi.getBlogById(slug);

        if (fetchedPost) {
          setCurrentPost(fetchedPost);

          // Fetch all posts for related posts
          const allPosts = await blogApi.getAllPublishedBlogs();
          const related = allPosts.filter((post) => post.id !== fetchedPost.id);
          setRelatedPosts(related.slice(0, 3)); // Show max 3 related posts
        } else {
          // Fallback to static data
          const staticPost = blogPosts.find((post) => post.id === slug);
          if (staticPost) {
            setCurrentPost(staticPost);
            setRelatedPosts(blogPosts.filter((post) => post.id !== staticPost.id).slice(0, 3));
          }
        }
      } catch (error) {
        console.error('Failed to fetch blog data, using static data:', error);
        // Fallback to static data on error
        const staticPost = blogPosts.find((post) => post.id === slug);
        if (staticPost) {
          setCurrentPost(staticPost);
          setRelatedPosts(blogPosts.filter((post) => post.id !== staticPost.id).slice(0, 3));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, [slug]);

  if (!slug) {
    return <BlogIndex />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!currentPost) {
    return <BlogIndex />;
  }

  return <BlogArticle post={currentPost} relatedPosts={relatedPosts} />;
};