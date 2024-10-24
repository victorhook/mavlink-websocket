import React, { useEffect, useRef } from 'react';

function Horizon({ pitch, roll }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear the canvas
    ctx.clearRect(0, 0, width, height);

    // Draw sky
    ctx.fillStyle = '#7ec0ee';
    ctx.fillRect(0, 0, width, centerY);

    // Draw ground
    ctx.fillStyle = '#006994';
    ctx.fillRect(0, centerY, width, centerY);

    // Apply roll rotation
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((roll * Math.PI) / 180);
    ctx.translate(-centerX, -centerY);

    // Draw horizon line adjusted by pitch
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(0, centerY + pitch); // Apply pitch
    ctx.lineTo(width, centerY + pitch);
    ctx.stroke();

    ctx.restore();
  }, [pitch, roll]);

  return <canvas ref={canvasRef} width={200} height={200} />;
}

export default Horizon;
