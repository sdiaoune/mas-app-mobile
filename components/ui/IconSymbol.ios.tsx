import { SymbolView, SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { StyleProp, ViewStyle } from 'react-native';

export function IconSymbol({
  style,
  weight = 'regular',
  ...props
}: Omit<SymbolViewProps, 'weight'> & {
  style?: StyleProp<ViewStyle>;
  weight?: SymbolViewProps['weight'];
}) {
  return (
    <SymbolView
      {...props}
      weight={weight}
      style={[{ width: 24, height: 24 }, style]}
    />
  );
}
