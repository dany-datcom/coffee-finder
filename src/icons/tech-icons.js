import {
  siJavascript,
  siVite,
  siGooglemaps
} from "simple-icons/icons";


export function createTechIcon(icon) {

  return `
    <svg 
      role="img"
      viewBox="0 0 24 24"
      class="tech-svg"
      aria-hidden="true">

      <path d="${icon.path}"></path>

    </svg>
  `;

}


export const techIcons = {

  javascript: createTechIcon(siJavascript),

  vite: createTechIcon(siVite),

  googleMaps: createTechIcon(siGooglemaps),


};