import React, { useState } from "react";
import { TopNav } from "./TopNav";
import { OverlayMenu } from "./OverlayMenu";
import { BrandLogo } from "./BrandLogo";
// import { Home } from "./Home";


export default function App() {
    const [open, setOpen] = useState(false);


    return (
        <>
            <div className="font-[Inter] bg-black">
                <TopNav onOpen={() => setOpen(true)} />
                <BrandLogo />
                {/* <Home onOpen={() => setOpen(true)} /> */}

                {/* <main id="home" className="mx-auto max-w-5xl px-6 py-16 space-y-24">
                    <section id="features" className="space-y-4">
                        <h2 className="text-2xl font-bold text-violet-900">Features</h2>
                        <p className="text-violet-700/80 max-w-prose">This is placeholder content for features.</p>
                    </section>


                    <section id="blog" className="space-y-4">
                        <h2 className="text-2xl font-bold text-violet-900">Blog</h2>
                        <p className="text-violet-700/80 max-w-prose">Placeholder blog section.</p>
                    </section>


                    <section id="careers" className="space-y-4">
                        <h2 className="text-2xl font-bold text-violet-900">Careers</h2>
                        <p className="text-violet-700/80 max-w-prose">Placeholder careers section.</p>
                    </section>


                    <section id="contact" className="space-y-4">
                        <h2 className="text-2xl font-bold text-violet-900">Contact</h2>
                        <p className="text-violet-700/80 max-w-prose">Say hello 👋</p>
                    </section>
                </main> */}

                <OverlayMenu open={open} onClose={() => setOpen(false)} />
            </div>
        </>
    );
}