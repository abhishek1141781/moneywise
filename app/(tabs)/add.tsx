import { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import { getAccounts } from '@/db/repositories/accountRepo';
import { getCategories } from '@/db/repositories/categoryRepo';
import { addTransaction } from '@/db/repositories/transactionRepo';

export default function AddTransactionScreen() {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'debit' | 'credit'>('debit');
  const [note, setNote] = useState('');

  const [accounts, setAccounts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  const [accountId, setAccountId] = useState<number | null>(null);
  const [categoryId, setCategoryId] = useState<number | null>(null);

  useEffect(() => {
    async function loadData() {
      setAccounts(await getAccounts());
      setCategories(await getCategories());
    }
    loadData();
  }, []);

  async function handleSave() {
    if (!amount || !accountId) {
      Alert.alert('Error', 'Amount and account are required');
      return;
    }

    await addTransaction(
      Number(amount),
      type,
      accountId,
      categoryId ?? undefined,
      note
    );

    Alert.alert('Saved', 'Transaction added');

    setAmount('');
    setNote('');
    setCategoryId(null);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ThemedView style={styles.container}>
        <ThemedText type="title">Add Transaction</ThemedText>

        {/* Amount */}
        <TextInput
          placeholder="Amount"
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          style={styles.input}
        />

        {/* Type */}
        <ThemedText style={styles.label}>Type</ThemedText>
        <View style={styles.row}>
          {(['debit', 'credit'] as const).map((t) => (
            <Pressable
              key={t}
              onPress={() => setType(t)}
              style={[
                styles.toggleButton,
                type === t && styles.toggleSelected,
              ]}
            >
              <ThemedText
                style={type === t ? styles.toggleTextSelected : styles.toggleText}
              >
                {t.toUpperCase()}
              </ThemedText>
            </Pressable>
          ))}
        </View>

        {/* Account */}
        <ThemedText style={styles.label}>Account</ThemedText>
        {accounts.map((a) => (
          <Pressable
            key={a.id}
            onPress={() => setAccountId(a.id)}
            style={[
              styles.choiceButton,
              accountId === a.id && styles.choiceSelected,
            ]}
          >
            <ThemedText>{a.bankName}</ThemedText>
          </Pressable>
        ))}

        {/* Category */}
        <ThemedText style={styles.label}>Category</ThemedText>
        {categories.map((c) => (
          <Pressable
            key={c.id}
            onPress={() => setCategoryId(c.id)}
            style={[
              styles.choiceButton,
              categoryId === c.id && styles.choiceSelected,
            ]}
          >
            <ThemedText>{c.name}</ThemedText>
          </Pressable>
        ))}

        {/* Note */}
        <TextInput
          placeholder="Note (optional)"
          placeholderTextColor="#9CA3AF"
          value={note}
          onChangeText={setNote}
          style={styles.input}
        />

        {/* Save */}
        <Pressable onPress={handleSave} style={styles.saveButton}>
          <ThemedText style={styles.saveText}>
            SAVE TRANSACTION
          </ThemedText>
        </Pressable>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    padding: 16,
    gap: 14,
  },
  label: {
    marginTop: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#111827',
    color: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#374151',
    padding: 12,
    borderRadius: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  toggleButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3B82F6',
    alignItems: 'center',
  },
  toggleSelected: {
    backgroundColor: '#3B82F6',
  },
  toggleText: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  toggleTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  choiceButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3B82F6',
    marginBottom: 6,
  },
  choiceSelected: {
    backgroundColor: '#3B82F6',
  },
  saveButton: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: '#22C55E', // GREEN → primary action
    alignItems: 'center',
  },
  saveText: {
    color: '#052e16',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
