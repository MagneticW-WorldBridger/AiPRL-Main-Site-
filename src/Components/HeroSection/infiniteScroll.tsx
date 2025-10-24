"use client";

import { InfiniteMovingCards } from "../ui/infinite-moving-cards";
// import CharlesDickens from "../../assets/AiprlLogo.svg";
import PennyMustard from "../../assets/GraphicContent/PennyMustard.png";
import PattyPeck from "../../assets/GraphicContent/PattyPeck.png";
import Mercato from "../../assets/GraphicContent/Mercato.png";
import RuralKing from "../../assets/GraphicContent/RuralKing.png";
import Gavigan from "../../assets/GraphicContent/Gavigan's.png";
import WoodStock from "../../assets/GraphicContent/WoodStock.png";
import Baers from "../../assets/GraphicContent/Baers.png";

export function InfiniteMovingCardsDemo() {
  return (
    <div className="h-[12rem] rounded-md flex flex-col dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
      <InfiniteMovingCards
        items={testimonials}
        direction="right"
        speed="slow"
        className="scale-150 sm:scale-150 md:scale-150"
      />
    </div>
  );
}

const testimonials = [
  {
    title: "Penny Mustard",
    image: {
      src: PennyMustard,
      alt: "Penny Mustard",
    },
  },
  {
    title: "Patty Peck",
    image: {
      src: PattyPeck,
      alt: "Patty Peck",
    },
  },
  {
    title: "Mercato",
    image: {
      src: Mercato,
      alt: "Mercato",
    },
  },
  {
    title: "Rural King",
    image: {
      src: RuralKing,
      alt: "Rural King",
    },
  },
  {
    title: "Gavigan's",
    image: {
      src: Gavigan,
      alt: "Gavigan's",
    },
  },
  {
    title: "WoodStock",
    image: {
      src: WoodStock,
      alt: "WoodStock",
    },
  },
  {
    title: "Baers",
    image: {
      src: Baers,
      alt: "Baers",
    },
  }
];
