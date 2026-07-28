import { useState } from 'react';
import { Image, StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';

import { useTheme } from '@/hooks/useTheme';
import type { GardenPalette } from '@/constants/theme';

import { GARDEN_SLOTS, gardenStats, type PlantStage } from './gardenGrowth';

const SCENE_HEIGHT = 200;
const GROUND_HEIGHT = 52;
const MASCOT_SIZE = 160;
/** Luna merawat kebun dari sisi kanan, jadi tanaman menempati bagian kiri. */
const PLANT_AREA_RATIO = 0.66;

const STEM_HEIGHTS: Record<Exclude<PlantStage, 0>, number> = { 1: 15, 2: 26, 3: 35 };
/** Variasi halus per petak supaya kebun terasa organik, bukan berbaris kaku. */
const SLOT_SCALES = [1, 0.9, 1.06, 0.95, 1.02, 0.88, 1] as const;
const SLOT_DEPTHS = [6, 16, 9, 18, 7, 15, 11] as const;
const PETAL_ANGLES = [-90, -18, 54, 126, 198] as const;

export interface GardenSceneProps {
  totalLoggedDays: number;
}

export function GardenScene({ totalLoggedDays }: GardenSceneProps) {
  const theme = useTheme();
  const [width, setWidth] = useState(0);
  const { stages, plantCount, bloomCount } = gardenStats(totalLoggedDays);
  const garden = theme.colors.garden;

  const bloomColors = [
    theme.colors.cycle.luteal,
    theme.colors.cycle.follicular,
    theme.colors.cycle.ovulation,
    theme.colors.cycle.predicted,
  ];

  const onLayout = (event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width);

  const groundTop = SCENE_HEIGHT - GROUND_HEIGHT;
  const plantAreaWidth = width * PLANT_AREA_RATIO;
  const slotWidth = plantAreaWidth / GARDEN_SLOTS;

  const label =
    plantCount === 0
      ? 'Kebun masih berupa tanah kosong, menunggu catatan pertamamu.'
      : `Kebun dengan ${plantCount} tanaman, ${bloomCount} di antaranya sudah mekar.`;

  return (
    <View
      accessible
      accessibilityLabel={label}
      style={[styles.scene, { backgroundColor: garden.sky }]}
      onLayout={onLayout}
    >
      {width > 0 ? (
        <Svg width={width} height={SCENE_HEIGHT}>
          <Cloud x={width * 0.16} y={34} scale={1} fill={garden.cloud} />
          <Cloud x={width * 0.62} y={22} scale={0.72} fill={garden.cloud} />

          <Ellipse
            cx={width * 0.5}
            cy={groundTop + 18}
            rx={width * 0.66}
            ry={30}
            fill={garden.ground}
          />
          <Rect
            x={0}
            y={groundTop + 18}
            width={width}
            height={GROUND_HEIGHT}
            fill={garden.ground}
          />
          <Ellipse
            cx={width * 0.44}
            cy={groundTop + 30}
            rx={width * 0.42}
            ry={16}
            fill={garden.groundShade}
          />

          {stages.map((stage, index) => (
            <Plant
              key={index}
              stage={stage}
              x={slotWidth * (index + 0.5) + slotWidth * 0.4}
              baseY={groundTop + SLOT_DEPTHS[index]}
              scale={SLOT_SCALES[index]}
              bloomColor={bloomColors[index % bloomColors.length]}
              garden={garden}
            />
          ))}
        </Svg>
      ) : null}

      <Image
        source={require('../../../assets/mascot/luna-watering.png')}
        style={styles.mascot}
        resizeMode="contain"
      />
    </View>
  );
}

interface PlantProps {
  x: number;
  baseY: number;
  stage: PlantStage;
  scale: number;
  bloomColor: string;
  garden: GardenPalette;
}

function Plant({ x, baseY, stage, scale, bloomColor, garden }: PlantProps) {
  if (stage === 0) return null;

  const height = STEM_HEIGHTS[stage] * scale;
  const topY = baseY - height;
  const leafRx = 6 * scale;

  return (
    <>
      <Ellipse cx={x} cy={baseY} rx={7 * scale} ry={2.6 * scale} fill={garden.soil} />
      <Path
        d={`M ${x} ${baseY} C ${x - 2.5} ${baseY - height * 0.45} ${x + 2.5} ${baseY - height * 0.72} ${x} ${topY}`}
        stroke={garden.stem}
        strokeWidth={2.2 * scale}
        strokeLinecap="round"
        fill="none"
      />
      <Ellipse
        cx={x - leafRx * 0.9}
        cy={baseY - height * 0.42}
        rx={leafRx}
        ry={leafRx * 0.62}
        fill={garden.leaf}
      />
      {stage >= 2 ? (
        <Ellipse
          cx={x + leafRx * 0.9}
          cy={baseY - height * 0.66}
          rx={leafRx * 0.9}
          ry={leafRx * 0.58}
          fill={garden.leaf}
        />
      ) : null}
      {stage === 2 ? (
        <Circle cx={x} cy={topY} r={3.6 * scale} fill={bloomColor} opacity={0.6} />
      ) : null}
      {stage === 3 ? (
        <Blossom
          cx={x}
          cy={topY - 1}
          radius={4.8 * scale}
          petalColor={bloomColor}
          centerColor={garden.blossomCenter}
        />
      ) : null}
    </>
  );
}

interface BlossomProps {
  cx: number;
  cy: number;
  radius: number;
  petalColor: string;
  centerColor: string;
}

function Blossom({ cx, cy, radius, petalColor, centerColor }: BlossomProps) {
  return (
    <>
      {PETAL_ANGLES.map((angle) => {
        const radians = (angle * Math.PI) / 180;
        return (
          <Circle
            key={angle}
            cx={cx + Math.cos(radians) * radius}
            cy={cy + Math.sin(radians) * radius}
            r={radius * 0.74}
            fill={petalColor}
          />
        );
      })}
      <Circle cx={cx} cy={cy} r={radius * 0.52} fill={centerColor} />
    </>
  );
}

interface CloudProps {
  x: number;
  y: number;
  scale: number;
  fill: string;
}

function Cloud({ x, y, scale, fill }: CloudProps) {
  return (
    <>
      <Circle cx={x} cy={y} r={11 * scale} fill={fill} />
      <Circle cx={x + 13 * scale} cy={y + 3 * scale} r={8 * scale} fill={fill} />
      <Circle cx={x - 12 * scale} cy={y + 4 * scale} r={7 * scale} fill={fill} />
      <Rect
        x={x - 12 * scale}
        y={y + 1 * scale}
        width={25 * scale}
        height={10 * scale}
        rx={5 * scale}
        fill={fill}
      />
    </>
  );
}

const styles = StyleSheet.create({
  scene: { height: SCENE_HEIGHT, overflow: 'hidden' },
  mascot: {
    position: 'absolute',
    right: -6,
    bottom: 0,
    width: MASCOT_SIZE,
    height: MASCOT_SIZE,
  },
});
