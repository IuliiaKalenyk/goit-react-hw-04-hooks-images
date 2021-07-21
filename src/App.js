import styled from '@emotion/styled/macro';
import { Component } from 'react';
import { fetchPictures } from './services/fetchAPI';
import { scrollTo } from './services/scrollTo';
import { Searchbar } from './components/Searchbar/Searchbar';
import { ImageGallery } from './components/ImageGallery/ImageGallery';
import { Button } from './components/Button/Button';
import { Modal } from './components/Modal/Modal';
import { Loader } from './components/Loader/Loader';

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

class App extends Component {
  state = {
    images: [],
    status: 'idle',
    query: '',
    page: 1,
    currImg: null,
  };

  componentDidUpdate(prevProps, prevState) {
    const { query, page } = this.state;

    if (prevState.query !== query) {
      this.setState({ page: 1, status: 'pending' });

      fetchPictures(query, page)
        .then(res => {
          if (res.hits.length === 0) {
            throw new Error('По данному запросу ничего не найдено');
          }
          this.setState({ images: res.hits, status: 'resolved' });
        })
        .catch(() => [
          this.setState({
            status: 'rejected',
            page: 1,
            images: [],
            currImg: null,
          }),
        ]);
    }

    if (prevState.page !== page) {
      this.setState({ status: 'pending' });

      fetchPictures(query, page)
        .then(res =>
          this.setState(prev => ({
            images: [...prev.images, ...res.hits],
            status: 'resolved',
          })),
        )
        .then(scrollTo)
        .catch(() => this.setState({ status: 'rejected' }));
    }
  }

  handleGalleryItemClick = currImg => {
    this.setState({ currImg });
  };

  handleSubmit = query => {
    this.setState({ query });
  };

  handleLoadMore = () => {
    this.setState(prevProps => ({ page: prevProps.page + 1 }));
  };

  closeModal = () => {
    this.setState({ currImg: null });
  };

  handleModalMouseClick = e => {
    if (e.target.nodeName !== 'IMG') {
      this.closeModal();
    }
  };

  handleModalEscClick = e => {
    if (e.code === 'Escape') {
      this.closeModal();
    }
  };

  render() {
    const { query, status, images, currImg } = this.state;
    const shouldShowBtn =
      status !== 'rejected' && query !== '' && images.length >= 12;

    return (
      <Wrapper>
        <Searchbar onSubmit={this.handleSubmit} />
        {status === 'rejected' ? (
          <ErrorMsg>
            <h2>По данному запросу ничего не найдено</h2>
          </ErrorMsg>
        ) : (
          <ImageGallery
            images={this.state.images}
            onClick={this.handleGalleryItemClick}
          />
        )}
        {status === 'pending' ? (
          <Loader />
        ) : (
          shouldShowBtn && (
            <Button
              type="button"
              text="Load More"
              onClick={this.handleLoadMore}
            />
          )
        )}
        {currImg && (
          <Modal
            currImg={currImg}
            onClick={this.handleModalMouseClick}
            onKeyDown={this.handleModalEscClick}
          />
        )}
      </Wrapper>
    );
  }
}

export default App;
