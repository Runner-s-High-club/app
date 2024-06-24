// =============================================================================
// File    :  RunTracker.tsx
// Class   :
// Purpose :  RunTracker
// Date    :  2024.06
// Author  :  JHS
// History :
// =============================================================================
// Copyright (C) 2024 JHS All rights reserved.
// =============================================================================

import styled from '@emotion/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useDispatch} from 'react-redux';
import runSlice from '@feature/run/slice/run.slice';

interface IRunTracker {
  pathPosition: {
    latitude: number;
    longitude: number;
  }[];
  markerPosition: {
    latitude: number;
    longitude: number;
  };
  isRun: boolean;
  isPause: boolean;
}

/**
 * 달리기 현황 추적 컴포넌트
 * @property { boolean } isRun 달리기 시작 여부
 * @property { boolean } isPause 달리기 일시정지 여부
 * @returns React.JSX.Element
 */
const RunTracker = ({
  pathPosition,
  markerPosition,
  isRun,
  isPause,
}: IRunTracker) => {
  const dispatch = useDispatch();
  const [timer, setTimer] = useState(0);
  const paceRef = useRef('0:00');
  const runDataRef = useRef({
    timer: 0,
    kmText: '',
  });

  // 시간을 포맷팅하는 함수
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs}:${mins < 10 ? '0' : ''}${mins}:${
        secs < 10 ? '0' : ''
      }${secs}`;
    } else {
      return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
  };

  /** 시간 업데이트 */
  useEffect(() => {
    if (isRun && !isPause) {
      const updateTime = () => {
        runDataRef.current.timer = timer;
        setTimer(prevTime => prevTime + 1);
        re = setTimeout(updateTime, 1000);
      };
      let re = setTimeout(updateTime, 1000);
      return () => {
        dispatch(runSlice.actions.setDistanceRunningTime(formatTime(timer)));
        clearTimeout(re);
      };
    }
  }, [dispatch, isPause, isRun, timer]);

  // 두 지점 간의 거리를 계산하는 함수
  const calculateDistance = useCallback(
    (
      initialLatitude: number,
      initialLongitude: number,
      updatedLatitude: number,
      updatedLongitude: number,
    ): number => {
      // 각도를 라디안으로 변환하는 함수
      const degreesToRadians = (degrees: number): number => {
        return (degrees * Math.PI) / 180;
      };

      const EARTH_RADIUS_KM = 6371; // 지구의 반경 (킬로미터)

      // 두 위도 간의 차이를 라디안으로 변환
      const deltaLatitude = degreesToRadians(updatedLatitude - initialLatitude);
      // 두 경도 간의 차이를 라디안으로 변환
      const deltaLongitude = degreesToRadians(
        updatedLongitude - initialLongitude,
      );

      // 하버사인 공식의 a 값 계산
      const a =
        Math.sin(deltaLatitude / 2) * Math.sin(deltaLatitude / 2) +
        Math.cos(degreesToRadians(initialLatitude)) *
          Math.cos(degreesToRadians(updatedLatitude)) *
          Math.sin(deltaLongitude / 2) *
          Math.sin(deltaLongitude / 2);

      // 하버사인 공식의 c 값 계산
      const centralAngle = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      // 두 지점 간의 거리 계산
      const distance = EARTH_RADIUS_KM * centralAngle;

      return distance; // 킬로미터 단위의 거리 반환
    },
    [],
  );

  // 거리를 형식화하는 함수
  const formatDistance = useCallback((distanceInKm: number): string => {
    return `${distanceInKm.toFixed(2)}`;
  }, []);

  const [kmText, setKmText] = useState('0.00');

  /** km 미터 계산 호출 */
  useEffect(() => {
    if (isRun && !isPause) {
      const prevPosition = pathPosition[0];
      const km = calculateDistance(
        prevPosition.latitude,
        prevPosition.longitude,
        markerPosition.latitude,
        markerPosition.longitude,
      );
      /** 달린 거리 계산  */
      const convertKm = formatDistance(
        Math.round((km + Number.EPSILON) * 100) / 100,
      );
      setKmText(convertKm);
      runDataRef.current.kmText = convertKm;
      dispatch(runSlice.actions.setDistanceRun(convertKm));
    }
  }, [
    calculateDistance,
    dispatch,
    formatDistance,
    isPause,
    isRun,
    markerPosition,
    pathPosition,
  ]);

  /** 러닝 종료시 초기화 */
  useEffect(() => {
    return () => {
      if (!isRun) {
        setTimer(0);
        setKmText('0.00');
      }
    };
  }, [isRun]);

  /**
   * 현재 속도(시간당 이동 거리)를 기반으로 앞으로 1km를 달리는데 걸리는 시간을 계산하는 함수
   * @param distanceTraveledRatio - 현재까지 이동한 거리 (0에서 1 사이의 비율)
   * @param timeElapsedInSeconds - 현재까지 경과한 시간 (초 단위)
   * @returns 앞으로 1km를 달리는데 걸리는 시간 (분 단위)
   */
  const calculateTimeToRun1kmPace = (
    distanceTraveledRatio: number,
    timeElapsedInSeconds: number,
  ): string => {
    const timeElapsedInMinutes = timeElapsedInSeconds / 60; // 시간을 분 단위로 변환

    // 현재까지의 평균 페이스 계산 (분/km)
    const averagePaceInMinutes = timeElapsedInMinutes / distanceTraveledRatio;

    // 분과 초로 분리
    const minutes = Math.floor(averagePaceInMinutes);
    const seconds = Math.round((averagePaceInMinutes - minutes) * 60);

    // 두 자리 숫자로 포맷팅
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`; // mm:ss 형식으로 반환
  };

  /** 페이스 업데이트 */
  useEffect(() => {
    let intervalId: any;
    if (isRun && !isPause) {
      intervalId = setInterval(() => {
        const pace = calculateTimeToRun1kmPace(
          Number(runDataRef.current.kmText),
          runDataRef.current.timer,
        );
        dispatch(runSlice.actions.setDistanceRunningPace(pace));
        paceRef.current = pace;
      }, 2000);
      return () => {
        clearTimeout(intervalId);
      };
    } else {
      clearInterval(intervalId);
    }
  }, [dispatch, isPause, isRun]);

  return (
    <RunView>
      <Top>
        <KmTextView>
          <RunKmText>{kmText}</RunKmText>
          <RunKmTextUnit>Km</RunKmTextUnit>
        </KmTextView>
      </Top>
      <Mid>
        <RecordView>
          <RecordText>{formatTime(timer)}</RecordText>
          <RecordTextUnit>시간</RecordTextUnit>
        </RecordView>
        <RecordView>
          <RecordText>--</RecordText>
          <RecordTextUnit>BPM</RecordTextUnit>
        </RecordView>
        <RecordView>
          <RecordText>{paceRef.current}</RecordText>
          <RecordTextUnit>페이스</RecordTextUnit>
        </RecordView>
      </Mid>
    </RunView>
  );
};

export default RunTracker;

const RunView = styled.View`
  position: relative;
  background-color: ${({theme}) => theme.colors.bg_gray000};
  width: 100%;
  height: 100%;
`;

const Top = styled.View`
  flex: 1;
  flex-direction: row;
`;

const KmTextView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const RunKmText = styled.Text`
  font-weight: bold;
  font-size: 50px;
`;
const RunKmTextUnit = styled.Text`
  font-weight: bold;
  font-size: 24px;
`;

const Mid = styled.View`
  flex: 1.5;
  align-items: end;
  flex-direction: row;
`;

const RecordView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  margin-top: 10%;
`;

const RecordText = styled.Text`
  font-weight: 400;
  font-size: 30px;
`;

const RecordTextUnit = styled.Text`
  font-weight: 300;
  font-size: 18px;
`;
