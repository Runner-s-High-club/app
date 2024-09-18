import {SvgProps} from 'react-native-svg';
import * as Icons from '@common/constants/icons';

export type IconProps = SvgProps & {
  name: keyof typeof Icons;
  size?: number;
};
