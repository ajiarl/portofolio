import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);

  // Menggunakan useMotionValue agar tidak memicu re-render React (Mencegah Lag)
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Konfigurasi pegas (spring) untuk titik dalam (Sangat cepat dan responsif)
  const springConfigDot = { damping: 40, stiffness: 1000, mass: 0.1 };
  const dotX = useSpring(cursorX, springConfigDot);
  const dotY = useSpring(cursorY, springConfigDot);

  // Konfigurasi pegas untuk lingkaran luar (Sedikit lebih lambat untuk efek 'ngikutin')
  const springConfigCircle = { damping: 30, stiffness: 400, mass: 0.5 };
  const circleX = useSpring(cursorX, springConfigCircle);
  const circleY = useSpring(cursorY, springConfigCircle);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'a' ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('.group') ||
        target.tagName.toLowerCase() === 'input'
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      {/* Outer Circle */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] hidden sm:block backdrop-blur-[1px]"
        style={{
          x: circleX,
          y: circleY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          height: isHovering ? 48 : 32,
          width: isHovering ? 48 : 32,
          backgroundColor: isHovering ? 'rgba(52, 211, 153, 0.1)' : 'transparent',
          border: isHovering ? '2px solid rgba(52, 211, 153, 0.8)' : '2px solid rgba(52, 211, 153, 0.5)',
          mixBlendMode: isHovering ? 'screen' : 'normal',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      />
      
      {/* Inner Dot */}
      <motion.div
        className="fixed top-0 left-0 bg-emerald-400 rounded-full pointer-events-none z-[10000] hidden sm:block"
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
          width: 8,
          height: 8,
        }}
        animate={{
          scale: isHovering ? 0 : 1,
        }}
        transition={{ type: 'spring', stiffness: 1000, damping: 40 }}
      />
    </>
  );
};

export default CustomCursor;
