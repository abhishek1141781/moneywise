import { StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import { useEffect, useState } from 'react';
import {
  getMonthlyExpenseSummary,
  getCategoryBreakdownForMonth,
} from '@/db/repositories/summaryRepo';

export default function SummaryScreen() {
  const [monthly, setMonthly] = useState<any[]>([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState<any[]>([]);

  useEffect(() => {
    async function loadSummary() {
      const yearMonth = new Date().toISOString().slice(0, 7);

      setMonthly(await getMonthlyExpenseSummary());
      setCategoryBreakdown(
        await getCategoryBreakdownForMonth(yearMonth)
      );
    }

    loadSummary();
  }, []);

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
