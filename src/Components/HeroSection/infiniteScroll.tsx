"use client";

import React from "react";
import { InfiniteMovingCards } from "../ui/infinite-moving-cards";
import CharlesDickens from "../../assets/AiprlLogo.svg";

export function InfiniteMovingCardsDemo() {
  return (
    <div className="h-[12rem] rounded-md flex flex-col dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
      <InfiniteMovingCards
        items={testimonials}
        direction="right"
        speed="slow"
      />
    </div>
  );
}

const testimonials = [
  {
    title: "A Tale of Two Cities",
    image: {
      src: CharlesDickens,
      alt: "Charles Dickens",
    },
  },
  {
    title: "Hamlet",
    image: {
      src: CharlesDickens,
      alt: "William Shakespeare",
    },
  },
  {
    title: "A Dream Within a Dream",
    image: {
      src: CharlesDickens,
      alt: "Edgar Allan Poe",
    },
  },
  {
    title: "Pride and Prejudice",
    image: {
      src: CharlesDickens,
      alt: "Jane Austen",
    },
  },
  {
    title: "Moby-Dick",
    image: {
      src: CharlesDickens,
      alt: "Herman Melville",
    },
  },
];
