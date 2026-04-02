import React, { useMemo } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { ROOT, MorseNode } from '../utility/morseTree';
import { useMorseStore } from '../store/morseStore';
import { TAPTYPE_DIT, TAPTYPE_DAH, TapType } from '../utility/constants';

// Layout constants
const MAX_LEVEL = 5;
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// Make tree width responsive: fit to available screen width, max 960px
const availableWidth = Math.max(windowWidth - 40, 200); // 20px padding each side, min 200px
const TOTAL_WIDTH = Math.min(availableWidth * 0.95, 960);

// Scale node and cell sizes proportionally based on tree width
const CELL_SIZE = TOTAL_WIDTH / Math.pow(2, MAX_LEVEL); // Scales with TOTAL_WIDTH
const LEVEL_HEIGHT = 44; // Compact spacing (was 54px)
const TREE_HEIGHT = MAX_LEVEL * LEVEL_HEIGHT; // 220px total
const NODE_RADIUS = 10; // Fixed size, not scaled
// Card height for animation: tree + header + hint + padding
const CARD_HEIGHT = TREE_HEIGHT + 70; // ~290px (220 tree + 70 header/hint/padding)

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

/**
 * Build the tree with layout positions using binary tree indexing
 */
function buildPositionedTree(
  node: MorseNode | null,
  level: number,
  index: number,
  activeNodeKeys: Set<string>
): { nodes: PositionedNode[]; edges: PositionedEdge[] } {
  if (!node || level > MAX_LEVEL) return { nodes: [], edges: [] };

  const x = ((index + 0.5) * TOTAL_WIDTH) / Math.pow(2, level);
  const y = level * LEVEL_HEIGHT;

  const nodeKey = `${level}-${index}`;
  const isActive = activeNodeKeys.has(nodeKey);

  const nodeResult: PositionedNode = {
    text: node.text || (level === 0 ? '•' : ''),
    x,
    y,
    level,
    index,
    isActive,
  };

  const allNodes = [nodeResult];
  const allEdges: PositionedEdge[] = [];

  // Left child (DAH)
  if (node.left) {
    const leftIndex = index * 2;
    const childX = ((leftIndex + 0.5) * TOTAL_WIDTH) / Math.pow(2, level + 1);
    const childY = (level + 1) * LEVEL_HEIGHT;
    const edgeKey = `${level}-${index}-dah`;

    allEdges.push({
      x1: x,
      y1: y,
      x2: childX,
      y2: childY,
      isDah: true,
      isActive: activeNodeKeys.has(edgeKey),
      label: '−',
    });

    const { nodes, edges } = buildPositionedTree(node.left, level + 1, leftIndex, activeNodeKeys);
    allNodes.push(...nodes);
    allEdges.push(...edges);
  }

  // Right child (DIT)
  if (node.right) {
    const rightIndex = index * 2 + 1;
    const childX = ((rightIndex + 0.5) * TOTAL_WIDTH) / Math.pow(2, level + 1);
    const childY = (level + 1) * LEVEL_HEIGHT;
    const edgeKey = `${level}-${index}-dit`;

    allEdges.push({
      x1: x,
      y1: y,
      x2: childX,
      y2: childY,
      isDah: false,
      isActive: activeNodeKeys.has(edgeKey),
      label: '·',
    });

    const { nodes, edges } = buildPositionedTree(node.right, level + 1, rightIndex, activeNodeKeys);
    allNodes.push(...nodes);
    allEdges.push(...edges);
  }

  return { nodes: allNodes, edges: allEdges };
}

/**
 * Compute the active path through the tree
 */
function getActiveNodeKeys(sequence: TapType[]): Set<string> {
  const activeKeys = new Set<string>();
  let currentNode = ROOT;
  let index = 0;
  let level = 0;

  activeKeys.add('0-0'); // Root is always in the path

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
  const morseSequence = useMorseStore((state) => state.morseSequence);
  const translateY = useSharedValue(CARD_HEIGHT);

  // Update animation based on visible prop
  React.useEffect(() => {
    translateY.value = withTiming(visible ? 0 : CARD_HEIGHT, { duration: 280 });
  }, [visible, translateY]);

  // Compute active nodes/edges
  const activeKeys = useMemo(() => getActiveNodeKeys(morseSequence), [morseSequence]);
  const { nodes, edges } = useMemo(
    () => buildPositionedTree(ROOT, 0, 0, activeKeys),
    [activeKeys]
  );

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
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
        backgroundColor: node.isActive ? '#FF7A00' : '#2A2A2A',
        borderWidth: node.isActive ? 2 : 1,
        borderColor: node.isActive ? '#FF9A3C' : '#444444',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text
        style={{
          fontSize: 9,
          fontWeight: '700',
          color: node.isActive ? '#0A0A0A' : '#AAAAAA',
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
          backgroundColor: edge.isActive ? '#FF7A00' : '#2A2A2A',
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
            fontSize: 7,
            color: edge.isActive ? '#FF7A00' : '#666666',
            fontWeight: '600',
          }}
        >
          {edge.label}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.overlay} pointerEvents="none">
      <Animated.View style={[styles.card, cardStyle]}>
        <Text style={styles.header}>Morse Tree</Text>
        <Text style={styles.hint}>· = short (right)  │  − = long (left)</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flex: 1, paddingHorizontal: 10 }}>
          <View
            style={{
              width: TOTAL_WIDTH,
              height: TREE_HEIGHT,
              position: 'relative',
            }}
          >
            {edges.map((edge, idx) => renderEdge(edge, idx))}
            {edges.map((edge, idx) => renderEdgeLabel(edge, idx))}
            {nodes.map((node) => renderNode(node))}
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  card: {
    backgroundColor: '#141414',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#2A2A2A',
    paddingTop: 12,
    paddingBottom: 16,
    overflow: 'hidden',
    shadowColor: '#FF7A00',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF7A00',
    paddingLeft: 16,
    paddingBottom: 4,
    fontFamily: 'monospace',
  },
  hint: {
    fontSize: 11,
    color: '#8A8A8A',
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 8,
    fontFamily: 'monospace',
  },
});
