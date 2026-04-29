import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { InfoChallenge } from '../../data/levels';

interface Props {
  challenge: InfoChallenge;
}

export const InfoCard: React.FC<Props> = ({ challenge }) => {
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.badgeRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>HOW IT WORKS</Text>
        </View>
      </View>

      <Text style={styles.title}>{challenge.title}</Text>

      <View style={styles.bodyCard}>
        <Text style={styles.body}>{challenge.body}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  container: {
    padding: 24,
    alignItems: 'center',
    gap: 24,
    flexGrow: 1,
    justifyContent: 'center',
  },
  badgeRow: {
    alignItems: 'center',
  },
  badge: {
    backgroundColor: 'rgba(232, 128, 106, 0.15)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(232, 128, 106, 0.4)',
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E8806A',
    fontFamily: 'monospace',
    letterSpacing: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F5F3EF',
    fontFamily: 'monospace',
    textAlign: 'center',
    letterSpacing: 1,
  },
  bodyCard: {
    backgroundColor: '#373532',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#4A4744',
    padding: 20,
    width: '100%',
  },
  body: {
    fontSize: 14,
    color: '#F5F3EF',
    fontFamily: 'monospace',
    lineHeight: 22,
  },
});
