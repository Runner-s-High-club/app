// =============================================================================
// File    :  SvgIcon.tsx
// Class   :
// Purpose :  SvgIcon
// Date    :  2024.05
// Author  :  JHS
// History :
// =============================================================================
// Copyright (C) 2024 JHS All rights reserved.
// =============================================================================

import React from 'react';

import * as Icons from '@common/constants/icons';
import {IconProps} from '@common/components/atoms/SvgIcon/interface/svgIcon.interface';

/**
 *  svg 아이콘 컴포넌트
 * @property { string } name 아이콘 이름
 * @property { number } size 아이콘 사이즈
 * @property { SvgProps } SvgProps svg 공통 옵션
 * @returns React.JSX.Element
 */
const SvgIcon = ({name, size, ...props}: IconProps) => {
  const Comp = Icons[name];

  const sizeProps = {
    width: size,
    height: size,
  };

  return <Comp {...props} {...sizeProps} />;
};

export default SvgIcon;
