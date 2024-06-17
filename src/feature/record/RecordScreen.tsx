// =============================================================================
// File    :  HomeScreen.tsx
// Class   :
// Purpose :  HomeScreen
// Date    :  2024.05
// Author  :  JHS
// History :
// =============================================================================
// Copyright (C) 2024 JHS All rights reserved.
// =============================================================================

import React, {useEffect} from 'react';
import styled from '@emotion/native';
import {
  AppState,
  AppStateStatus,
  FlatList,
  ListRenderItem,
  ViewToken,
} from 'react-native';
import useHealthPermissions from '@hooks/useHealthPermissions';
import healthPermissions from '@common/constants/healthPermissions';
import {useSharedValue} from 'react-native-reanimated';
import RecordListItem from '@feature/record/components/RecordListItem';

type ItemType = {
  id: number;
};

/**
 * 기록 화면
 * @returns React.JSX.Element
 */
const RecordScreen = () => {
  const healthPermissionController = useHealthPermissions();

  /** 건강 데이터 권한 요청 이펙트 */
  useEffect(() => {
    healthPermissionController.initHealthPermission(healthPermissions);
  }, [healthPermissionController]);

  /** 백그라운드 에서 다시 앱으로 돌아왔을 시 실행 */
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        console.log(`백그라운드에서 돌아옴 :`, nextAppState);
        healthPermissionController.getPermissionAuthStatus(healthPermissions);
      }
    };
    const listener = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      listener.remove();
    };
  }, [healthPermissionController]);

  //TODO 임시 데이터
  const data = new Array(50).fill(0).map((_, i) => {
    return {id: i};
  });

  /** flatlist 애니메이션 벨류 */
  const viewItems = useSharedValue<ViewToken[]>([]);

  /** 랜더링 아이템 */
  const renderItem: ListRenderItem<ItemType> = ({item}) => (
    <RecordListItem item={item} viewItems={viewItems} />
  );

  return (
    <View>
      <TitleView>
        <TitleText>기록</TitleText>
      </TitleView>
      <FlatList
        data={data}
        initialNumToRender={4}
        renderItem={renderItem}
        onViewableItemsChanged={info => {
          const {viewableItems} = info;
          viewItems.value = viewableItems;
        }}
      />
    </View>
  );
};

export default RecordScreen;

const View = styled.View`
  flex: 1;
  background-color: #f4f4f4;
`;

const TitleView = styled.View`
  width: 100%;
  top: 2%;
  margin-bottom: 5%;
`;

const TitleText = styled.Text`
  font-weight: 600;
  font-size: 22px;
  color: #333;
  margin-left: 5%;
`;
