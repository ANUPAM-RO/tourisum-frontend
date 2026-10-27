'use client';

import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { stagger, useAnimate } from 'framer-motion';
import type { AnimationSequence } from 'framer-motion';
import {
  Camera, Castle, Compass, Landmark, MountainSnow, Plane, Sailboat, Tent, TrainFront, TreePalm,
} from 'lucide-react';
import { useSiteSettings } from '@/lib/hooks';
import { optimizeImage } from '@/lib/utils';

const STORAGE_KEY = 'intro-seen';
const PHOTO = 'https://images.unsplash.com/photo-1564507592333-c60657eea523';

// The route is drawn between ORBIT_AT and ORBIT_AT + ORBIT; every stop lights up as the plane reaches it.
const ORBIT_AT = 1.45;
const ORBIT = 1.5;
const sineInOut = (t: number) => (1 - Math.cos(Math.PI * t)) / 2;
const reachTime = (progress: number) => ORBIT_AT + (Math.acos(1 - 2 * progress) / Math.PI) * ORBIT;

const TRAIL = 2 * Math.PI * 180;
const LIGHTS = 24;
// Every third light on the route is a landmark; the rest are small twinkling lights.
const landmarks = [Landmark, MountainSnow, TreePalm, Castle, Sailboat, Tent, Camera, TrainFront];

