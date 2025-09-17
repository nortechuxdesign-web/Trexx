export interface ArtworkData {
  companyName: string;
  primaryColor: string;
  missionType: string;
  logoPath?: string;
}

// Função auxiliar para ajustar texto à largura disponível
function fitTextToWidth(
  ctx: CanvasRenderingContext2D, 
  text: string, 
  maxWidth: number, 
  minSize: number, 
  maxSize: number, 
  fontFamily: string
): number {
  let fontSize = maxSize;
  
  while (fontSize >= minSize) {
    ctx.font = `900 ${fontSize}px ${fontFamily}`;
    const textWidth = ctx.measureText(text).width;
    
    if (textWidth <= maxWidth) {
      return fontSize;
    }
    
    fontSize -= 5;
  }
  
  return minSize;
}

export function drawArtworkToCanvas(canvas: HTMLCanvasElement, data: ArtworkData) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const { companyName, primaryColor, missionType, logoPath } = data;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // FUNDO PRETO com esfumaçado da cor nas bordas
  drawBlackBackgroundWithColorSmudge(ctx, canvas.width, canvas.height, primaryColor);

  // Margens: lateral mín.50px, superior/inferior mín.70px
  const margins = {
    horizontal: 50,
    vertical: 70
  };

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  if (missionType === "choose-proplayer") {
    // Pro Player template
    drawProPlayerTemplate(ctx, centerX, centerY, primaryColor, companyName, margins);
  } else {
    // Instagram template
    drawInstagramTemplate(ctx, centerX, centerY, primaryColor, companyName, margins);
  }

  // Usar IMAGEM REAL 3D do Instagram para Instagram template
  if (missionType === "follow-instagram") {
    drawRealInstagram3DIcon(ctx, 150, 150);
    drawRealInstagram3DIcon(ctx, canvas.width - 150, canvas.height - 150);
  }

  // Draw footer logo
  drawFooterLogo(ctx, centerX, canvas.height - 120, primaryColor, logoPath);
}

// NOVO: Fundo preto com esfumaçado da cor nas bordas (300px cada lado)
function drawBlackBackgroundWithColorSmudge(
  ctx: CanvasRenderingContext2D, 
  width: number, 
  height: number, 
  primaryColor: string
) {
  // Fundo totalmente preto
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, width, height);

  // Esfumaçado da cor na borda esquerda (300px)
  const leftGradient = ctx.createLinearGradient(0, 0, 300, 0);
  leftGradient.addColorStop(0, primaryColor + "80"); // 50% transparência
  leftGradient.addColorStop(0.5, primaryColor + "40"); // 25% transparência
  leftGradient.addColorStop(1, "transparent");
  
  ctx.fillStyle = leftGradient;
  ctx.fillRect(0, 0, 300, height);

  // Esfumaçado da cor na borda direita (300px)
  const rightGradient = ctx.createLinearGradient(width - 300, 0, width, 0);
  rightGradient.addColorStop(0, "transparent");
  rightGradient.addColorStop(0.5, primaryColor + "40"); // 25% transparência
  rightGradient.addColorStop(1, primaryColor + "80"); // 50% transparência
  
  ctx.fillStyle = rightGradient;
  ctx.fillRect(width - 300, 0, 300, height);
}

// NOVO: Usar a imagem REAL 3D do Instagram
function drawRealInstagram3DIcon(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => {
    const size = 120;
    // Desenhar com sombra para efeito 3D
    ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 8;
    ctx.shadowBlur = 20;
    
    ctx.drawImage(img, x - size/2, y - size/2, size, size);
    
    // Reset shadow
    ctx.shadowColor = "transparent";
  };
  // Usar a imagem anexada
  img.src = "/src/assets/instagram-3d-logo-free-png_1758076574587.webp";
}

