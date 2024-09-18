// =============================================================================
// File    :  RunButtonGroup.tsx
// Class   :
// Purpose :  RunButtonGroup
// Date    :  2024.05
// Author  :  JHS
// History :
// =============================================================================
// Copyright (C) 2024 JHS All rights reserved.
// =============================================================================

import React, {useEffect, useMemo, useState} from 'react';
import styled from '@emotion/native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {Alert} from 'react-native';
import {useDispatch} from 'react-redux';

import navigationSlice from '@navigation/slice/navigation.slice';
import {colors} from '@common/styles/theme';
import {CircleButton, SvgIcon} from '@common/components/atoms';

interface IRunButtonGroup {
  startRunHandler: () => void;
  settingHandler: () => void;
  prepareRunHandler: () => void;
  pauseHandler: () => void;
  isPause: boolean;
  isRun: boolean;
}

/**
 * 런 스크린 버튼 그룹 컴포넌트
 * @property { boolean } isRun 달리기 시작 여부
 * @property { boolean } isPause 달리기 일시정지 여부
 * @property { () => void } startRunHandler 달리기 시작 함수
 * @property { () => void } settingHandler 셋팅 바텀시트 호출 함수
 * @property { () => void } prepareRunHandler 달리기 준비 단계 호출 함수
 * @property { () => void } pauseHandler 달리기 임시정지 함수
 * @returns React.JSX.Element
 */
const RunButtonGroup = ({
  startRunHandler,
  settingHandler,
  prepareRunHandler,
  pauseHandler,
  isPause,
  isRun,
}: IRunButtonGroup) => {
  const dispatch = useDispatch();
  /** 사운드 버튼 사용 여부 */
  const [isSound, setIsSound] = useState(true);

  /** 사운드 버튼 핸들러 */
  const soundHandler = () => {
    setIsSound(prev => !prev);
  };

  /** 사운드 아이콘  */
  const soundIconName = useMemo(() => {
    return isSound ? 'soundMax' : 'soundMin';
  }, [isSound]);

  /** 왼쪽 버튼 사이즈  */
  const leftButtonSize = useSharedValue(80);
  /** 왼쪽 버튼  TranslateX */
  const leftTranslateX = useSharedValue<number>(0);
  /** 오른쪽 버튼  TranslateX */
  const rightTranslateX = useSharedValue<number>(0);
  /** 오른쪽 버튼  display */
  const rightDisplay = useSharedValue<any>('block');
  /** 왼쪽 버튼 view 애니메이션 스타일  */
  const leftButtonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: leftTranslateX.value}],
    };
  });
  /** 오른쪽 버튼 view 애니메이션 스타일  */
  const rightButtonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: rightTranslateX.value}],
    };
  });
  /** 왼쪽 버튼  애니메이션 스타일  */
  const leftButtonStyle = useAnimatedStyle(() => {
    return {
      width: leftButtonSize.value,
      height: leftButtonSize.value,
    };
  });

  /** 버튼 애니메이션  */
  useEffect(() => {
    if (isRun) {
      if (isPause) {
        leftButtonSize.value = withSpring(80, {
          duration: 400,
        });
        leftTranslateX.value = withTiming(-60, {
          duration: 200,
          easing: Easing.linear,
        });
        rightTranslateX.value = withTiming(60, {
          duration: 200,
          easing: Easing.linear,
        });
      } else {
        leftTranslateX.value = withTiming(0, {
          duration: 200,
          easing: Easing.linear,
        });
        rightTranslateX.value = withTiming(0, {
          duration: 200,
          easing: Easing.linear,
        });
        setTimeout(() => {
          leftButtonSize.value = withSpring(84, {
            duration: 400,
          });
        }, 200);
      }
    }
  }, [
    isPause,
    isRun,
    leftButtonSize,
    leftTranslateX,
    rightDisplay,
    rightTranslateX,
  ]);

  /** run 버튼 아이콘 이름 */
  const runButtonIconName = useMemo(() => {
    if (isRun && !isPause) {
      return 'pause';
    } else if (isPause) {
      return 'play';
    } else {
      return 'play';
    }
  }, [isPause, isRun]);

  /** run 버튼 컬러 */
  const runButtonColor = useMemo(() => {
    return isRun ? colors.warning : colors.primary;
  }, [isRun]);

  /** run 버튼 아이콘 사이즈 */
  const runButtonIconSize = useMemo(() => {
    return isRun && !isPause ? 40 : 60;
  }, [isPause, isRun]);

  /** 달리기 종료 핸들러 */
  const endRunningHandler = () => {
    Alert.alert('달리기를 종료하시겠습니까 ?', '', [
      {
        text: '취소',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: '확인',
        onPress: () => {
          pauseHandler();
          startRunHandler();
        },
      },
    ]);
  };

  /** 달리기 이벤트 컨트롤러 */
  const runController = () => {
    if (isRun) {
      pauseHandler();
    } else {
      dispatch(navigationSlice.actions.setIsTabShowStatus(false));
      prepareRunHandler();
    }
  };

  return (
    <ButtonWrapper>
      <ButtonBox>
        <Left>
          {!isRun && !isPause && (
            <CircleButton onPress={settingHandler} size={40} buttonColor="#fff">
              <SvgIcon name="setting" size={24} />
            </CircleButton>
          )}
        </Left>
        <Mid>
          <AnimatedLeftView style={leftButtonAnimatedStyle}>
            <AnimatedCircleButton
              style={leftButtonStyle}
              onPress={runController}
              // size={leftButtonSize}
              buttonColor={runButtonColor}>
              <SvgIcon
                name={runButtonIconName}
                size={runButtonIconSize}
                color={colors.bg_gray000}
                fill={colors.bg_gray000}
                stroke={colors.bg_gray000}
              />
            </AnimatedCircleButton>
          </AnimatedLeftView>
          <AnimatedRightView style={rightButtonAnimatedStyle}>
            <AnimatedCircleButton
              onPress={endRunningHandler}
              size={80}
              buttonColor={colors.danger}>
              <SvgIcon name="stop" size={50} stroke={'#fff'} />
            </AnimatedCircleButton>
          </AnimatedRightView>
        </Mid>
        <Right>
          {!isPause && (
            <CircleButton onPress={soundHandler} size={40} buttonColor="#fff">
              <SvgIcon name={soundIconName} size={26} />
            </CircleButton>
          )}
        </Right>
      </ButtonBox>
    </ButtonWrapper>
  );
};
export default RunButtonGroup;

const ButtonWrapper = styled.View`
  z-index: 100;
  width: 100%;
  height: 20%;
  position: absolute;
  bottom: 5%;
  align-items: center;
  justify-content: center;
`;

const ButtonBox = styled.View`
  z-index: 1;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;

const BottomLeftView = styled.View`
  z-index: 2000;
  flex-direction: row;
  align-items: center;
  position: absolute;
`;

const BottomRightView = styled.View`
  z-index: 1000;
  flex-direction: row;
  align-items: center;
`;

const Left = styled.View`
  flex: 1;
  align-items: center;
`;

const Mid = styled.View`
  flex: 1;
  align-items: center;
`;

const Right = styled.View`
  flex: 1;
  align-items: center;
`;

const AnimatedCircleButton = Animated.createAnimatedComponent(CircleButton);

const AnimatedLeftView = Animated.createAnimatedComponent(BottomLeftView);

const AnimatedRightView = Animated.createAnimatedComponent(BottomRightView);
