import styled from '@emotion/styled/macro';
import { useEffect, useState } from 'react';
import { fetchPictures } from './services/fetchAPI';
import { scrollTo } from './services/scrollTo';
import { Searchbar } from './components/Searchbar/Searchbar';
import { ImageGallery } from './components/ImageGallery/ImageGallery';
import { Button } from './components/Button/Button';
import { Modal } from './components/Modal/Modal';
import { Loader } from './components/Loader/Loader';

const STATUS = {
  idle: 'idle',
  pending: 'pending',
  resolved: 'resolved',
  rejected: 'rejected',
};

const ErrorMsg = styled.div`
  text-align: center;
  color: red;
  font-size: 34px;
`;

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 16px;
  padding-bottom: 24px;
`;

export default function App() {
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState(STATUS.idle);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [currImg, setCurrImg] = useState(null);

  useEffect(() => {
    if (query !== '') {
      setPage(1);
      setStatus(STATUS.pending);

      fetchPictures(query, page)
        .then(res => {
          if (res.hits.length === 0) {
            throw new Error('Упс, по даному запиту нічого не знайдено...');
          }

          setImages(res.hits);
          setStatus(STATUS.resolved);
        })
        .catch(() => {
          setImages([]);
          setPage(1);
          setCurrImg(null);
          setStatus(STATUS.rejected);
        });
    }
  }, [query]);

  useEffect(() => {
    if (page !== 1) {
      setStatus(STATUS.pending);

      fetchPictures(query, page)
        .then(res => {
          setImages(prev => [...prev, ...res.hits]);
          setStatus(STATUS.resolved);
        })
        .then(scrollTo)
        .catch(() => setStatus(STATUS.resolved));
    }
  }, [page]);

  const handleLoadMore = () => {
    setPage(p => p + 1);
  };

  const closeModal = () => {
    setCurrImg(null);
  };

  const handleModalMouseClick = e => {
    if (e.target.nodeName !== 'IMG') {
      closeModal();
    }
  };

  const handleModalEscClick = e => {
    if (e.code === 'Escape') {
      closeModal();
    }
  };

  const shouldShowBtn =
    status !== STATUS.rejected && query !== '' && images.length >= 12;

  return (
    <Wrapper>
      <Searchbar onSubmit={setQuery} />
      {status === STATUS.rejected ? (
        <ErrorMsg>
          <h2>По даному запиту нічого не знайдено</h2>
        </ErrorMsg>
      ) : (
        <ImageGallery images={images} onClick={setCurrImg} />
      )}
      {status === STATUS.pending ? (
        <Loader />
      ) : (
        shouldShowBtn && (
          <Button type="button" text="Load More" onClick={handleLoadMore} />
        )
      )}
      {currImg && (
        <Modal
          currImg={currImg}
          onClick={handleModalMouseClick}
          onKeyDown={handleModalEscClick}
        />
      )}
    </Wrapper>
  );
}
