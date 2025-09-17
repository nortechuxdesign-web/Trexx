import { useEffect, useRef } from "react";
import { drawArtworkToCanvas } from "@/lib/canvas-utils";

interface CanvasPreviewProps {
  companyName: string;
  primaryColor: string;
  missionType: string;
  logoPath?: string;
}

export default function CanvasPreview({
  companyName,
  primaryColor,
  missionType,
  logoPath,
}: CanvasPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const placeholderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const placeholder = placeholderRef.current;
    
    if (!canvas || !placeholder) return;

    const hasData = companyName || missionType !== "follow-instagram";
    
    if (hasData) {
      // Hide placeholder and show canvas
      placeholder.style.display = "none";
      canvas.style.display = "block";
      
      // Draw to canvas
      drawArtworkToCanvas(canvas, {
        companyName: companyName || "TIME",
        primaryColor,
        missionType,
        logoPath,
      });
    } else {
      // Show placeholder
      placeholder.style.display = "flex";
      canvas.style.display = "none";
    }
  }, [companyName, primaryColor, missionType, logoPath]);

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `arte-${companyName || "design"}-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  // Expose download function globally for the download button
  useEffect(() => {
    (window as any).downloadArtwork = downloadCanvas;
  }, [companyName]);

  return (
    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
      {/* Canvas for generated art */}
      <canvas
        ref={canvasRef}
        width={1080}
        height={1080}
        className="w-full h-full object-contain canvas-preview"
        style={{ display: "none" }}
        data-testid="canvas-preview"
      />
      
      {/* Placeholder preview */}
      <div 
        ref={placeholderRef}
        className="absolute inset-0 flex items-center justify-center preview-canvas"
        data-testid="placeholder-preview"
      >
        <div className="text-center relative z-10 w-full h-full flex flex-col justify-center items-center">
          {/* Instagram Icons */}
          <div 
            className="absolute top-8 right-8 w-16 h-16 rounded-2xl shadow-lg flex items-center justify-center"
            style={{ backgroundColor: primaryColor }}
          >
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </div>
          <div 
            className="absolute bottom-8 left-8 w-16 h-16 rounded-2xl shadow-lg flex items-center justify-center"
            style={{ backgroundColor: primaryColor }}
          >
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </div>
          
          {/* Main Text */}
          <div className="space-y-4 px-8">
            {missionType === "choose-proplayer" ? (
              <>
                <h3 className="text-4xl md:text-5xl font-black text-white distressed-text tracking-wider">
                  ESCOLHA O SEU
                </h3>
                <h3 
                  className="text-4xl md:text-5xl font-black distressed-text tracking-wider"
                  style={{ color: primaryColor }}
                >
                  PRO PLAYER
                </h3>
                <h3 className="text-4xl md:text-5xl font-black text-white distressed-text tracking-wider">
                  FAVORITO
                </h3>
              </>
            ) : (
              <>
                <h3 className="text-4xl md:text-5xl font-black text-white distressed-text tracking-wider">
                  SIGA O{" "}
                  <span style={{ color: primaryColor }}>
                    {companyName || "TIME"}
                  </span>
                </h3>
                <h3 className="text-4xl md:text-5xl font-black text-white distressed-text tracking-wider">
                  NO INSTAGRAM
                </h3>
              </>
            )}
          </div>
          
          {/* Footer Logo */}
          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center space-x-2">
              <span className="text-white font-bold text-xl">Trexx</span>
              <div 
                className="px-2 py-1 rounded text-black text-sm font-bold"
                style={{ backgroundColor: primaryColor }}
              >
                CLUB
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
