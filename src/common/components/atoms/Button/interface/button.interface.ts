// =============================================================================
// File    : button.interface.ts
// Class   :
// Purpose : button.interface.ts 인터페이스
// Date    : 2024.09
// Author  :  JHS
// History :
// =============================================================================
// Copyright (C) 2024 JHS All rights reserved.
// =============================================================================
import {PressableProps} from 'react-native';

export interface IButton extends PressableProps {
  children: React.ReactNode;
  size?: number;
  buttonColor?: string;
}
