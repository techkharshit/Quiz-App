// src/components/Particles.jsx
import React from 'react';
import './Particles.css';

const Particles = () => {
  return (
    <div className="particle-background">
      {[...Array(30)].map((_, i) => (
        <div 
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.2}s`,
            width: `${Math.random() * 4 + 2}px`,
            height: `${Math.random() * 4 + 2}px`,
          }}
        />
      ))}
    </div>
  );
};

export default Particles;