function drawInstagramTemplate(
  ctx: CanvasRenderingContext2D, 
  centerX: number, 
  centerY: number, 
  primaryColor: string, 
  companyName: string,
  margins: { horizontal: number; vertical: number }
) {
  // Área segura para texto (respeitando margens)
  const safeWidth = ctx.canvas.width - (margins.horizontal * 2);
  const startY = margins.vertical;
  
  // Reset shadows
  ctx.shadowColor = "transparent";
  
  // Configuração base do texto
  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  // Sombra forte para todos os textos
  ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
  ctx.shadowOffsetX = 6;
  ctx.shadowOffsetY = 6;
  ctx.shadowBlur = 12;

  // H2 - "SIGA O" (35-50px)
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "900 45px Anton, Impact, sans-serif";
  const line1Y = startY + 50;
  ctx.fillText("SIGA O", centerX, line1Y);

  // H1 - Nome da empresa (130-160px) - Destaque na cor primária
  ctx.fillStyle = primaryColor;
  let fontSize = fitTextToWidth(ctx, companyName.toUpperCase(), safeWidth, 130, 160, "Anton, Impact, sans-serif");
  ctx.font = `900 ${fontSize}px Anton, Impact, sans-serif`;
  const line2Y = line1Y + 100; // Espaçamento de 100px
  ctx.fillText(companyName.toUpperCase(), centerX, line2Y);

  // H2 - "NO INSTAGRAM" (35-50px)  
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "900 45px Anton, Impact, sans-serif";
  const line3Y = line2Y + fontSize + 80; // Espaçamento baseado no tamanho da fonte + 80px
  ctx.fillText("NO INSTAGRAM", centerX, line3Y);
}

function drawProPlayerTemplate(
  ctx: CanvasRenderingContext2D,
  centerX: number, 
  centerY: number, 
  primaryColor: string, 
  companyName: string,
  margins: { horizontal: number; vertical: number }
) {
  // Área segura para texto (respeitando margens)
  const safeWidth = ctx.canvas.width - (margins.horizontal * 2);
  const startY = margins.vertical;
  
  // Reset shadows
  ctx.shadowColor = "transparent";
  
  // Configuração base do texto
  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  // Sombra forte para todos os textos
  ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
  ctx.shadowOffsetX = 6;
  ctx.shadowOffsetY = 6;
  ctx.shadowBlur = 12;

  // H2 - "ESCOLHA O SEU" (35-50px)
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "900 45px Anton, Impact, sans-serif";
  const line1Y = startY + 50;
  ctx.fillText("ESCOLHA O SEU", centerX, line1Y);
  
  // H1 - "PRO PLAYER" destaque (130-160px) - Na cor primária
  ctx.fillStyle = primaryColor;
  let fontSize = fitTextToWidth(ctx, "PRO PLAYER", safeWidth, 130, 160, "Anton, Impact, sans-serif");
  ctx.font = `900 ${fontSize}px Anton, Impact, sans-serif`;
  const line2Y = line1Y + 100;
  ctx.fillText("PRO PLAYER", centerX, line2Y);
  
  // H2 - "FAVORITO" (35-50px)
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "900 45px Anton, Impact, sans-serif";
  const line3Y = line2Y + fontSize + 80;
  ctx.fillText("FAVORITO", centerX, line3Y);
}

function drawFooterLogo(
  ctx: CanvasRenderingContext2D, 
  x: number, 
  y: number, 
  color: string, 
  logoPath?: string
) {
  ctx.shadowColor = "transparent";
  
  if (logoPath) {
    // Carregar e desenhar logo do cliente se disponível
    const logoImg = new Image();
    logoImg.crossOrigin = "anonymous";
    logoImg.onload = () => {
      const logoSize = 100;
      const logoX = x - logoSize / 2;
      const logoY = y - logoSize / 2 - 10;
      
      ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
    };
    logoImg.src = logoPath;
  } else {
    // Draw "Trexx" text como fallback
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 32px Anton, Impact, sans-serif";
    ctx.textAlign = "left";
    
    const trexxWidth = ctx.measureText("Trexx").width;
    const startX = x - (trexxWidth + 80) / 2;
    
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
    ctx.font = "bold 16px Anton, Impact, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("CLUB", badgeX + badgeWidth/2, y - 2);
  }
}