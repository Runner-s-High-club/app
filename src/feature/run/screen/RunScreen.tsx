// =============================================================================
// File    :  RunScreen.tsx
// Class   :
// Purpose :  RunScreen
// Date    :  2024.05
// Author  :  JHS
// History :
// =============================================================================
// Copyright (C) 2024 JHS All rights reserved.
// =============================================================================

import React, {useEffect, useMemo, useRef, useState} from 'react';
import styled from '@emotion/native';
import NaverMapView, {Marker} from 'react-native-nmap';
import Geolocation from '@react-native-community/geolocation';
import {
  AppState,
  AppStateStatus,
  Keyboard,
  NativeSyntheticEvent,
  StyleProp,
  TextInputChangeEventData,
  ViewStyle,
} from 'react-native';
import {BottomSheetModal} from '@gorhom/bottom-sheet';

import services from '@common/constants/services';
import useDevicePermissions, {TPermission} from '@hooks/useDevicePermissions';
import EditKmItem from '@feature/run/components/EditKmItem';
import RunButtonGroup from '@feature/run/components/RunButtonGroup';
import PrepareRun from '@feature/run/components/PrepareRun';
import RunTracker from '@feature/run/components/RunTracker';
import {useDispatch} from 'react-redux';
import navigationSlice from '@navigation/slice/navigation.slice';
import CompleteRun from '@feature/run/components/CompleteRun';
import {colors} from '@common/styles/theme';
import commonSlice from '@common/slice/common.slice';
import {Bottomsheet} from '@/common/components/atoms';

/**
 * 달리기 측정 화면
 * @returns React.JSX.Element
 */
