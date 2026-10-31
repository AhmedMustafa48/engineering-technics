// Hero photographs (public/images/static). Each page picks one by key.
const base = "/images/static";

const photos = {
  wide: { src: `${base}/substation-sunset-wide.webp`, position: "50% 55%" },
  yard: { src: `${base}/transformer-sunset-yard.webp`, position: "50% 50%" },
  bushings: { src: `${base}/hv-bushings-sunset.webp`, position: "50% 45%" },
  insulators: { src: `${base}/switchyard-insulators-dusk.webp`, position: "50% 45%" },
  engineer: { src: `${base}/engineer-substation-dusk.webp`, position: "50% 35%" },
};

export const heroImages = {
  home: photos.bushings,
  about: photos.engineer,
  products: photos.yard,
  suppliers: photos.insulators,
  catalogue: photos.bushings,
  contact: photos.yard,
};


// Home hero slideshow, in play order.
export const heroSlides = [photos.bushings, photos.wide, photos.yard, photos.insulators, photos.engineer];
