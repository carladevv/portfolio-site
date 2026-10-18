// src/components/BioHeaderDesktop.jsx
import { useTheme } from "../ThemeContext";
import { Link, useLocation } from 'react-router';
import OptimizedImage from './OptimizedImage';
import siteImages from '../generated/site-images.json';

// react icons
import { SiLinkedin, SiGithub, SiYoutube } from "react-icons/si";


export default function BioHeaderDesktop({ t }) {
  const { theme } = useTheme();
  const lang=useLocation().pathname.startsWith('/es')?'es':'en';

  return (
    <div className={`w-full ${theme.headerStrip}`}>
      <div className="px-2 pt-2 flex items-center gap-4">

        {/* Profile picture – fixed size, circular, pixelated */}
        <div
          className={`h-256 w-256 flex items-center justify-center overflow-hidden ${theme.accentBg} `}
        >
          <OptimizedImage
            image={siteImages['/pfp.png']} sizes="128px" eager
            alt="Profile"
            className="w-32 h-32 object-contain"
            style={{ imageRendering: "pixelated" }}
          />
        </div>

        {/* Text block */}
        <div className="flex flex-col justify-center">
          <p
            className={`text-3xl font-thin uppercase ${
              theme.fontHeading || ""
            } ${theme.headerTextMain}`}
          >
            <Link to={`/${lang}/`}>{t.name}</Link>
          </p>

          <p className={`mt-2 text-base uppercase ${theme.headerTextMuted}`}>
            {t.tagline}
          </p>

          {/* Contact links */}
<div className="flex flex-row gap-3 mt-3 text-xs">
  {/* LinkedIn */}
  <a
    href="https://www.linkedin.com/in/nadina-carla-cardillo-garreta"
    target="_blank"
    rel="noopener noreferrer"
    className={`underline ${theme.headerTextMuted} hover:${theme.headerTextMain} transition-colors flex items-center gap-2`}
  >
    <SiLinkedin size={16} />
    LinkedIn
  </a>

  {/* GitHub */}
  <a
    href="https://github.com/carladevv"
    target="_blank"
    rel="noopener noreferrer"
    className={`underline ${theme.headerTextMuted} hover:${theme.headerTextMain} transition-colors flex items-center gap-2`}
  >
    <SiGithub size={16} />
    GitHub
  </a>

  {/* YouTube */}
  <a
    href="https://youtube.com/carladevv"
    target="_blank"
    rel="noopener noreferrer"
    className={`underline ${theme.headerTextMuted} hover:${theme.headerTextMain} transition-colors flex items-center gap-2`}
  >
    <SiYoutube size={16} />
    YouTube
  </a>
</div>

        </div>

      </div>
    </div>
  );
}
