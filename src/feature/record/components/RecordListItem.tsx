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

import React from 'react';
import styled from '@emotion/native';
import {ViewToken} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import Animated, {useAnimatedStyle, withTiming} from 'react-native-reanimated';

import {IRunRecord} from '@api/run/interface/run.interface';
import {RootTabParamList} from '@navigation/TabNavigation';
import {colors} from '@common/styles/theme';
import {Button, SvgIcon} from '@common/components/atoms';

interface IRecordListItem {
  viewItems: Animated.SharedValue<ViewToken[]>;
  item: IRunRecord;
  lastIndex: number;
}

type RecordScreenProps = StackScreenProps<
  RootTabParamList['recordStack'],
  'recordDetail'
>;

/**
 *  기록 목록 아이템
 * @property { Animated.SharedValue<ViewToken[]> } viewItems onViewableItemsChanged  viewItems 데이터
 * @property { item } item 랜더링 되는 viewItem 데이터
 * @returns React.JSX.Element
 */
const RecordListItem = ({viewItems, item, lastIndex}: IRecordListItem) => {
  const navigation = useNavigation<RecordScreenProps['navigation']>();

  const animateViewStyle = useAnimatedStyle(() => {
    /** 현재 랜더링된 리스트 목록 */
    const currentItem = viewItems.value.map(filetItem => filetItem.index);
    /** 리스트 표시 여부 */
    const isVisible = currentItem.some(
      findItem => findItem === item.id || lastIndex === item.id,
    );
    return {
      opacity: withTiming(isVisible ? 1 : 0.6),
      transform: [
        {
          scale: withTiming(isVisible ? 1 : 0.9),
        },
      ],
    };
  }, []);

  /** 라우트 핸들러 */
  const routeHandler = () => {
    navigation.navigate('recordDetail', item);
  };

  return (
    <AnimateListItem style={animateViewStyle}>
      <TopView>
        <TitleView>
          <Date>{item.date}</Date>
          <Title>{item.runningTitle}</Title>
        </TitleView>
        <IconView>
          <ArrowButton buttonColor={colors.bg_gray000} onPress={routeHandler}>
            <SvgIcon name="arrow" size={24} />
          </ArrowButton>
        </IconView>
      </TopView>
      <MidView>
        <RecodeBox>
          <RecordText>{item.totalKm}</RecordText>
          <RecordTextUnit>Km</RecordTextUnit>
        </RecodeBox>
        <RecodeBox>
          <RecordText>{item.totalAveragePace}</RecordText>
          <RecordTextUnit>평균페이스</RecordTextUnit>
        </RecodeBox>
        <RecodeBox>
          <RecordText>{item.runningTime}</RecordText>
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
  background-color: ${({theme}) => theme.colors.bg_gray000};
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
  color: ${({theme}) => theme.colors.text_333};
  font-weight: bold;
  font-size: 14px;
`;

const Title = styled.Text`
  color: ${({theme}) => theme.colors.text_333};
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
  color: ${({theme}) => theme.colors.text_333};
`;

const RecordTextUnit = styled.Text`
  font-weight: 300;
  font-size: 14px;
  color: ${({theme}) => theme.colors.text_333};
  margin-top: 2px;
`;

const ArrowButton = styled(Button)`
  height: 30px;
  position: absolute;
  top: -2px;
  right: 0;
`;
