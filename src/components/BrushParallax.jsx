import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import brush1 from '/public/images/brush1.png';
import brush2 from '/public/images/brush2.png';
import brush3 from '/public/images/brush3.png';

const BrushParallax = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, -50]);
  const y2 = useTransform(scrollY, [0, 500], [0, 30]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.img
        src={brush1}
        style={{ y: y1 }}
        alt="Brush 1"
        className="absolute top-10 left-5 w-28 opacity-50"
      />
      <motion.img
        src={brush2}
        style={{ y: y2 }}
        alt="Brush 2"
        className="absolute bottom-20 right-10 w-36 opacity-50"
      />
      <motion.img
        src={brush3}
        style={{ y: y1 }}
        alt="Brush 3"
        className="absolute top-1/2 left-1/3 w-32 opacity-50"
      />
    </div>
  );
};

export default BrushParallax;