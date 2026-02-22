# YardGuard Landscaping - Website Structure Map

```
                    ┌─────────────────────────────────────────┐
                    │     ygtoronto.com            │
                    │            (HOME)                       │
                    └─────────────────┬───────────────────────┘
                                      │
          ┌───────────────────────────┼───────────────────────────┐
          │                           │                           │
          ▼                           ▼                           ▼
    ┌───────────┐              ┌───────────┐              ┌───────────┐
    │  SERVICES │              │   ABOUT   │              │  CONTACT  │
    │ (dropdown)│              │  /about   │              │ /contact  │
    └─────┬─────┘              └───────────┘              └───────────┘
          │
          │
          ├────────────────────────────────────────────────────────────┐
          │                                                            │
          ▼                                                            │
    ┌──────────────────────┐                                           │
    │  GROUNDS MAINTENANCE │                                           │
    │ /maintenance-snow-   │                                           │
    │     removal          │                                           │
    └──────────────────────┘                                           │
          │                                                            │
          ▼                                                            │
    ┌──────────────────────┐                                           │
    │    SNOW REMOVAL      │                                           │
    │    /snow-removal     │                                           │
    └──────────────────────┘                                           │
          │                                                            │
          ▼                                                            │
    ┌──────────────────────┐                                           │
    │ LANDSCAPE            │                                           │
    │ CONSTRUCTION         │                                           │
    │ /landscape-          │                                           │
    │   construction       │                                           │
    └──────────────────────┘                                           │
          │                                                            │
          ▼                                                            │
    ┌──────────────────────┐                                           │
    │  3D LANDSCAPE DESIGN │                                           │
    │ /3dlandscape-design  │                                           │
    └──────────────────────┘                                           │
          │                                                            │
          ▼                                                            │
    ┌──────────────────────┐                                           │
    │ GARDENING & PLANTING │                                           │
    │ /gardening-and-      │                                           │
    │     planting         │                                           │
    └──────────────────────┘                                           │
          │                                                            │
          ▼                                                            │
    ┌──────────────────────┐                                           │
    │ AQUATIC GARDENS      │◄──────────────────────────────────────────┘
    │    & PONDS           │
    │ /water-and-fire-     │
    │     features         │
    └──────────────────────┘
```

## Hierarchical View

```
ygtoronto.com/
│
├── HOME (/)
│   └── Contains: Hero, Services overview, Contact form, Social links
│
├── SERVICES (Dropdown Menu - No dedicated page)
│   │
│   ├── GROUNDS MAINTENANCE (/maintenance-snow-removal)
│   │   └── Services: Mowing, Trimming, Hedge Trimming, Mulching,
│   │       Spring/Fall Cleanups, Fertilizing, Aeration, etc.
│   │
│   ├── SNOW REMOVAL (/snow-removal)
│   │   └── Winter maintenance services
│   │
│   ├── LANDSCAPE CONSTRUCTION (/landscape-construction)
│   │   └── Services: Interlock & Flagstone, Patios, Walkways,
│   │       Retaining Walls, Outdoor Kitchens, Pergolas, etc.
│   │
│   ├── 3D LANDSCAPE DESIGN (/3dlandscape-design)
│   │   └── 3D visualization and design services
│   │
│   ├── GARDENING & PLANTING (/gardening-and-planting)
│   │   └── Garden design and plant installation
│   │
│   └── AQUATIC GARDENS & PONDS (/water-and-fire-features)
│       └── Water features and pond installations
│
├── ABOUT (/about)
│   └── Company info, Team bio (Michael Kasowski), Press article link
│
└── CONTACT (/contact)
    └── Contact form (Name, Email, Phone, Message)
```

## Navigation Graph (Node-Edge Representation)

```
                              ┌─────────┐
                     ┌────────│  HOME   │────────┐
                     │        └────┬────┘        │
                     │             │             │
                     ▼             │             ▼
              ┌──────────┐        │      ┌──────────┐
              │  ABOUT   │◄───────┼─────►│ CONTACT  │
              └──────────┘        │      └──────────┘
                     ▲            │            ▲
                     │            ▼            │
                     │     ┌──────────┐        │
                     │     │ SERVICES │        │
                     │     └────┬─────┘        │
                     │          │              │
     ┌───────────────┼──────────┼──────────────┼───────────────┐
     │               │          │              │               │
     ▼               ▼          ▼              ▼               ▼
┌─────────┐   ┌───────────┐ ┌────────┐ ┌───────────┐   ┌───────────┐
│ GROUNDS │   │   SNOW    │ │LANDSCP.│ │    3D     │   │ GARDENING │
│  MAINT. │   │ REMOVAL   │ │CONSTR. │ │  DESIGN   │   │& PLANTING │
└─────────┘   └───────────┘ └────────┘ └───────────┘   └───────────┘
                                                              │
                                                              ▼
                                                       ┌───────────┐
                                                       │  AQUATIC  │
                                                       │  GARDENS  │
                                                       └───────────┘

═══════════════════════════════════════════════════════════════════
LEGEND:
  ──────►  Navigation link (all pages link back to main nav)
  All service subpages are accessible via SERVICES dropdown
  All pages contain header navigation to all other sections
═══════════════════════════════════════════════════════════════════
```

## Complete URL List

| Page Name              | URL Path                        | Depth |
|------------------------|---------------------------------|-------|
| Home                   | /                               | 0     |
| About                  | /about                          | 1     |
| Contact                | /contact                        | 1     |
| Grounds Maintenance    | /maintenance-snow-removal       | 2     |
| Snow Removal           | /snow-removal                   | 2     |
| Landscape Construction | /landscape-construction         | 2     |
| 3D Landscape Design    | /3dlandscape-design             | 2     |
| Gardening & Planting   | /gardening-and-planting         | 2     |
| Aquatic Gardens & Ponds| /water-and-fire-features        | 2     |

## External Links Found

- Facebook: https://www.facebook.com/YardGuardlandscaping/
- Instagram: https://www.instagram.com/yardguardlandscaping/
- Press Article: https://www.thefutureisunlimited.ca/redesigning-the-landscape/

---
*Site map generated on 2025-12-26*
*Total Internal Pages: 9*
*Maximum Depth: 2 levels*
