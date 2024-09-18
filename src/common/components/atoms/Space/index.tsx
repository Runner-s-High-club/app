// =============================================================================
// File    :  space.tsx
// Class   :
// Purpose :  space
// Date    :  2024.06
// Author  :  JHS
// History :
// =============================================================================
// Copyright (C) 2024 JHS All rights reserved.
// =============================================================================

import React, {useMemo} from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';

import {SpaceProps} from '@common/components/atoms/Space/interface/space.interface';

/**
 * 컴포넌트 사이에 마진 공백을 만들어주는 요소
 * @property { number } top margin top
 * @property { number } bottom margin bottom
 * @property { number } right margin right
 * @property { number } left margin left
 * @returns React.JSX.Element
 */
const Space = (props: SpaceProps) => {
  const {top, bottom, right, left} = props;

  const spaceStyle = useMemo(
    () => ({
      marginTop: top ? top + 'px' : 0,
      marginBottom: bottom ? bottom + 'px' : 0,
      marginRight: right ? right + 'px' : 0,
      marginLeft: left ? left + 'px' : 0,
    }),
    [top, bottom, right, left],
  ) as StyleProp<ViewStyle>;

  return <View style={spaceStyle} />;
};

export default Space;
