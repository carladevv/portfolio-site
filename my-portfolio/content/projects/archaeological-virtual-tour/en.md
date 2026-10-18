## Opening up a difficult-to-visit site

Cova Bonica, in Vallirana near Barcelona, preserves evidence of Early Neolithic communities. Physical access is limited, and its archaeological remains can be difficult to interpret without specialist knowledge. The wider digitization project brings together scientific documentation, preventive conservation, and public interpretation: a detailed photogrammetric record preserves the cave's condition while digital experiences help people explore and understand it.

My contribution focused on the **interactive web experience**, developed in collaboration with the University of Barcelona's Grup de Recerca del Quaternari (GRQ–SERP). Building on the team's digitization work, I developed a browser-based environment that visitors can explore without installing additional software.

## Exploration rather than fixed viewpoints

The tour supports first-person exploration with desktop and touch controls. Visitors can move through the cave and open points of interest to learn about archaeological material, choosing their own route and pace.

Collision geometry defines the walkable areas, while digitally modeled walkways guide movement through the space. A navigation graph supports routes for virtual characters, whose comments add a narrative layer to the visit. The application keeps interpretive content separate from its visualization and interaction systems so it can be updated independently.

## Bringing photogrammetry to the browser

Detailed archaeological models require careful handling to work on everyday devices. The web experience combines:

- **Distance-based levels of detail**, supported by a custom automated Blender workflow for producing simplified models.
- Progressive loading and browser caching, avoiding repeated downloads and spreading resource use across the visit.
- Optimized textures and reused scene elements to reduce memory use.
- An object viewer that loads an optimized model first and offers higher resolution on demand, releasing graphics resources when they are no longer needed.

The application initially downloads approximately **20 MB**, with additional content loaded progressively up to about **30 MB** as visitors explore.

## Understanding how visitors use the tour

The application includes anonymous usage analytics for interactions such as opening points of interest, using interface controls, and time spent in the experience. Heatmaps show which areas attract attention and how visitors divide their time between exploration and reading, without collecting personal data.

## Research and collaboration

We shared this work through a **short article and poster** at the [XVIII Technical Meeting on Conservation-Restoration](https://reuniotecnicacrac.com/en/), organized by Conservadors-Restauradors Associats de Catalunya (CRAC) at CaixaForum Barcelona on **19–20 November 2026**.

The contribution, *La digitalització com a eina de conservació i divulgació de jaciments arqueològics. El cas de Cova Bonica (Vallirana, Barcelona)*, was co-authored by **Laura Gómez-Morgado, Nadina Carla Cardillo Garreta, Montserrat Sanz, and Joan Daura**.

The wider project brings together the team's photogrammetric documentation, archaeological research, conservation work, audiovisual tour, and my contribution to the immersive web application.

The prototype uses some archaeological object models from **Cova del Rinoceront** as reference material for developing the interaction and optimization techniques. Planned additions include objects from Cova Bonica itself, new discoveries, and more languages.
