'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

const STORAGE_KEY = 'yasumappu_cloud_cta_clicked';
const SURVEY_URL = 'https://yasumappu.vercel.app/ui';

const INITIAL_STATIC_MS = 35000;
const PULSE_DELAY_MS = 15000;
const MOVE_DURATION_MS = 25000;
const REST_DURATION_MS = 10000;
const SCALE_STEP = 0.05;
const MAX_SCALE_STEPS = 3;
const REST_SCALE_TRIGGER_MS = MOVE_DURATION_MS + 9000;

type Bounds = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  width: number;
  height: number;
  perimeter: number;
};

function computeBounds(button: HTMLButtonElement): Bounds | null {
  const rect = button.getBoundingClientRect();
  if (!rect.width || !rect.height) return null;

  const headerHeight =
    document.querySelector('header')?.getBoundingClientRect().height ?? 0;
  const topPadding = 2;
  const isDesktop = (window.visualViewport?.width ?? window.innerWidth) >= 768;
  const rightPadding = isDesktop ? 32 : 12;
  const leftPadding = 8;
  const bottomPadding = 8;
  const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
  const viewportHeight = window.visualViewport?.height ?? window.innerHeight;

  const minX = leftPadding;
  const maxX = Math.max(leftPadding, viewportWidth - rightPadding - rect.width);
  const minY = headerHeight + topPadding;
  const maxY = Math.max(minY, viewportHeight - bottomPadding - rect.height);

  const width = Math.max(0, maxX - minX);
  const height = Math.max(0, maxY - minY);
  const perimeter = Math.max(1, 2 * (width + height));

  return { minX, maxX, minY, maxY, width, height, perimeter };
}

function getPerimeterPosition(bounds: Bounds, progress: number) {
  const distance = bounds.perimeter * progress;
  const { width, height, minX, maxX, minY, maxY } = bounds;

  if (distance <= height) {
    return { x: maxX, y: minY + distance };
  }
  if (distance <= height + width) {
    return { x: maxX - (distance - height), y: maxY };
  }
  if (distance <= 2 * height + width) {
    return { x: minX, y: maxY - (distance - width - height) };
  }
  return { x: minX + (distance - 2 * height - width), y: minY };
}

