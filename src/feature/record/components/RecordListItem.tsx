// =============================================================================
// File    :  RecordListItem.tsx
// Class   :
// Purpose :  RecordListItem
// Date    :  2024.06
// Author  :  JHS
// History :
// =============================================================================
// Copyright (C) 2024 JHS All rights reserved.
// =============================================================================

import ButtonCommon from '@common/components/button/ButtonCommon';
import SvgIcon from '@common/components/icon/SvgIcon';
import styled from '@emotion/native';
import React from 'react';
import {ViewToken} from 'react-native';
import Animated, {useAnimatedStyle, withTiming} from 'react-native-reanimated';

interface IRecordListItem {
  viewItems: Animated.SharedValue<ViewToken[]>;
  item: {id: number};
}

/**
 *  기록 목록 아이템
 * @property { Animated.SharedValue<ViewToken[]> } viewItems onViewableItemsChanged  viewItems 데이터
 * @property { item } item 랜더링 되는 viewItem 데이터
 * @returns React.JSX.Element
 */
const RecordListItem = ({viewItems, item}: IRecordListItem) => {
  const animateViewStyle = useAnimatedStyle(() => {
    /** 현재 랜더링된 리스트 목록 */
    const currentItem = viewItems.value.map(filetItem => filetItem.index);
    /** 리스트 표시 여부 */
    const isVisible = currentItem.some(findItem => findItem === item.id);
    return {
      opacity: withTiming(isVisible ? 1 : 0),
      transform: [
        {
          scale: withTiming(isVisible ? 1 : 0.6),
        },
      ],
    };
  }, []);

  return (
    <AnimateListItem style={animateViewStyle}>
      <TopView>
        <TitleView>
          <Date>2024.06.06</Date>
          <Title>토요일 러닝</Title>
        </TitleView>
        <IconView>
          <ArrowButton buttonColor="#fff">
            <SvgIcon name="arrow" size={24} />
          </ArrowButton>
        </IconView>
      </TopView>
      <MidView>
        <RecodeBox>
          <RecordText>0.23</RecordText>
          <RecordTextUnit>Km</RecordTextUnit>
        </RecodeBox>
        <RecodeBox>
          <RecordText>0.23</RecordText>
          <RecordTextUnit>평균페이스</RecordTextUnit>
        </RecodeBox>
        <RecodeBox>
          <RecordText>0.23</RecordText>
          <RecordTextUnit>시간</RecordTextUnit>
        </RecodeBox>
      </MidView>
    </AnimateListItem>
  );
};

export default React.memo(RecordListItem);

const FlatListItem = styled.View`
  width: 90%;
  height: 120px;
  background-color: #fff;
  margin-top: 20px;
  border-radius: 10px;
  align-self: center;
  justify-content: center;
  padding: 0px 10px;
  position: relative;
`;

const AnimateListItem = Animated.createAnimatedComponent(FlatListItem);

const TopView = styled.View`
  width: 100%;
  margin-bottom: 10px;
  flex-direction: row;
`;

const TitleView = styled.View``;

const Date = styled.Text`
  color: #333;
  font-weight: bold;
  font-size: 14px;
`;

const Title = styled.Text`
  color: #333;
  font-weight: 300;
  font-size: 14px;
  margin-top: 2px;
`;

const IconView = styled.View`
  margin-left: auto;
  justify-content: center;
`;

const MidView = styled.View`
  width: 80%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const RecodeBox = styled.View``;

const RecordText = styled.Text`
  font-weight: bold;
  font-size: 16px;
  color: #333;
`;

const RecordTextUnit = styled.Text`
  font-weight: 300;
  font-size: 14px;
  color: #333;
  margin-top: 2px;
`;

const ArrowButton = styled(ButtonCommon)`
  height: 30px;
  position: absolute;
  top: -2px;
  right: 0;
`;