// Fixed pseudo-random star field so server and client render the same markup.
const stars = Array.from({ length: 60 }, (_, i) => {
  const r = (n: number) => ((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1 + 1) % 1;
  return { x: r(1) * 100, y: r(2) * 100, size: 1 + r(3) * 1.5, delay: r(4) * -4 };
});

// Runs before hydration so returning visitors (and reduced-motion users) never see a flash of the intro.
const preHydrationScript = `try{if(sessionStorage.getItem('${STORAGE_KEY}')||matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.dataset.introSeen=''}catch(e){}`;

const mask = 'radial-gradient(circle at var(--hx,50%) var(--hy,50%), transparent var(--hole), #000 calc(var(--hole) + 7vmax))';

/**
 * Full-screen "journey" intro, shown once per session: a compass appears, a plane flies a loop lighting up
 * landmarks, a destination photo fades in, then the screen opens from the centre to reveal the site.
 * Clicking, Esc or Enter jumps straight to the reveal.
 */
export default function IntroAnimation() {
  const [show, setShow] = useState(true);
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const { siteName, tagline } = useSiteSettings().settings;

  useEffect(() => {
    const root = scope.current;
    if (!root || document.documentElement.dataset.introSeen !== undefined) {
      setShow(false);
      return;
    }

    const stage = root.querySelector<HTMLElement>('.intro-stage')!;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);

    const sequence: AnimationSequence = [
      ['.intro-compass', { opacity: [0, 1], y: [26, 0] }, { at: 0.15, duration: 0.8, ease: 'easeOut' }],
      ['.intro-needle', { rotate: [-200, 0] }, { at: 0.9, duration: 0.9, ease: 'backOut' }],
      ['.intro-compass-glow', { opacity: [0, 1], scale: [0, 1] }, { at: 0.9, duration: 1 }],
      ['.intro-light', { opacity: [0, 1], scale: [0.5, 1] }, { at: 1.05, duration: 1.4, ease: 'easeOut' }],
      ['.intro-ring', { opacity: 1 }, { at: ORBIT_AT, duration: 0.01 }],
      ['.intro-orbit', { rotate: [0, 360], opacity: 1 }, { at: ORBIT_AT, duration: ORBIT, ease: sineInOut }],
      ['.intro-trail', { strokeDashoffset: [TRAIL, 0] }, { at: ORBIT_AT, duration: ORBIT, ease: sineInOut }],
      ...Array.from({ length: LIGHTS }, (_, i): AnimationSequence[number] => [
        `.intro-stop-${i}`,
        { opacity: [0, 1], scale: [0, 1] },
        { at: reachTime(i / LIGHTS) + 0.05, duration: 0.35, ease: 'backOut' },
      ]),
      ['.intro-orbit', { opacity: 0 }, { at: ORBIT_AT + ORBIT - 0.05, duration: 0.3 }],
      ['.intro-compass', { y: stage.offsetHeight * 0.43, scale: 0.74 }, { at: 2.85, duration: 1.1, ease: 'easeInOut' }],
      [
        '.intro-photo',
        { opacity: [0, 1], scale: [0.8, 1], filter: ['brightness(2.6) blur(10px)', 'brightness(1) blur(0px)'] },
        { at: 3, duration: 1.4, ease: 'easeOut' },
      ],
      ['.intro-words > *', { opacity: [0, 1], y: [14, 0] }, { at: 3.55, duration: 0.8, delay: stagger(0.15) }],
      // Hold on the finished scene for a beat before opening.
      ['.intro-stage', { scale: 1 }, { at: 4.7, duration: 0.05 }],
    ];

    let opened = false;
    let cancelled = false;
    const open = () => {
      if (opened || cancelled) return;
      opened = true;
      try {
        sessionStorage.setItem(STORAGE_KEY, '1');
      } catch {}
      document.body.style.overflow = prevOverflow;
      root.style.pointerEvents = 'none';
      const rect = stage.getBoundingClientRect();
      root.style.setProperty('--hx', `${rect.left + rect.width / 2}px`);
      root.style.setProperty('--hy', `${rect.top + rect.height / 2}px`);
      animate([
        [root, { '--hole': ['-8vmax', '150vmax'] }, { duration: 1.7, ease: 'easeIn' }],
        ['.intro-stage', { scale: 1.3 }, { at: 0, duration: 1.7, ease: 'easeIn' }],
        ['.intro-words, .intro-skip', { opacity: 0 }, { at: 0, duration: 0.5 }],
      ]).then(() => setShow(false));
    };

    const intro = animate(sequence);
    intro.then(open);

    const skip = (e: Event) => {
      if (e instanceof KeyboardEvent && !['Escape', 'Enter', ' '].includes(e.key)) return;
      intro.complete();
    };
    root.addEventListener('click', skip);
    window.addEventListener('keydown', skip);
    return () => {
      cancelled = true;
      intro.stop();
      root.removeEventListener('click', skip);
      window.removeEventListener('keydown', skip);
      document.body.style.overflow = prevOverflow;
    };
  }, [animate, scope]);

  if (!show) return null;

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: preHydrationScript }} />
      <div
        ref={scope}
        className="intro-overlay fixed inset-0 z-[100] flex cursor-pointer flex-col items-center justify-center gap-[clamp(56px,9vh,96px)] overflow-hidden bg-[radial-gradient(ellipse_at_50%_44%,#1b2547_0%,#0b1124_50%,#04060d_100%)] text-amber-50"
        style={{ '--hole': '-8vmax', WebkitMaskImage: mask, maskImage: mask } as CSSProperties}
      >
        {stars.map((s, i) => (
          <span
            key={i}
            className="intro-star absolute rounded-full bg-white"
            style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, animationDelay: `${s.delay}s` }}
          />
        ))}

        <div className="intro-stage relative aspect-square w-[min(78vw,62vmin,440px)] flex-none">
          <div className="intro-light absolute -inset-[28%] rounded-full bg-[radial-gradient(circle,rgba(255,203,110,0.24)_0%,rgba(255,154,58,0.09)_35%,transparent_65%)] opacity-0" />

          <div className="intro-photo absolute inset-[9%] overflow-hidden rounded-full bg-[radial-gradient(circle_at_50%_42%,#ffe0a0_0%,#f2a64a_38%,#8c3e12_78%)] opacity-0 [mask-image:radial-gradient(circle,#000_62%,transparent_71%)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={optimizeImage(PHOTO, 640)} alt="" fetchPriority="high" className="size-full object-cover" />
          </div>

          <svg viewBox="0 0 400 400" className="intro-ring absolute inset-0 size-full overflow-visible opacity-0">
            <defs>
              <linearGradient id="intro-route" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#fff1b8" />
                <stop offset=".45" stopColor="#ffb43c" />
                <stop offset="1" stopColor="#ff6a10" />
              </linearGradient>
            </defs>
            <circle cx="200" cy="200" r="190" fill="none" stroke="rgba(201,151,63,0.18)" strokeWidth="0.8" />
            <circle
              cx="200" cy="200" r="180"
              className="intro-trail fill-none [filter:drop-shadow(0_0_4px_#ffb347)_drop-shadow(0_0_12px_#ff7a1a)]"
              stroke="url(#intro-route)"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeDasharray={TRAIL}
              strokeDashoffset={TRAIL}
              transform="rotate(-90 200 200)"
            />
          </svg>

          {Array.from({ length: LIGHTS }, (_, i) => {
            const angle = (i / LIGHTS) * Math.PI * 2;
            const pos = { left: `${50 + 45 * Math.sin(angle)}%`, top: `${50 - 45 * Math.cos(angle)}%` };
            const Icon = i % 3 === 0 ? landmarks[i / 3] : null;
            return (
              <div key={i} className="absolute size-0" style={pos}>
                <div className={`intro-stop-${i} opacity-0`}>
                  {Icon ? (
                    <span className="absolute flex size-[clamp(28px,8vmin,40px)] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-amber-200/50 bg-[#0b1124] text-amber-200 shadow-[0_0_16px_rgba(255,154,58,0.6)]">
                      <Icon className="size-1/2" strokeWidth={1.75} />
                    </span>
                  ) : (
                    <span
                      className="intro-twinkle absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,#fffbe6_0%,#ffd45a_45%,#ff8a1c_75%,transparent_80%)] shadow-[0_0_8px_#ffae3c]"
                      style={{ animationDelay: `${(i % 4) * -0.3}s` }}
                    />
                  )}
                </div>
              </div>
            );
          })}

          {/* The plane leading the route */}
          <div className="intro-orbit absolute inset-0 opacity-0">
            <Plane
              className="absolute left-1/2 top-[5%] size-7 -translate-x-1/2 -translate-y-1/2 rotate-45 fill-white text-white drop-shadow-[0_0_10px_rgba(255,210,122,0.95)]"
              strokeWidth={1.5}
            />
          </div>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="intro-compass relative flex size-[clamp(72px,12vmin,104px)] items-center justify-center rounded-full border border-amber-200/40 bg-[#0e1530] opacity-0 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
              <span className="intro-compass-glow absolute -inset-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,180,60,0.45),transparent_65%)] opacity-0" />
              <Compass
                className="intro-needle relative size-3/5 text-amber-200 drop-shadow-[0_0_10px_rgba(255,154,58,0.85)]"
                strokeWidth={1.25}
              />
            </div>
          </div>
        </div>

        <div className="intro-words relative px-4 text-center">
          <p className="font-display pl-[0.32em] text-[clamp(26px,3.2vw,44px)] uppercase leading-none tracking-[0.32em] text-amber-100 opacity-0">
            {siteName}
          </p>
          <p className="mt-3.5 text-[10px] uppercase tracking-[0.3em] text-amber-300/80 opacity-0">
            <span lang="hi" className="text-xs normal-case tracking-[0.06em]">स्वागतम्</span> · {tagline}
          </p>
        </div>

        <button
          type="button"
          tabIndex={-1}
          className="intro-skip absolute bottom-5 right-6 p-3 text-[10px] uppercase tracking-[0.26em] text-amber-300/80 hover:text-amber-100"
        >
          Skip
        </button>
      </div>
    </>
  );
}