export default function CloudCtaButton() {
  const router = useRouter();
  const positionRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const baseScaleRef = useRef<HTMLDivElement>(null);
  const bounceRef = useRef<HTMLDivElement>(null);
  const boundsRef = useRef<Bounds | null>(null);
  const lastScaleRef = useRef<number>(1);
  const startTimeRef = useRef<number | null>(null);
  const lastEdgeRef = useRef<number | null>(null);
  const bounceTimeoutRef = useRef<number | null>(null);

  const [frozen, setFrozen] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(STORAGE_KEY) === '1';
  });
  const [pulseActive, setPulseActive] = useState(false);

  useEffect(() => {
    if (frozen) return;
    const timer = window.setTimeout(() => setPulseActive(true), PULSE_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [frozen]);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const updateBounds = () => {
      boundsRef.current = computeBounds(button);
      const bounds = boundsRef.current;
      if (!bounds || !positionRef.current) return;
      positionRef.current.style.transform = `translate3d(${bounds.maxX}px, ${bounds.minY}px, 0)`;
    };

    updateBounds();
    window.addEventListener('resize', updateBounds);
    return () => window.removeEventListener('resize', updateBounds);
  }, []);

  useEffect(() => {
    if (frozen) return;
    let rafId = 0;

    const animate = (now: number) => {
      if (!startTimeRef.current) startTimeRef.current = now;
      const elapsed = now - startTimeRef.current;
      const bounds = boundsRef.current;

      if (bounds && positionRef.current) {
        let x = bounds.maxX;
        let y = bounds.minY;

        if (elapsed >= INITIAL_STATIC_MS) {
          const afterStart = elapsed - INITIAL_STATIC_MS;
          const cycleElapsed = afterStart % (MOVE_DURATION_MS + REST_DURATION_MS);

          if (cycleElapsed < MOVE_DURATION_MS) {
            const progress = cycleElapsed / MOVE_DURATION_MS;
            const pos = getPerimeterPosition(bounds, progress);
            x = pos.x;
            y = pos.y;

            const distance = bounds.perimeter * progress;
            const edgeIndex =
              distance <= bounds.height
                ? 0
                : distance <= bounds.height + bounds.width
                  ? 1
                  : distance <= 2 * bounds.height + bounds.width
                    ? 2
                    : 3;

            if (lastEdgeRef.current !== null && lastEdgeRef.current !== edgeIndex) {
              const bounce = bounceRef.current;
              if (bounce) {
                bounce.classList.remove('cloud-cta-bounce');
                void bounce.offsetWidth;
                bounce.classList.add('cloud-cta-bounce');
                if (bounceTimeoutRef.current) {
                  window.clearTimeout(bounceTimeoutRef.current);
                }
                bounceTimeoutRef.current = window.setTimeout(() => {
                  bounce.classList.remove('cloud-cta-bounce');
                }, 260);
              }
            }
            lastEdgeRef.current = edgeIndex;
          } else {
            lastEdgeRef.current = null;
          }
        }

        positionRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }

      if (baseScaleRef.current) {
        const afterStart = Math.max(0, elapsed - INITIAL_STATIC_MS);
        const steps =
          afterStart >= REST_SCALE_TRIGGER_MS
            ? Math.min(
                MAX_SCALE_STEPS,
                Math.floor(
                  (afterStart - REST_SCALE_TRIGGER_MS) /
                    (MOVE_DURATION_MS + REST_DURATION_MS)
                ) + 1
              )
            : 0;

        const scale = 1 + steps * SCALE_STEP;
        if (scale !== lastScaleRef.current) {
          lastScaleRef.current = scale;
          baseScaleRef.current.style.transform = `scale(${scale})`;
        }
      }

      rafId = window.requestAnimationFrame(animate);
    };

    rafId = window.requestAnimationFrame(animate);
    return () => {
      window.cancelAnimationFrame(rafId);
      if (bounceTimeoutRef.current) {
        window.clearTimeout(bounceTimeoutRef.current);
        bounceTimeoutRef.current = null;
      }
    };
  }, [frozen]);

  useEffect(() => {
    if (!frozen || !boundsRef.current || !positionRef.current) return;
    const bounds = boundsRef.current;
    positionRef.current.style.transform = `translate3d(${bounds.maxX}px, ${bounds.minY}px, 0)`;
  }, [frozen]);

  const handleClick = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, '1');
    }
    setFrozen(true);
    setPulseActive(false);

    if (SURVEY_URL) {
      router.push(SURVEY_URL);
    } else {
      console.warn('NEXT_PUBLIC_SURVEY_URL is not set.');
    }
  };

  return (
    <div ref={positionRef} className="cloud-cta">
      <div ref={baseScaleRef} className="cloud-cta-base">
        <div ref={bounceRef} className="cloud-cta-bounce-wrap">
          <div className={pulseActive && !frozen ? 'cloud-cta-pulse' : undefined}>
            <button
              ref={buttonRef}
              type="button"
              className="cloud-cta-button"
              onClick={handleClick}
              aria-label="アンケートへ進む"
            >
              <img
                src="/ボタン用雲.png"
                alt=""
                className="cloud-cta-image"
                onLoad={() => {
                  const button = buttonRef.current;
                  if (button && positionRef.current) {
                    const bounds = computeBounds(button);
                    boundsRef.current = bounds;
                    if (bounds) {
                      positionRef.current.style.transform = `translate3d(${bounds.maxX}px, ${bounds.minY}px, 0)`;
                    }
                  }
                }}
              />
              <span className="cloud-cta-label">次へ</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
