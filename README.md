# ☕ Coffee Finder

Coffee Finder is a front-end web application designed to help users discover coffee shops through an interactive map and location-based search.

The project integrates geospatial APIs to provide a practical, responsive, and user-friendly experience, while maintaining a modular architecture suitable for long-term maintenance and growth.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Architecture and Project Structure](#architecture-and-project-structure)
- [Live Demo](#live-demo)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Available Scripts](#available-scripts)
- [Quality and Development Standards](#quality-and-development-standards)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

---

## Overview

Coffee Finder enables users to:

- Search coffee shops by city or location
- Visualize nearby cafés on an interactive map
- Explore results with dynamic markers and information windows
- Save favorite coffee shops for quick access

This repository was developed as a portfolio project with a strong focus on clean code practices, API integration, and modular JavaScript design.

---

## Key Features

- Interactive map experience powered by Google Maps
- Location- and city-based coffee shop search
- Dynamic markers and info windows
- Favorite coffee shop persistence
- Responsive and lightweight UI

---

## Technology Stack

- **HTML5**
- **CSS3**
- **JavaScript (ES Modules)**
- **Vite**
- **Google Maps JavaScript API**
- **Geoapify Places API**
- **Geoapify Geocoding API**

---

## Architecture and Project Structure

The project follows a modular front-end architecture:

```text
src/
├── api.js
├── map.js
├── ui.js
├── storage.js
├── home.js
├── main.js
└── styles/
    └── style.css
```

### Module responsibilities

- **api.js**: integration with external APIs (Geoapify, etc.)
- **map.js**: map initialization, markers, and map interactions
- **ui.js**: rendering and UI behavior
- **storage.js**: favorites persistence and local storage logic
- **home.js / main.js**: app bootstrap and page-level orchestration

---

## Live Demo

Deployed version:  
[Coffee Finder on Render](https://coffee-finder-mylk.onrender.com/)

---

## Prerequisites

- **Node.js** (LTS recommended)
- **npm**

---

## Installation

```bash
git clone https://github.com/dany-datcom/coffee-finder.git
cd coffee-finder
npm install
npm run dev
```

---

## Environment Configuration

This project depends on third-party APIs.  
Before running in development or production, ensure required API keys are configured.

Recommended approach:

1. Create a `.env` file in the project root.
2. Define environment variables for API keys.
3. Access them through Vite conventions (`import.meta.env`).

Example:

```bash
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
VITE_GEOAPIFY_API_KEY=your_geoapify_key
```

> Important: Never commit real API keys to the repository.

---

## Available Scripts

- `npm run dev` — Start development server
- `npm run build` — Create production build
- `npm run preview` — Preview production build locally
- `npm run lint` — Run ESLint checks
- `npm run lint:fix` — Run ESLint and auto-fix issues

---

## Quality and Development Standards

- Modular JavaScript architecture
- Separation of concerns (API, map logic, UI, storage)
- Linting support with ESLint
- Responsive-first UI approach
- Maintainable and portfolio-ready codebase

---

## Roadmap

- [ ] Add advanced filters (rating, distance, open-now)
- [ ] Add robust error/loading states
- [ ] Add unit tests for key modules
- [ ] Add end-to-end tests for critical flows
- [ ] Improve accessibility (WCAG-focused enhancements)
- [ ] Add CI pipeline for lint/build validation

---

## Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes
4. Open a Pull Request with a clear description

---

## License

This project currently has **no license file** in the repository.

For professional/open collaboration, adding an MIT license is recommended.  
If you want, I can prepare a `LICENSE` file (MIT) and a short update for this section.

---

## Author

**Dany Datcom**  
GitHub: [@dany-datcom](https://github.com/dany-datcom)
