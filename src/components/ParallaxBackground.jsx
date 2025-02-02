// Create new component: src/components/ParallaxBackground.jsx
import { useState, useEffect } from 'react';
import './ParallaxBackground.css';

const ParallaxBackground = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20, // Adjust 20 for intensity
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      className="parallax-background"
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`
      }}
    >
      <div className="background-overlay"></div>
    </div>
  );
};

export default ParallaxBackground;