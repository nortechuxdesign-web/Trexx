export interface ArtworkData {
  companyName: string;
  primaryColor: string;
  missionType: string;
  logoPath?: string;
}

export function drawArtworkToCanvas(canvas: HTMLCanvasElement, data: ArtworkData) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const { companyName, primaryColor, missionType, logoPath } = data;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw gradient background
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, primaryColor);
  gradient.addColorStop(1, "#000000");
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Set up text properties
  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  
  // Add text shadow effect
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowOffsetX = 4;
  ctx.shadowOffsetY = 4;
  ctx.shadowBlur = 8;

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  if (missionType === "choose-proplayer") {
    // Pro Player template
    ctx.font = "bold 72px Inter, sans-serif";
    
    ctx.fillText("ESCOLHA O SEU", centerX, centerY - 60);
    
    // Company name in primary color
    ctx.fillStyle = primaryColor;
    ctx.fillText("PRO PLAYER", centerX, centerY);
    
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("FAVORITO", centerX, centerY + 60);
  } else {
    // Instagram template
    ctx.font = "bold 72px Inter, sans-serif";
    
    const line1 = `SIGA O ${companyName}`;
    const line2 = "NO INSTAGRAM";
    
    ctx.fillText(line1, centerX, centerY - 30);
    ctx.fillText(line2, centerX, centerY + 30);
    
    // Highlight company name
    const textMetrics = ctx.measureText(`SIGA O `);
    const companyX = centerX - textMetrics.width/2 + ctx.measureText(`SIGA O `).width;
    
    ctx.fillStyle = primaryColor;
    ctx.fillText(companyName, companyX + ctx.measureText(companyName).width/2, centerY - 30);
  }

  // Draw Instagram icons for Instagram template
  if (missionType === "follow-instagram") {
    drawInstagramIcon(ctx, 150, 150, primaryColor);
    drawInstagramIcon(ctx, canvas.width - 150, canvas.height - 150, primaryColor);
  }

  // Draw footer logo
  drawFooterLogo(ctx, centerX, canvas.height - 120, primaryColor);

  // Load and draw uploaded logo if available
  if (logoPath) {
    const logoImg = new Image();
    logoImg.crossOrigin = "anonymous";
    logoImg.onload = () => {
      // Draw logo in footer area
      const logoSize = 80;
      const logoX = centerX - logoSize / 2;
      const logoY = canvas.height - 200;
      
      ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
    };
    logoImg.src = logoPath;
  }
}

function drawInstagramIcon(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  const iconSize = 64;
  const bgSize = 80;
  
  // Draw background circle
  ctx.fillStyle = color;
  ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 4;
  ctx.shadowBlur = 12;
  
  const radius = bgSize / 2;
  ctx.beginPath();
  ctx.roundRect(x - radius, y - radius, bgSize, bgSize, 16);
  ctx.fill();
  
  // Reset shadow for icon
  ctx.shadowColor = "transparent";
  
  // Draw Instagram icon (simplified)
  ctx.fillStyle = "#FFFFFF";
  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = 3;
  
  // Outer rounded rectangle
  ctx.beginPath();
  ctx.roundRect(x - iconSize/3, y - iconSize/3, iconSize*2/3, iconSize*2/3, 6);
  ctx.stroke();
  
  // Inner circle (camera lens)
  ctx.beginPath();
  ctx.arc(x, y, iconSize/6, 0, Math.PI * 2);
  ctx.stroke();
  
  // Small circle (flash)
  ctx.beginPath();
  ctx.arc(x + iconSize/6, y - iconSize/6, 3, 0, Math.PI * 2);
  ctx.fill();
}

function drawFooterLogo(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  ctx.shadowColor = "transparent";
  
  // Draw "Trexx" text
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 32px Inter, sans-serif";
  ctx.textAlign = "left";
  
  const trexxWidth = ctx.measureText("Trexx").width;
  const startX = x - (trexxWidth + 80) / 2; // Center the entire logo
  
  ctx.fillText("Trexx", startX, y);
  
  // Draw "CLUB" badge
  const badgeX = startX + trexxWidth + 10;
  const badgeY = y - 16;
  const badgeWidth = 60;
  const badgeHeight = 32;
  
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 4);
  ctx.fill();
  
  // "CLUB" text
  ctx.fillStyle = "#000000";
  ctx.font = "bold 16px Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("CLUB", badgeX + badgeWidth/2, y - 2);
}
