/**
 * Photography. These are free-licence Unsplash images (the same ones the current site uses).
 * Before launch, replace them with MKY's own photos of real shipments, the office and the team:
 * put files in /public/media and change `src` to e.g. "/media/hero.jpg".
 */
const u = (id: string, w = 2000) => `https://images.unsplash.com/${id}?auto=format&fit=crop&q=75&w=${w}`;

export const media = {
  hero: { src: u("photo-1578575437130-527eed3abbec", 2400), alt: "Container ship at sea, seen from above" },
  air: { src: u("photo-1635690926948-06e5d7af93bb", 1200), alt: "Air cargo operations" },
  ocean: { src: u("photo-1700777685830-f501e67260e6", 1200), alt: "Stacked shipping containers at a port" },
  road: { src: u("photo-1617952739760-1dcae19a1d93", 1200), alt: "Freight truck on the road" },
  customs: { src: u("photo-1713859272766-76751031af78", 1200), alt: "Cargo documents and logistics" },
  cta: { src: u("photo-1635851801927-44c4d1c555af", 2000), alt: "Port cranes and containers" },
} as const;

export type MediaKey = keyof typeof media;
