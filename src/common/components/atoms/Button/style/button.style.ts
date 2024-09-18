import styled from '@emotion/native';

export const Pressable = styled.Pressable<{
  $size: number;
  $buttonColor: string;
}>`
  width: ${props => props.$size}%;
  height: 50px;
  background-color: ${props => props.$buttonColor};
  border-radius: 10px;
  align-items: center;
  justify-content: center;
`;
