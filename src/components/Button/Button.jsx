import { Btn } from './Button.styled';

export const Button = ({ type, text, onClick }) => (
  <Btn onClick={onClick} type={type}>
    {text}
  </Btn>
);
