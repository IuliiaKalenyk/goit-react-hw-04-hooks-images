import { Component } from 'react';
import { ContentContainer, Backdrop } from './Modal.styled';

export class Modal extends Component {
  componentDidMount() {
    window.addEventListener('keydown', this.props.onKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.props.onKeyDown);
  }
  render() {
    const { largeImageURL, tags } = this.props.currImg;
    return (
      <Backdrop onClick={this.props.onClick}>
        <ContentContainer>
          <img src={largeImageURL} alt={tags} />
        </ContentContainer>
      </Backdrop>
    );
  }
}