const RunScreen = () => {
  const dispatch = useDispatch();
  /** 디바이스 권한 훅스 */
  const permissions = useDevicePermissions();

  /** 로케이션 권한 상수  */
  const location = services.storage.permission.location as TPermission;

  /** 바텀시트 ref */
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  /** 달리기 시작 여부 */
  const [isRun, setIsRun] = useState(false);

  /** 목표 km 상태 */
  const [kmText, setKmText] = useState('3.00');

  /** 앱 백그라운드 상태 감지 */
  const [appState, setAppState] = useState(AppState.currentState);

  /** 달리기 완료 기록 컴포넌트 표시 여부 */
  const [isShowCompleted, setIsShowCompleted] = useState(false);

  /** 현재 위치 상태 */
  const [markerPosition, setMarkerPosition] = useState<{
    latitude: number;
    longitude: number;
  }>({
    latitude: 0,
    longitude: 0,
  });

  /** 현재 위치 상태 */
  const [pathPosition, setPathPosition] = useState<
    {
      latitude: number;
      longitude: number;
    }[]
  >([
    {
      latitude: 0,
      longitude: 0,
    },
    {
      latitude: 0,
      longitude: 0,
    },
  ]);

  /** 위치 권한 여부 */
  const [isPermissionsState, setIsPermissionsState] = useState(false);

  /** 일시정지 상태 */
  const [isPause, setIsPause] = useState(false);

  /** 준비 단계 표시 여부 */
  const [isPrepareRun, setIsPrepareRun] = useState(false);

  /** 준비 단계 카운터 */
  const [runCount, setRunCount] = useState(3);

  /** 네이버 맵뷰 스타일 */
  const naverMapViewStyle = useMemo(() => {
    return {
      width: '100%',
      height: '100%',
    } as StyleProp<ViewStyle>;
  }, []);

  /** 달리기 시작 핸들러 */
  const startRunHandler = () => {
    if (isRun) {
      setIsRun(() => {
        return false;
      });
      setIsPause(() => {
        return false;
      });
      setIsShowCompleted(() => {
        return true;
      });
    } else {
      prepareRun();
    }
  };

  /** 셋팅 바텀시트 호출 핸들러 */
  const settingHandler = () => {
    bottomSheetModalRef.current?.present();
  };

  /** 목표 km 온체인지 이벤트 */
  const onChangeKm = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    setKmText(e.nativeEvent.text);
  };

  /** 바텀 시트 닫기 이벤트 */
  const closeBottomsheet = () => {
    bottomSheetModalRef.current?.close();
    Keyboard.dismiss();
  };

  /** 로케이션 권한 검사 이펙트 */
  useEffect(() => {
    if (!isPermissionsState) {
      (async () => {
        const isPermissions = await permissions.getDevicePermission(
          location,
          '러닝 측정을 위해선 권한 허용이 필요합니다.',
        );
        setIsPermissionsState(isPermissions as boolean);
      })();
    }
  }, [isPermissionsState, location, permissions]);

  // TODO: 1초에 한번씩 호출 해주어 셋팅하면됨
  /** 현재 디바이스 위치 호출 */
  useEffect(() => {
    if (isPermissionsState) {
      Geolocation.getCurrentPosition(
        info => {
          setMarkerPosition({
            latitude: info.coords.latitude,
            longitude: info.coords.longitude,
          });
          setPathPosition(() => {
            return [
              {
                latitude: info.coords.latitude,
                longitude: info.coords.longitude,
              },
            ];
          });
        },
        console.error,
        {
          enableHighAccuracy: true,
          timeout: 20000,
        },
      );
    }
  }, [isPermissionsState, isShowCompleted]);

  /** 백그라운드 에서 다시 앱으로 돌아왔을 시 실행 */
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        if (!isPermissionsState) {
          (async () => {
            const isPermissions = await permissions.getDevicePermission(
              location,
              '러닝 측정을 위해선 권한 허용이 필요합니다.',
            );
            setIsPermissionsState(isPermissions as boolean);
          })();
        }
      }
      setAppState(nextAppState);
    };
    AppState.addEventListener('change', handleAppStateChange);
  }, [appState, isPermissionsState, location, permissions]);

  /** 임시 주행 데이터 */
  useEffect(() => {
    if (isRun && !isPause) {
      const updatePosition = () => {
        setMarkerPosition(prev => ({
          ...prev,
          latitude: prev.latitude + 0.00005,
          longitude: prev.longitude + 0.000001,
        }));
        setPathPosition(prev => {
          return [
            ...prev,
            {
              latitude: prev[prev.length - 1].latitude + 0.00005,
              longitude: prev[prev.length - 1].longitude + 0.000001,
            },
          ];
        });

        re = setTimeout(updatePosition, 1000);
      };
      let re = setTimeout(updatePosition, 1000);
      return () => {
        clearTimeout(re);
      };
    }
  }, [isPause, isRun]);

  /** 달리기 준비 단계  */
  const prepareRun = () => {
    dispatch(commonSlice.actions.setSafeAreaViewBg(colors.warning));
    setIsPrepareRun(true);
  };

  /** 달리기 준비 단계 */
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!isRun && isPrepareRun && runCount > 0) {
      interval = setInterval(() => {
        setRunCount(prevCount => prevCount - 1);
      }, 1000);
    } else if (runCount === 0) {
      setTimeout(() => {
        dispatch(commonSlice.actions.setSafeAreaViewBg(colors.bg_gray000));
        setRunCount(3);
        setIsPrepareRun(false);
        setIsRun(prev => !prev);
      }, 650);
    }

    return () => clearInterval(interval);
  }, [dispatch, isPrepareRun, isRun, runCount]);

  /** 일시정지 핸들러 */
  const pauseHandler = () => {
    setIsPause(prev => !prev);
  };

  /** 달리기 완료 컴포넌트 컨트롤러 */
  const runCompleteController = () => {
    setIsShowCompleted(() => {
      return false;
    });
    /** 러닝 종료시 거리 초기화 */
    setMarkerPosition({
      latitude: 0,
      longitude: 0,
    });
    setPathPosition([
      {
        latitude: 0,
        longitude: 0,
      },
    ]);
    dispatch(navigationSlice.actions.setIsTabShowStatus(true));
  };

  return (
    <>
      {isPrepareRun && <PrepareRun runCount={runCount} />}
      <View>
        {isRun ? (
          <RunTracker
            isPause={isPause}
            isRun={isRun}
            pathPosition={pathPosition}
            markerPosition={markerPosition}
          />
        ) : (
          <>
            <TitleView>
              <TitleText>러닝</TitleText>
            </TitleView>
            <KmWrapper>
              <KmBox>
                <KmText>{kmText}</KmText>
                <KmTextUnit>Km</KmTextUnit>
              </KmBox>
            </KmWrapper>
            <LayerView>
              <CircleView>
                <NaverMapView
                  style={naverMapViewStyle}
                  zoomControl={false}
                  center={{
                    zoom: 15.7,
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
                  <Marker
                    coordinate={{
                      latitude: markerPosition.latitude,
                      longitude: markerPosition.longitude,
                    }}
                    width={12}
                    height={12}
                    pinColor={'green'}
                    image={require('../../../assets/pngIcon/blue-dot.png')}
                  />
                </NaverMapView>
              </CircleView>
            </LayerView>
          </>
        )}
        <RunButtonGroup
          isPause={isPause}
          isRun={isRun}
          settingHandler={settingHandler}
          startRunHandler={startRunHandler}
          prepareRunHandler={prepareRun}
          pauseHandler={pauseHandler}
        />
      </View>
      {isShowCompleted && (
        <CompleteRun
          pathPosition={pathPosition}
          markerPosition={markerPosition}
          runCompleteController={runCompleteController}
        />
      )}

      <Bottomsheet snapPoint="90%" ref={bottomSheetModalRef}>
        <EditKmItem
          onPress={closeBottomsheet}
          onChange={onChangeKm}
          inputValue={kmText}
        />
      </Bottomsheet>
    </>
  );
};

export default RunScreen;

const View = styled.View`
  flex: 1;
  z-index: 0;
  background-color: ${({theme}) => theme.colors.bg_gray100};
  align-items: center;
  justify-content: center;
`;

const TitleView = styled.View`
  position: absolute;
  z-index: 100;
  width: 100%;
  top: 2%;
`;

const TitleText = styled.Text`
  font-weight: 600;
  font-size: 22px;
  color: ${({theme}) => theme.colors.text_333};
  margin-left: 5%;
`;

const KmWrapper = styled.View`
  z-index: 100;
  width: 100%;
  height: 20%;
  top: 5%;
  position: absolute;
  align-items: center;
  justify-content: center;
`;

const KmBox = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  justify-content: space-around;
  border-bottom-width: 2px;
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

const LayerView = styled.View`
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const CircleView = styled.View`
  z-index: 1000;
  width: 80%;
  height: 48%;
  border-radius: 10px;
  overflow: hidden;
`;
