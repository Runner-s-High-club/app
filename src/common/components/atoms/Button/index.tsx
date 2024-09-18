// =============================================================================
// File    :  ButtonCommon.tsx
// Class   :
// Purpose :  ButtonCommon
// Date    :  2024.06
// Author  :  JHS
// History :  2024.09 수정
// =============================================================================
// Copyright (C) 2024 JHS All rights reserved.
// =============================================================================

import React from 'react';

import {IButton} from '@common/components/atoms/Button/interface/button.interface';
import {Pressable} from '@common/components/atoms/Button/style/button.style';

/**
 * 기본 버튼 컴포넌트
 * @property { number } size % 단위
 * @property { string } buttonColor 버튼 컬러 기본 컬러 = #5dadd9
 * @property { React.ReactNode } children
 * @returns React.JSX.Element
 */
const Button = ({
  children,
  size = 100,
  buttonColor = '#5dadd9',
  ...rest
}: IButton) => {
  return (
    <Pressable {...rest} $size={size} $buttonColor={buttonColor}>
      {children}
    </Pressable>
  );
};

export default Button;
