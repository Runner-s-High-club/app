// =============================================================================
// File    :  Label.tsx
// Class   :
// Purpose :  Label
// Date    :  2024.05
// Author  :  JHS
// History :
// =============================================================================
// Copyright (C) 2024 JHS All rights reserved.
// =============================================================================

import styled from '@emotion/native';
import React from 'react';
import {ILabel} from '@common/components/atoms/Label/interface/label.interface';

/**
 * label 컴포넌트
 * @property { string } text 라벨 텍스트
 * @property { object } style 라벨 스타일
 * @returns React.JSX.Element
 */
const Label = ({text, style}: ILabel) => {
  return (
    <View>
      <Text style={style}>{text}</Text>
    </View>
  );
};

export default Label;

const View = styled.View`
  align-items: center;
`;

const Text = styled.Text``;
