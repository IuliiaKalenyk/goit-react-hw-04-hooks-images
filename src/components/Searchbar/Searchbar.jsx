import { Container, Form, Input, SearchButton } from './Searchbar.styled';

export const Searchbar = ({ onSubmit }) => {
  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(e.target.elements.query.value);
  }
  return (
    <Container>
      <Form onSubmit={handleSubmit} autoComplete="off">
        <Input
          type="text"
          name="query"
          autoFocus
          placeholder="Search images and photos"
        />{' '}
        <SearchButton type="submit" />
      </Form>
    </Container>
  );
};
