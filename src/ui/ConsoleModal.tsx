import React, { useMemo } from 'react';
import { Modal, View, Text, StyleSheet, Pressable, FlatList, Platform } from 'react-native';

export type ConsoleLevel = 'log' | 'info' | 'warn' | 'error' | 'debug';

export interface ConsoleEntry {
  level: ConsoleLevel;
  args: unknown[];
  ts: number;
  location?: string;
}

export interface ConsoleModalProps {
  visible: boolean;
  onRequestClose: () => void;
  entries: ConsoleEntry[];
  onClear: () => void;
  theme?: 'light' | 'dark';
}

export default function ConsoleModal(props: ConsoleModalProps) {
  const { visible, onRequestClose, entries, onClear, theme = 'dark' } = props;
  const isDark = theme === 'dark';

  const dynamic = useMemo(() => getDynamicStyles(isDark), [isDark]);

  const renderItem = ({ item }: { item: ConsoleEntry }) => {
    const color =
      item.level === 'error'
        ? '#ef4444'
        : item.level === 'warn'
        ? '#f59e0b'
        : item.level === 'info'
        ? '#60a5fa'
        : item.level === 'debug'
        ? '#22c55e'
        : isDark
        ? '#e5e7eb'
        : '#111827';

    const time = new Date(item.ts);
    const timeStr = `${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}:${String(time.getSeconds()).padStart(2, '0')}`;

    return (
      <View style={styles.row}>
        <Text style={[styles.level, { color }]}>{item.level.toUpperCase()}</Text>
        <Text style={[styles.time, dynamic.time]}>{timeStr}</Text>
        <Text style={[styles.message, dynamic.message]}>
          {item.args.map(formatArg).join(' ')}
        </Text>
      </View>
    );
  };

  return (
    <Modal transparent animationType="slide" visible={visible} onRequestClose={onRequestClose}>
      <Pressable style={styles.backdrop} onPress={onRequestClose}>
        <Pressable style={[styles.sheet, dynamic.sheet]} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <Text style={[styles.title, dynamic.title]}>Browser Console</Text>
            <View style={styles.headerActions}>
              <Pressable style={[styles.headerButton, styles.clearBtn]} onPress={onClear}>
                <Text style={styles.headerButtonText}>Clear</Text>
              </Pressable>
              <Pressable style={styles.headerButton} onPress={onRequestClose}>
                <Text style={styles.headerButtonText}>Close</Text>
              </Pressable>
            </View>
          </View>
          <FlatList
            data={entries}
            keyExtractor={(_, idx) => String(idx)}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            inverted
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function formatArg(arg: unknown): string {
  try {
    if (typeof arg === 'string') return arg;
    if (typeof arg === 'number' || typeof arg === 'boolean') return String(arg);
    if (arg === undefined) return 'undefined';
    if (arg === null) return 'null';
    if (arg && typeof arg === 'object') return JSON.stringify(arg);
    return String(arg);
  } catch {
    return '[unprintable]';
  }
}

function getDynamicStyles(isDark: boolean) {
  return {
    sheet: {
      backgroundColor: isDark ? '#0b0b0b' : '#ffffff',
    },
    title: {
      color: isDark ? '#ffffff' : '#111827',
    },
    time: {
      color: isDark ? '#9ca3af' : '#6b7280',
    },
    message: {
      color: isDark ? '#e5e7eb' : '#111827',
    },
  };
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    maxHeight: '80%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 12,
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    paddingBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: Platform.select({
      ios: 'Avenir-Heavy',
      android: 'sans-serif-medium',
      default: 'System',
    }),
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    backgroundColor: '#111827',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  clearBtn: {
    backgroundColor: '#374151',
  },
  headerButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 24,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 4,
    alignItems: 'flex-start',
  },
  level: {
    width: 64,
    fontSize: 12,
    fontWeight: '700',
  },
  time: {
    width: 52,
    fontSize: 12,
    marginRight: 8,
  },
  message: {
    flex: 1,
    fontSize: 13,
  },
});

