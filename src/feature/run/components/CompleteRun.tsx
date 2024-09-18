// =============================================================================
// File    :  CompleteRun.tsx
// Class   :
// Purpose :  CompleteRun
// Date    :  2024.06
// Author  :  JHS
// History :
// =============================================================================
// Copyright (C) 2024 JHS All rights reserved.
// =============================================================================

import React, {useMemo} from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {useSelector} from 'react-redux';
import styled from '@emotion/native';

import NaverMapView, {Marker, Path} from 'react-native-nmap';
import {RootState} from '@redux/store/store';
import {Button} from '@common/components/atoms';

interface ICompleteRun {
  pathPosition: {
    latitude: number;
    longitude: number;
  }[];
  markerPosition: {
    latitude: number;
    longitude: number;
  };
  runCompleteController: () => void;
}

/**
 * 달리기 완료 컴포넌트
 * @property { string } propsName 설명
 * @returns React.JSX.Element
 */
const CompleteRun = ({pathPosition, runCompleteController}: ICompleteRun) => {
  const distanceRun = useSelector((state: RootState) => state.run.distanceRun);
  const distanceRunningTime = useSelector(
    (state: RootState) => state.run.distanceRunningTime,
  );
  /** 달리기 페이스 */
  const distanceRunningPace = useSelector(
    (state: RootState) => state.run.distanceRunningPace,
  );
  /** 네이버 맵뷰 스타일 */
  const naverMapViewStyle = useMemo(() => {
    return {
      width: '100%',
      height: '100%',
    } as StyleProp<ViewStyle>;
  }, []);

  return (
    <Wrapper>
      <TitleView>
        <TitleDate>2024. 06. 21</TitleDate>
        <Title>러닝</Title>
      </TitleView>
      <KmWrapper>
        <KmBox>
          <KmText>{distanceRun}</KmText>
          <KmTextUnit>Km</KmTextUnit>
        </KmBox>
      </KmWrapper>
      <RecodeView>
        <RecodeBox>
          <RecordView>
            <RecordText>{distanceRunningTime}</RecordText>
            <RecordTextUnit>시간</RecordTextUnit>
          </RecordView>
          <RecordView>
            <RecordText>--</RecordText>
            <RecordTextUnit>BPM</RecordTextUnit>
          </RecordView>
          <RecordView>
            <RecordText>{distanceRunningPace}</RecordText>
            <RecordTextUnit>페이스</RecordTextUnit>
          </RecordView>
        </RecodeBox>
        <RecodeBox>
          <RecordView>
            <RecordText>0 m</RecordText>
            <RecordTextUnit>고도상승</RecordTextUnit>
          </RecordView>
          <RecordView>
            <RecordText>--</RecordText>
            <RecordTextUnit>평균 심박수</RecordTextUnit>
          </RecordView>
          <RecordView>
            <RecordText>148</RecordText>
            <RecordTextUnit>케이던스</RecordTextUnit>
          </RecordView>
        </RecodeBox>
      </RecodeView>
      <LayerView>
        <NaverMapView
          style={naverMapViewStyle}
          zoomControl={false}
          center={{
            zoom: 14.7,
            // 지도 기울기
            tilt: 0,
            latitude:
              (pathPosition[pathPosition.length - 1].latitude +
                pathPosition[pathPosition.length - 1].latitude) /
              2,
            longitude:
              (pathPosition[pathPosition.length - 1].longitude +
                pathPosition[pathPosition.length - 1].longitude) /
              2,
          }}>
          {/* 시작점 */}
          <Marker
            coordinate={{
              latitude: pathPosition[0].latitude,
              longitude: pathPosition[0].longitude,
            }}
            width={1}
            height={1}
            pinColor="transparent"
            anchor={{x: 0.5, y: 0.5}}
          />
          <Path
            width={10}
            color={'#40C576'}
            outlineWidth={0}
            coordinates={pathPosition}
          />
          {/* <Marker
            coordinate={{
              latitude: markerPosition.latitude,
              longitude: markerPosition.longitude,
            }}
            width={12}
            height={12}
            pinColor={'green'}
            image={require('../../../assets/pngIcon/blue-dot.png')}
          /> */}
        </NaverMapView>
      </LayerView>
      <BottomButtonView>
        <Button onPress={runCompleteController}>
          <ButtonLabel>완료</ButtonLabel>
        </Button>
      </BottomButtonView>
    </Wrapper>
  );
};

export default CompleteRun;

const Wrapper = styled.ScrollView`
  position: absolute;
  z-index: 1000;
  background-color: ${({theme}) => theme.colors.bg_gray000};
  width: 100%;
  height: 100%;
  padding: 20px;
`;

const TitleView = styled.View`
  border-bottom-width: 1px;
  border-color: ${({theme}) => theme.colors.bg_gray250};
  padding-bottom: 10px;
`;

const TitleDate = styled.Text`
  font-weight: 400;
  font-size: 16px;
  color: ${({theme}) => theme.colors.text_333};
  opacity: 0.6;
`;
const Title = styled.Text`
  font-weight: 600;
  font-size: 22px;
  color: ${({theme}) => theme.colors.text_333};
  margin-top: 10px;
`;

const LayerView = styled.View`
  width: 100%;
  height: 250px;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  overflow: hidden;
  margin-top: 10%;
  margin-bottom: 10%;
`;

const KmWrapper = styled.View`
  width: 100%;
  height: 16%;
  align-items: center;
  justify-content: center;
`;

const KmBox = styled.View`
  flex-direction: row;
`;

const KmText = styled.Text`
  color: ${({theme}) => theme.colors.text_333};
  font-size: 60px;
  font-weight: bold;
`;

const KmTextUnit = styled.Text`
  color: ${({theme}) => theme.colors.text_333};
  margin-top: auto;
  margin-bottom: 2%;
  margin-left: 10px;
`;

const RecodeView = styled.View`
  align-items: end;
  height: 160px;
`;

const RecordView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const RecordText = styled.Text`
  font-weight: 400;
  font-size: 30px;
`;

const RecordTextUnit = styled.Text`
  font-weight: 300;
  font-size: 18px;
`;

const RecodeBox = styled.View`
  flex: 1;
  flex-direction: row;
`;

const BottomButtonView = styled.View`
  height: 200px;
`;

const ButtonLabel = styled.Text`
  color: ${({theme}) => theme.colors.bg_gray000};
  font-weight: bold;
  font-size: 16px;
`;
