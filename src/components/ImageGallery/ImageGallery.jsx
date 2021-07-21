import { Gallery } from './ImageGallery.styled';
import { ImageGalleryItem } from '../ImageGalleryItem/ImageGalleryItem';

export const ImageGallery = ({ images, onClick }) => (
  <Gallery>
    {images.map(img => (
      <ImageGalleryItem
        key={img.id}
        webformatURL={img.webformatURL}
        tags={img.tags}
        onClick={onClick}
        img={img}
      />
    ))}
  </Gallery>
);
