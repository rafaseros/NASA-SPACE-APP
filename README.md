# ISS Experiments - NASA Space App

An educational simulation platform featuring space experiments from the International Space Station, built with React, TypeScript, and Vite.

## Current Application State

- **Architecture**: React + TypeScript + Vite
- **Styles**: Tailwind CSS with mobile-first approach
- **Routes**: React Router with Layout and nested routes
- **Internationalization**: i18next + react-i18next (ES/EN) with JSON resources
- **Key components**: MainMenu, Layout, ZinniaISSGame, ResourceControl, ComingSoon

## Main Game: Zinnia on the ISS

- Simulation based on Scott Kelly's real experiment (2016)
- **Game modes**:
  - Easy: 4 resources (water, light, nutrients, temperature)
  - Hard: 7 resources (includes humidity, CO2, energy), frequent events and limited energy
- Plant growth in 6 stages: seed → germination → seedling → vegetative → bud → flowering
- Dynamic events: solar storm, temperature spike, water leak, air adjustment, power saving mode, humidity increase
- Health system and stress factors with states (warning, critical)
- Visual animations for resources and stages
- Educational tutorial with historical context, objectives and tips
- Pause, victory and defeat screens with metrics and links to NASA resources

## Main Menu

- Professional design with gradients and glassmorphism
- Language selector (ES/EN) in the main menu header
- Experiments grid with states (available / coming soon)
- Educational section with categories and tags (microgravity, biology, fluids, crystallography)
- Footer with links to NASA, ESA and JAXA

## Internationalization

- Externalized resources: `src/locales/es/translation.json` and `src/locales/en/translation.json`
- Game and menu texts translated using `t(...)`
- Dynamic messages (events, logs, stages) translated
- Language persistence in localStorage and browser detection

## Future Evolution (Roadmap)

### Phase 1: New experiments (short term)

- **Crystal Growth**: crystallography simulation in microgravity; temperature/time control; 3D visual
- **Fluid Dynamics**: fluid behavior simulation; particle/surface tension visualizations

### Phase 2: Experience (medium term)

- Progression: achievements, global statistics, career mode, rankings
- Educational content: knowledge base, videos, biographies, historical timeline
- Technical: PWA, offline mode, notifications, analytics

### Phase 3: Educational platform (long term)

- Multi-user: profiles, classes, collaborative mode, real-time chat
- International: more languages and cultural localization
- AI: adaptive tutor, recommendations, analysis, procedural scenario generation

### Phase 4: Immersion

- VR/AR with ISS environments, gesture interaction and haptic simulation

## Strategic Objectives

- **Educational**: democratize space science, inspire STEM vocations, complement education, create community
- **Technical**: scalability, mobile performance, accessibility (WCAG 2.1), maintainability
- **Commercial**: premium content, institutional licensing, partnerships, public API

## Success Metrics (Indicative)

- **Engagement**: >15 min per session
- **Retention**: 70% at 7 days
- **Educational**: 90% complete at least 1 experiment
- **Technical**: < 2 s initial load time
- **Accessibility**: compatible with screen readers

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **Internationalization**: i18next
- **Build Tool**: Vite
- **Linting**: ESLint

## Contributing

This project is part of the NASA Space Apps Challenge. Contributions are welcome!

## License

This project is open source and available under the [MIT License](LICENSE).
