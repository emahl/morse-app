import React, { useMemo } from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { ROOT, MorseNode } from '../utility/morseTree';
import { useMorseStore } from '../store/morseStore';
import { TAPTYPE_DAH, TapType } from '../utility/constants';

const MAX_LEVEL = 5;

interface PositionedNode {
  text: string;
  x: number;
  y: number;
  level: number;
  index: number;
  isActive: boolean;
}

interface PositionedEdge {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  isDah: boolean;
  isActive: boolean;
  label: string;
}

function buildPositionedTree(
  node: MorseNode | null,
  level: number,
  index: number,
  activeNodeKeys: Set<string>,
  scaledWidth: number,
  levelHeight: number,
): { nodes: PositionedNode[]; edges: PositionedEdge[] } {
  if (!node || level > MAX_LEVEL) return { nodes: [], edges: [] };

  const x = ((index + 0.5) * scaledWidth) / Math.pow(2, level);
  const y = level * levelHeight;
  const isActive = activeNodeKeys.has(`${level}-${index}`);

  const nodeResult: PositionedNode = {
    text: node.text || (level === 0 ? '•' : ''),
    x, y, level, index, isActive,
  };

  const allNodes = [nodeResult];
  const allEdges: PositionedEdge[] = [];

  if (node.left) {
    const leftIndex = index * 2;
    const childX = ((leftIndex + 0.5) * scaledWidth) / Math.pow(2, level + 1);
    const childY = (level + 1) * levelHeight;
    allEdges.push({
      x1: x, y1: y, x2: childX, y2: childY,
      isDah: true,
      isActive: activeNodeKeys.has(`${level}-${index}-dah`),
      label: '−',
    });
    const { nodes, edges } = buildPositionedTree(node.left, level + 1, leftIndex, activeNodeKeys, scaledWidth, levelHeight);
    allNodes.push(...nodes);
    allEdges.push(...edges);
  }

  if (node.right) {
    const rightIndex = index * 2 + 1;
    const childX = ((rightIndex + 0.5) * scaledWidth) / Math.pow(2, level + 1);
    const childY = (level + 1) * levelHeight;
    allEdges.push({
      x1: x, y1: y, x2: childX, y2: childY,
      isDah: false,
      isActive: activeNodeKeys.has(`${level}-${index}-dit`),
      label: '·',
    });
    const { nodes, edges } = buildPositionedTree(node.right, level + 1, rightIndex, activeNodeKeys, scaledWidth, levelHeight);
    allNodes.push(...nodes);
    allEdges.push(...edges);
  }

  return { nodes: allNodes, edges: allEdges };
}

function getActiveNodeKeys(sequence: TapType[]): Set<string> {
  const activeKeys = new Set<string>();
  let currentNode = ROOT;
  let index = 0;
  let level = 0;

  activeKeys.add('0-0');

  for (const tap of sequence) {
    const isDah = tap === TAPTYPE_DAH;
    const nextIndex = isDah ? index * 2 : index * 2 + 1;
    const nextNode = isDah ? currentNode.left : currentNode.right;
    if (!nextNode) break;
    activeKeys.add(`${level + 1}-${nextIndex}`);
    activeKeys.add(`${level}-${index}-${isDah ? 'dah' : 'dit'}`);
    currentNode = nextNode;
    index = nextIndex;
    level += 1;
  }

  return activeKeys;
}

interface MorseTreeOverlayProps {
  visible: boolean;
}

