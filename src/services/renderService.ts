import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { IPoster } from '../models/Poster.js';
import { ITemplate } from '../models/Template.js';

export class PosterRenderService {
  public static async renderPoster(
    poster: IPoster,
    template?: ITemplate | null
  ): Promise<string> {
    const width = 1200;
    const height = 1600;

    const posterDir = path.join(process.cwd(), 'uploads', 'posters');
    if (!fs.existsSync(posterDir)) {
      fs.mkdirSync(posterDir, { recursive: true });
    }

    const filename = `poster-${poster._id}-${Date.now()}.png`;
    const outputPath = path.join(posterDir, filename);

    const colors = template?.layoutConfig?.colorScheme || {
      primary: '#006a4e',
      secondary: '#f42a41',
      accent: '#ffd700',
      background: '#042f2e',
      footerBg: '#02201b',
      headerTextColor: '#ffffff',
      bodyTextColor: '#ffffff',
    };

    const headline = poster.formData.headline || 'মহান বিজয় দিবস সফল হোক';
    const subheadline = poster.formData.subheadline || 'বীর শহীদদের প্রতি বিনম্র শ্রদ্ধা';
    const slogan = poster.formData.slogan || 'স্বাধীনতার চেতনায় গড়ব মোরা নতুন বাংলাদেশ';
    const candidateName = poster.formData.candidateName || 'মো: রফিকুল ইসলাম';
    const designation = poster.formData.designation || 'যুগ্ম সাধারণ সম্পাদক';
    const org = poster.formData.organizationOrParty || 'বাংলাদেশ জাতীয়তাবাদী দল';
    const location = [poster.formData.unionOrThana, poster.formData.district].filter(Boolean).join(', ');
    const creditLine = poster.formData.creditLine || 'প্রচারে: সচেতন নাগরিক সমাজ';

    const svgOverlay = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${colors.background}" />
          <stop offset="50%" stop-color="${colors.primary}" />
          <stop offset="100%" stop-color="${colors.footerBg}" />
        </linearGradient>

        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fffbeb" />
          <stop offset="40%" stop-color="#f59e0b" />
          <stop offset="70%" stop-color="#b45309" />
          <stop offset="100%" stop-color="#fef08a" />
        </linearGradient>

        <linearGradient id="redBadgeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${colors.secondary}" />
          <stop offset="100%" stop-color="#991b1b" />
        </linearGradient>

        <linearGradient id="footerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${colors.footerBg}" stop-opacity="0.95"/>
          <stop offset="100%" stop-color="#02100d" stop-opacity="1"/>
        </linearGradient>

        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#000000" flood-opacity="0.6"/>
        </filter>
      </defs>

      <rect width="${width}" height="${height}" fill="url(#bgGradient)"/>
      <rect x="25" y="25" width="${width - 50}" height="${height - 50}" rx="16" fill="none" stroke="url(#goldGradient)" stroke-width="5" stroke-dasharray="16,8"/>
      <rect x="38" y="38" width="${width - 76}" height="${height - 76}" rx="12" fill="none" stroke="${colors.accent}" stroke-width="2" opacity="0.7"/>

      <g filter="url(#shadow)">
        <rect x="400" y="45" width="400" height="40" rx="20" fill="rgba(0,0,0,0.5)" stroke="url(#goldGradient)" stroke-width="1.5"/>
        <text x="600" y="72" font-family="'Hind Siliguri', 'Noto Serif Bengali', sans-serif" font-size="20" font-weight="bold" fill="#fef08a" text-anchor="middle">
          বিসমিল্লাহির রাহমানির রাহিম
        </text>
      </g>

      <g filter="url(#shadow)">
        <rect x="120" y="330" width="960" height="90" rx="14" fill="url(#redBadgeGradient)" stroke="url(#goldGradient)" stroke-width="3"/>
        <text x="600" y="390" font-family="'Hind Siliguri', sans-serif" font-size="44" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="1">
          ${headline}
        </text>
      </g>

      <g filter="url(#shadow)">
        <text x="600" y="465" font-family="'Hind Siliguri', sans-serif" font-size="26" font-weight="bold" fill="#fef08a" text-anchor="middle">
          ${subheadline}
        </text>
      </g>

      <g filter="url(#shadow)">
        <rect x="160" y="500" width="880" height="55" rx="28" fill="rgba(0,0,0,0.6)" stroke="${colors.accent}" stroke-width="2"/>
        <text x="600" y="538" font-family="'Hind Siliguri', sans-serif" font-size="24" font-weight="bold" fill="#ffffff" text-anchor="middle">
          ${slogan}
        </text>
      </g>

      <g filter="url(#shadow)">
        <rect x="40" y="1320" width="1120" height="230" rx="18" fill="url(#footerGradient)" stroke="url(#goldGradient)" stroke-width="3"/>
        <text x="600" y="1410" font-family="'Hind Siliguri', sans-serif" font-size="60" font-weight="900" fill="#ffffff" text-anchor="middle">
          ${candidateName}
        </text>
        <text x="600" y="1465" font-family="'Hind Siliguri', sans-serif" font-size="28" font-weight="bold" fill="#fef08a" text-anchor="middle">
          ${designation} — ${org}
        </text>
        ${location ? `<text x="600" y="1500" font-family="'Hind Siliguri', sans-serif" font-size="22" font-weight="normal" fill="#e2e8f0" text-anchor="middle">${location}</text>` : ''}
        <text x="600" y="1535" font-family="'Hind Siliguri', sans-serif" font-size="18" font-weight="bold" fill="#94a3b8" text-anchor="middle">
          ${creditLine}
        </text>
      </g>
    </svg>
    `;

    const svgBuffer = Buffer.from(svgOverlay);

    await sharp({
      create: {
        width,
        height,
        channels: 4,
        background: { r: 4, g: 47, b: 46, alpha: 1 },
      },
    })
      .composite([{ input: svgBuffer, top: 0, left: 0 }])
      .png({ quality: 95 })
      .toFile(outputPath);

    return `/uploads/posters/${filename}`;
  }
}
