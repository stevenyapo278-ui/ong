import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const CustomCursor = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Very reactive spring for the ring
  const ringX = useSpring(mouseX, { damping: 25, stiffness: 300 });
  const ringY = useSpring(mouseY, { damping: 25, stiffness: 300 });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      
      const target = e.target as HTMLElement;
      setIsPointer(window.getComputedStyle(target).cursor === 'pointer');
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseX, mouseY]);

  if (isMobile) return null;

  return (
    <>
      {/* Visible Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-secondary rounded-full z-[10000] pointer-events-none shadow-[0_0_10px_rgba(0,0,0,0.1)]"
        style={{ x: mouseX, y: mouseY, translateX: '-50%', translateY: '-50%' }}
      />
      
      {/* Visible Ring - Subtle and clean */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border-2 border-secondary rounded-full z-[9999] pointer-events-none"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          scale: isPointer ? 1.3 : 1,
          opacity: 0.8,
        }}
      />

      <style dangerouslySetInnerHTML={{ __html: `
        body { cursor: none !important; }
        a, button, [role="button"], input, textarea, .cursor-pointer { cursor: none !important; }
        
        /* Fallback for when pointer is interacting to ensure it doesn't get lost */
        ::selection { background: var(--primary); color: white; }
      ` }} />
    </>
  );
};

export default CustomCursor;
