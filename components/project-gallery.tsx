import Image from "next/image";
import type { ProjectImage } from "@/lib/projects";

export function ProjectGallery({
  images,
  columns = 2,
}: {
  images: ProjectImage[];
  columns?: 2 | 3;
}) {
  return (
    <div className={`photo-gallery photo-gallery--${columns}`}>
      {images.map((image) => (
        <figure
          className={image.feature ? "photo-gallery__item photo-gallery__item--feature" : "photo-gallery__item"}
          key={image.src}
        >
          <div className={`project-photo ${image.feature ? "project-photo--feature" : "project-photo--standard"}`}>
            <Image
              src={image.src}
              alt={image.alt}
              fill
              loading="lazy"
              sizes={image.feature ? "(max-width: 800px) 100vw, 1240px" : "(max-width: 800px) 100vw, 600px"}
            />
          </div>
          {image.caption && <figcaption>{image.caption}</figcaption>}
        </figure>
      ))}
    </div>
  );
}
