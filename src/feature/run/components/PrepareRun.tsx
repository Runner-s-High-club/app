// =============================================================================
// File    :  PrepareRun.tsx
// Class   :
// Purpose :  PrepareRun
// Date    :  2024.06
// Author  :  JHS
// History :
// =============================================================================
// Copyright (C) 2024 JHS All rights reserved.
// =============================================================================

import styled from '@emotion/native';
import React, {useEffect, useState} from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

/** 달리 준비 컴포넌트 인터페이스 */
interface IPrepareRun {
  runCount: number;
}

/**
 * 달리기 준비 단계 컴포넌트
 * @property { number } runCount 달리기 시작 카운트 번호
 * @returns React.JSX.Element
 */
const PrepareRun = ({runCount}: IPrepareRun) => {
  const opacity = useSharedValue(0);

  const animatedViewWidth = useSharedValue(30);
  const animatedViewHeight = useSharedValue(15);
  const animatedViewRadius = useSharedValue(1000);
  const animatedViewTop = useSharedValue(30);
  const animatedViewOpacity = useSharedValue(1);

  /** 카운트 애니메이션 */
  useEffect(() => {
    opacity.value = withTiming(1, {duration: 250});

    const resetAnimation = setTimeout(() => {
      opacity.value = withTiming(0, {duration: 400});
    }, 500);

    return () => clearTimeout(resetAnimation);
  }, [opacity, runCount]);

  /** View 애니메이션 스타일 */
  const animatedViewStyle = useAnimatedStyle(() => {
    return {
      width: `${animatedViewWidth.value}%`,
      height: `${animatedViewHeight.value}%`,
      borderRadius: animatedViewRadius.value,
      top: `${animatedViewTop.value}%`,
    };
  });

  /** 텍스트 애니메이션 스타일 */
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  /** 텍스트 애니메이션 스타일 */
  const animatedWrapperStyle = useAnimatedStyle(() => {
    return {
      opacity: animatedViewOpacity.value,
    };
  });
  /** 카운터 시작시 view 애니메이션 */
  useEffect(() => {
    animatedViewWidth.value = withTiming(animatedViewWidth.value + 70, {
      duration: 150,
    });
    animatedViewHeight.value = withTiming(animatedViewHeight.value + 85, {
      duration: 200,
    });
    animatedViewTop.value = withTiming(animatedViewTop.value - 30, {
      duration: 150,
    });
    animatedViewRadius.value = withTiming(animatedViewRadius.value - 1000, {
      duration: 150,
    });
  }, [
    animatedViewHeight,
    animatedViewRadius,
    animatedViewTop,
    animatedViewWidth,
  ]);

  const [isText, setIsText] = useState(true);

  /** 카운터 종료 시 view 애니메이션 */
  useEffect(() => {
    if (runCount === 0) {
      setIsText(() => {
        return true;
      });
      setTimeout(() => {
        setIsText(() => {
          return false;
        });
        animatedViewTop.value = withTiming(animatedViewTop.value + 78, {
          duration: 150,
        });
        animatedViewWidth.value = withSpring(animatedViewWidth.value - 75, {
          duration: 150,
        });
        animatedViewHeight.value = withSpring(animatedViewHeight.value - 85, {
          duration: 150,
        });
        animatedViewRadius.value = withSpring(animatedViewRadius.value + 1000, {
          duration: 150,
        });
      }, 500);
    }
  }, [
    animatedViewHeight,
    animatedViewRadius,
    animatedViewTop,
    animatedViewWidth,
    runCount,
  ]);

  return (
    <AnimatedWrapper style={animatedWrapperStyle}>
      <AnimatedView style={animatedViewStyle}>
        {runCount > 0 ? (
          <AnimatedCountText style={[animatedStyle]}>
            {runCount}
          </AnimatedCountText>
        ) : (
          isText && <AnimatedCountText>출발 !</AnimatedCountText>
        )}
      </AnimatedView>
    </AnimatedWrapper>
  );
};

export default PrepareRun;

const Wrapper = styled.View`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1000;
  background-color: transparent;
  align-items: center;
`;

const CounterView = styled.View`
  position: absolute;
  z-index: 2000;
  background-color: #ffbf5f;
  justify-content: center;
  align-items: center;
`;

const CountText = styled.Text`
  font-size: 100px;
  font-weight: bold;
  margin-bottom: 20%;
  color: #fff;
`;

const AnimatedWrapper = Animated.createAnimatedComponent(Wrapper);

const AnimatedView = Animated.createAnimatedComponent(CounterView);

const AnimatedCountText = Animated.createAnimatedComponent(CountText);