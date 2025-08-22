import React from 'react';

function FloatingParticles() {
  return (
    <div className="floating-particles">
      {[...Array(20)].map((_, i) => (
        <div key={i} className="particle" style={{
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 3}s`,
          animationDuration: `${3 + Math.random() * 4}s`
        }} />
      ))}
    </div>
  );
}

export default FloatingParticles;
