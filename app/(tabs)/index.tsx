import { StyleSheet } from 'react-native';
import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import {
  getMonthlyExpenseSummary,
  getCategoryBreakdownForMonth,
} from '@/db/repositories/summaryRepo';

type MonthlySummary = {
  month: string;
  totalExpense: number;
};

type CategorySummary = {
  categoryId: number;
  categoryName: string;
  total: number;
};

export default function SummaryScreen() {
  // ✅ STATE (top level only)
  const [monthly, setMonthly] = useState<MonthlySummary[]>([]);
  const [categoryBreakdown, setCategoryBreakdown] =
    useState<CategorySummary[]>([]);

  // ✅ DATA LOADER
  async function loadSummary() {
    const yearMonth = new Date().toISOString().slice(0, 7);

    setMonthly(await getMonthlyExpenseSummary());
    setCategoryBreakdown(
      await getCategoryBreakdownForMonth(yearMonth)
    );
  }

  // ✅ AUTO REFRESH ON TAB FOCUS
  useFocusEffect(
    useCallback(() => {
      loadSummary();
    }, [])
  );

  // ✅ RENDER
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <ThemedView style={styles.header}>
          <ThemedText type="title">Summary</ThemedText>
        </ThemedView>
      }
    >
      {/* Monthly Summary */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Monthly Expenses</ThemedText>
        {monthly.length === 0 && (
          <ThemedText>No data yet</ThemedText>
        )}
        {monthly.map((m) => (
          <ThemedText key={m.month}>
            {m.month} → ₹ {m.totalExpense}
          </ThemedText>
        ))}
      </ThemedView>

      {/* Category Breakdown */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">
          Category Breakdown (This Month)
        </ThemedText>
        {categoryBreakdown.length === 0 && (
          <ThemedText>No data yet</ThemedText>
        )}
        {categoryBreakdown.map((c) => (
          <ThemedText key={c.categoryId}>
            {c.categoryName} → ₹ {c.total}
          </ThemedText>
        ))}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 16,
  },
  section: {
    marginBottom: 16,
    gap: 6,
  },
});
