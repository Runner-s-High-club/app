// =============================================================================
// File    :  ButtonCommon.tsx
// Class   :
// Purpose :  ButtonCommon
// Date    :  2024.06
// Author  :  JHS
// History :
// =============================================================================
// Copyright (C) 2024 JHS All rights reserved.
// =============================================================================

import React from 'react';
import styled from '@emotion/native';
import {PressableProps} from 'react-native';

interface IButtonCommon extends PressableProps {
  children: React.ReactNode;
  size?: number;
  buttonColor?: string;
}

/**
 * 기본 버튼 컴포넌트
 * @property { number } size % 단위
 * @property { string } buttonColor 버튼 컬러 기본 컬러 = #5dadd9
 * @property { React.ReactNode } children
 * @returns React.JSX.Element
 */
const ButtonCommon = ({
  children,
  size = 100,
  buttonColor = '#5dadd9',
  ...rest
}: IButtonCommon) => {
  return (
    <Button {...rest} $size={size} $buttonColor={buttonColor}>
      {children}
    </Button>
  );
};

export default ButtonCommon;

const Button = styled.Pressable<{$size: number; $buttonColor: string}>`
  width: ${props => props.$size}%;
  height: 50px;
  background-color: ${props => props.$buttonColor};
  border-radius: 10px;
  align-items: center;
  justify-content: center;
`;
