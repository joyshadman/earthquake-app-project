import { View, StyleSheet, Animated } from 'react-native';
import { useEffect, useRef } from 'react';
import { ThemeColors } from '../types';

interface Props {
  colors: ThemeColors;
  count?: number;
}

function Shimmer({ colors }: { colors: ThemeColors }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [anim]);

  const opacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, opacity }]}
    >
      <View style={styles.row}>
        <View style={[styles.circle, { backgroundColor: colors.border }]} />
        <View style={styles.textBlock}>
          <View style={[styles.line, { width: '70%', backgroundColor: colors.border }]} />
          <View style={[styles.line, { width: '40%', backgroundColor: colors.border, marginTop: 6 }]} />
        </View>
      </View>
      <View style={[styles.divider, { backgroundColor: colors.border }]} />
      <View style={styles.footerRow}>
        <View style={[styles.line, { width: '30%', backgroundColor: colors.border }]} />
        <View style={[styles.line, { width: '35%', backgroundColor: colors.border }]} />
      </View>
    </Animated.View>
  );
}

export function SkeletonLoader({ colors, count = 5 }: Props) {
  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, i) => (
        <Shimmer key={i} colors={colors} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
  },
  textBlock: {
    flex: 1,
  },
  line: {
    height: 14,
    borderRadius: 7,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 10,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