export const MorseTreeOverlay: React.FC<MorseTreeOverlayProps> = ({ visible }) => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const morseSequence = useMorseStore((state) => state.morseSequence);

  // All dimensions derived from live screen size — updates on window resize
  const TOTAL_WIDTH = windowWidth - 24;
  const RAW_CELL_SIZE = TOTAL_WIDTH / Math.pow(2, MAX_LEVEL);
  const CELL_SIZE = Math.min(RAW_CELL_SIZE, 30);
  const SCALED_WIDTH = CELL_SIZE * Math.pow(2, MAX_LEVEL);
  const NODE_RADIUS = Math.max(5, Math.round(CELL_SIZE * 0.45));
  const NODE_FONT_SIZE = Math.max(6, Math.round(CELL_SIZE * 0.6));

  // Cap level height so tree never exceeds ~38% of screen height
  const maxTreeHeight = windowHeight * 0.38;
  const widthBasedLevelHeight = Math.max(24, Math.round(CELL_SIZE * 2.2));
  const LEVEL_HEIGHT = Math.min(widthBasedLevelHeight, Math.floor(maxTreeHeight / MAX_LEVEL));

  const TREE_HEIGHT = MAX_LEVEL * LEVEL_HEIGHT;
  const CARD_HEIGHT = TREE_HEIGHT + 70;

  const heightAnim = useSharedValue(0);

  React.useEffect(() => {
    heightAnim.value = withTiming(visible ? CARD_HEIGHT : 0, { duration: 280 });
  }, [visible, CARD_HEIGHT, heightAnim]);

  const activeKeys = useMemo(() => getActiveNodeKeys(morseSequence), [morseSequence]);
  const { nodes, edges } = useMemo(
    () => buildPositionedTree(ROOT, 0, 0, activeKeys, SCALED_WIDTH, LEVEL_HEIGHT),
    [activeKeys, SCALED_WIDTH, LEVEL_HEIGHT]
  );

  const wrapperStyle = useAnimatedStyle(() => ({
    height: heightAnim.value,
    overflow: 'hidden',
  }));

  const renderNode = (node: PositionedNode) => (
    <View
      key={`node-${node.level}-${node.index}`}
      style={{
        position: 'absolute',
        left: node.x - NODE_RADIUS,
        top: node.y - NODE_RADIUS,
        width: NODE_RADIUS * 2,
        height: NODE_RADIUS * 2,
        borderRadius: NODE_RADIUS,
        backgroundColor: node.isActive ? '#E8806A' : '#4A4744',
        borderWidth: node.isActive ? 2 : 1,
        borderColor: node.isActive ? '#F0A090' : '#5A5754',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text
        style={{
          fontSize: NODE_FONT_SIZE,
          fontWeight: '700',
          color: node.isActive ? '#2C2B28' : '#9A9590',
          fontFamily: 'monospace',
        }}
      >
        {node.text}
      </Text>
    </View>
  );

  const renderEdge = (edge: PositionedEdge, idx: number) => {
    const dx = edge.x2 - edge.x1;
    const dy = edge.y2 - edge.y1;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    const midX = (edge.x1 + edge.x2) / 2;
    const midY = (edge.y1 + edge.y2) / 2;

    return (
      <View
        key={`edge-${idx}`}
        style={{
          position: 'absolute',
          width: length,
          height: edge.isActive ? 2 : 1,
          backgroundColor: edge.isActive ? '#E8806A' : '#4A4744',
          left: midX - length / 2,
          top: midY,
          transform: [{ rotate: `${angle}deg` }],
        }}
      />
    );
  };

  const renderEdgeLabel = (edge: PositionedEdge, idx: number) => {
    const midX = (edge.x1 + edge.x2) / 2;
    const midY = (edge.y1 + edge.y2) / 2;
    const offsetY = edge.isDah ? -8 : 8;

    return (
      <View
        key={`label-${idx}`}
        style={{
          position: 'absolute',
          left: midX - 5,
          top: midY + offsetY - 5,
          width: 10,
          height: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            fontSize: Math.max(6, NODE_FONT_SIZE - 1),
            color: edge.isActive ? '#E8806A' : '#7A7672',
            fontWeight: '600',
          }}
        >
          {edge.label}
        </Text>
      </View>
    );
  };

  return (
    <Animated.View style={wrapperStyle}>
      <View style={styles.card}>
        <Text style={styles.header}>Morse Tree</Text>
        <Text style={styles.hint}>· = short (right)  │  − = long (left)</Text>
        <View style={styles.treeContainer}>
          <View style={{ width: SCALED_WIDTH, height: TREE_HEIGHT, position: 'relative' }}>
            {edges.map((edge, idx) => renderEdge(edge, idx))}
            {edges.map((edge, idx) => renderEdgeLabel(edge, idx))}
            {nodes.map((node) => renderNode(node))}
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#373532',
    borderBottomWidth: 1,
    borderColor: '#4A4744',
    paddingTop: 12,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  header: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E8806A',
    paddingLeft: 16,
    paddingBottom: 4,
    fontFamily: 'monospace',
  },
  hint: {
    fontSize: 11,
    color: '#9A9590',
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 8,
    fontFamily: 'monospace',
  },
  treeContainer: {
    paddingHorizontal: 12,
    alignItems: 'center',
  },
});
