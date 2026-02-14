import { useRef, useEffect, useState } from 'react';

/**
 * MockupCanvas Component
 * Renders uploaded image on product mockup with drag-to-position functionality
 */
const MockupCanvas = ({ mockupType, uploadedImage, onPositionChange }) => {
  const canvasRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 150, y: 150 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Mockup configurations
  const mockupConfigs = {
    't-shirt': {
      color: '#FFFFFF',
      printArea: { x: 150, y: 150, width: 200, height: 200 },
      shape: 'tshirt',
    },
    'hoodie': {
      color: '#2C3E50',
      printArea: { x: 150, y: 180, width: 200, height: 200 },
      shape: 'hoodie',
    },
    'mug': {
      color: '#FFFFFF',
      printArea: { x: 200, y: 150, width: 150, height: 150 },
      shape: 'mug',
    },
  };

  const config = mockupConfigs[mockupType] || mockupConfigs['t-shirt'];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw mockup background
    ctx.fillStyle = config.color;
    if (config.shape === 'tshirt') {
      drawTShirt(ctx);
    } else if (config.shape === 'hoodie') {
      drawHoodie(ctx);
    } else if (config.shape === 'mug') {
      drawMug(ctx);
    }

    // Draw print area outline
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(
      config.printArea.x,
      config.printArea.y,
      config.printArea.width,
      config.printArea.height
    );
    ctx.setLineDash([]);

    // Draw uploaded image if exists
    if (uploadedImage) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, position.x, position.y, 150, 150);
      };
      img.src = uploadedImage;
    }
  }, [mockupType, uploadedImage, position, config]);

  const drawTShirt = (ctx) => {
    ctx.beginPath();
    ctx.moveTo(100, 100);
    ctx.lineTo(400, 100);
    ctx.lineTo(450, 150);
    ctx.lineTo(450, 450);
    ctx.lineTo(50, 450);
    ctx.lineTo(50, 150);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#D1D5DB';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const drawHoodie = (ctx) => {
    ctx.beginPath();
    ctx.moveTo(80, 120);
    ctx.lineTo(420, 120);
    ctx.lineTo(470, 170);
    ctx.lineTo(470, 480);
    ctx.lineTo(30, 480);
    ctx.lineTo(30, 170);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#D1D5DB';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const drawMug = (ctx) => {
    ctx.beginPath();
    ctx.ellipse(250, 250, 120, 150, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#D1D5DB';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const handleMouseDown = (e) => {
    if (!uploadedImage) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if click is on the image
    if (
      x >= position.x &&
      x <= position.x + 150 &&
      y >= position.y &&
      y <= position.y + 150
    ) {
      setIsDragging(true);
      setDragStart({ x: x - position.x, y: y - position.y });
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - dragStart.x;
    const y = e.clientY - rect.top - dragStart.y;

    // Keep within print area bounds
    const newX = Math.max(
      config.printArea.x,
      Math.min(x, config.printArea.x + config.printArea.width - 150)
    );
    const newY = Math.max(
      config.printArea.y,
      Math.min(y, config.printArea.y + config.printArea.height - 150)
    );

    setPosition({ x: newX, y: newY });
    if (onPositionChange) {
      onPositionChange({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`border-2 border-gray-300 rounded-lg ${
          uploadedImage ? 'cursor-move' : 'cursor-default'
        }`}
      />
      {uploadedImage && (
        <p className="mt-2 text-sm text-gray-600 text-center">
          Drag the image to position it on the mockup
        </p>
      )}
    </div>
  );
};

export default MockupCanvas;
