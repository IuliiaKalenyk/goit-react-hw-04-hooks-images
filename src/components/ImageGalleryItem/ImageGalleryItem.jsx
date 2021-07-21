import { GalleryItem } from './ImageGalleryItem.styled';

export const ImageGalleryItem = ({
  webformatURL = 'https://pixabay.com/en/blossom-bloom-flower-195893/',
  tags = 'Awesome picture',
  onClick,
  img,
}) => {
  return (
    <GalleryItem onClick={() => onClick(img)}>
      <img src={webformatURL} alt={tags} />
    </GalleryItem>
  );
};
