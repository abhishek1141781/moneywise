import { useEffect, useState } from 'react';
import {
    View,
    TextInput,
    Pressable,
    StyleSheet,
    Alert,
    ScrollView,
    Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import { getAccounts } from '@/db/repositories/accountRepo';
import { createCategory, getCategories } from '@/db/repositories/categoryRepo';
import { addTransaction } from '@/db/repositories/transactionRepo';

type Category = {
    id: number;
    name: string;
    type: 'debit' | 'credit';
    color: string;
    icon?: string
};


export default function AddTransactionScreen() {
    const router = useRouter();

    const [amount, setAmount] = useState('');
    const [type, setType] = useState<'debit' | 'credit'>('debit');
    const [note, setNote] = useState('');

    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [accounts, setAccounts] = useState<any[]>([]);

    // provideed a type to categories
    // const [categories, setCategories] = useState<any[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);


    const [accountId, setAccountId] = useState<number | null>(null);
    const [categoryId, setCategoryId] = useState<number | null>(null);

    const [showAccountModal, setShowAccountModal] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);

    // add new category OTG
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryType, setNewCategoryType] =
        useState<'debit' | 'credit'>('debit');


    useEffect(() => {
        async function loadData() {
            setAccounts(await getAccounts());
            setCategories(await getCategories());
        }
        loadData();
    }, []);

    function validate() {
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            Alert.alert('Invalid amount', 'Enter a valid positive number');
            return false;
        }
        if (!accountId) {
            Alert.alert('Missing account', 'Please select an account');
            return false;
        }
        return true;
    }

    async function handleSave() {
        if (!validate()) return;

        await addTransaction(
            Number(amount),
            type,
            accountId!,
            categoryId ?? undefined,
            note
        );

        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        Alert.alert('Saved', 'Transaction added');

        // reset form
        setAmount('');
        setNote('');
        setCategoryId(null);
        setDate(new Date());

        // // 🔄 Auto-refresh summary
        // router.replace('/(tabs)');
    }

    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView contentContainerStyle={styles.scroll}>
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
                                    styles.toggle,
                                    type === t && styles.toggleSelected,
                                ]}
                            >
                                <ThemedText
                                    style={type === t ? styles.selectedText : styles.toggleText}
                                >
                                    {t.toUpperCase()}
                                </ThemedText>
                            </Pressable>
                        ))}
                    </View>

                    {/* Date */}
                    <Pressable
                        onPress={() => setShowDatePicker(true)}
                        style={styles.input}
                    >
                        <ThemedText>
                            Date: {date.toDateString()}
                        </ThemedText>
                    </Pressable>

                    {showDatePicker && (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            onChange={(_, d) => {
                                setShowDatePicker(false);
                                if (d) setDate(d);
                            }}
                        />
                    )}

                    {/* Account Dropdown */}
                    <Pressable
                        style={styles.input}
                        onPress={() => setShowAccountModal(true)}
                    >
                        <ThemedText>
                            {accountId
                                ? accounts.find(a => a.id === accountId)?.bankName
                                : 'Select Account'}
                        </ThemedText>
                    </Pressable>

                    {/* Category Dropdown */}
                    <Pressable
                        style={styles.input}
                        onPress={() => setShowCategoryModal(true)}
                    >
                        <ThemedText>
                            {categoryId
                                ? categories.find(c => c.id === categoryId)?.name
                                : 'Select Category'}
                        </ThemedText>
                    </Pressable>

                    {/* Note */}
                    <TextInput
                        placeholder="Note (optional)"
                        placeholderTextColor="#9CA3AF"
                        value={note}
                        onChangeText={setNote}
                        style={styles.input}
                    />

                    {/* Save */}
                    <Pressable onPress={handleSave} style={styles.save}>
                        <ThemedText style={styles.saveText}>
                            SAVE TRANSACTION
                        </ThemedText>
                    </Pressable>
                </ThemedView>
            </ScrollView>

            {/* Account Modal */}
            <Modal visible={showAccountModal} animationType="slide">
                <ScrollView style={styles.modal}>
                    {accounts.map(a => (
                        <Pressable
                            key={a.id}
                            style={styles.modalItem}
                            onPress={() => {
                                setAccountId(a.id);
                                setShowAccountModal(false);
                            }}
                        >
                            <ThemedText>{a.bankName}</ThemedText>
                        </Pressable>
                    ))}
                </ScrollView>
            </Modal>

            {/* Category Modal */}
            {/* <Modal visible={showCategoryModal} animationType="slide">
                <ScrollView style={styles.modal}>
                    {categories.map(c => (
                        <Pressable
                            key={c.id}
                            style={styles.modalItem}
                            onPress={() => {
                                setCategoryId(c.id);
                                setShowCategoryModal(false);
                            }}
                        >
                            <ThemedText>{c.name}</ThemedText>
                        </Pressable>
                    ))}
                </ScrollView>
            </Modal> */}

            {/* Category Modal */}
            <Modal visible={showCategoryModal} animationType="slide">
                <SafeAreaView style={{ flex: 1 }}>
                    <ScrollView style={styles.modal}>
                        {!isAddingCategory ? (
                            <>
                                {/* Existing categories */}
                                {categories.map(c => (
                                    <Pressable
                                        key={c.id}
                                        style={styles.modalItem}
                                        onPress={() => {
                                            setCategoryId(c.id);
                                            setShowCategoryModal(false);
                                        }}
                                    >
                                        <ThemedText>{c.name}</ThemedText>
                                    </Pressable>
                                ))}

                                {/* Add new category */}
                                <Pressable
                                    style={styles.addNew}
                                    onPress={() => setIsAddingCategory(true)}
                                >
                                    <ThemedText style={{ fontWeight: '700' }}>
                                        + Add New Category
                                    </ThemedText>
                                </Pressable>
                            </>
                        ) : (
                            <>
                                <ThemedText type="subtitle">New Category</ThemedText>

                                <TextInput
                                    placeholder="Category name"
                                    placeholderTextColor="#9CA3AF"
                                    value={newCategoryName}
                                    onChangeText={setNewCategoryName}
                                    style={styles.input}
                                />

                                {/* Type selector */}
                                <View style={styles.row}>
                                    {(['debit', 'credit'] as const).map(t => (
                                        <Pressable
                                            key={t}
                                            onPress={() => setNewCategoryType(t)}
                                            style={[
                                                styles.toggle,
                                                newCategoryType === t && styles.toggleSelected,
                                            ]}
                                        >
                                            <ThemedText
                                                style={
                                                    newCategoryType === t
                                                        ? styles.selectedText
                                                        : styles.toggleText
                                                }
                                            >
                                                {t.toUpperCase()}
                                            </ThemedText>
                                        </Pressable>
                                    ))}
                                </View>

                                {/* Save category */}
                                <Pressable
                                    style={styles.save}
                                    onPress={async () => {
                                        if (!newCategoryName.trim()) {
                                            Alert.alert('Error', 'Category name required');
                                            return;
                                        }

                                        await createCategory(
                                            newCategoryName.trim(),
                                            newCategoryType,
                                            '#3B82F6'
                                        );

                                        // reload categories
                                        const updated = await getCategories();
                                        setCategories(updated);

                                        // auto-select newly added category
                                        const added = updated.find(
                                            c => c.name === newCategoryName.trim()
                                        );
                                        if (added) setCategoryId(added.id);

                                        // reset state
                                        setNewCategoryName('');
                                        setNewCategoryType('debit');
                                        setIsAddingCategory(false);
                                        setShowCategoryModal(false);
                                    }}
                                >
                                    <ThemedText style={styles.saveText}>
                                        SAVE CATEGORY
                                    </ThemedText>
                                </Pressable>

                                {/* Cancel */}
                                <Pressable
                                    onPress={() => setIsAddingCategory(false)}
                                    style={{ marginTop: 12 }}
                                >
                                    <ThemedText>Cancel</ThemedText>
                                </Pressable>
                            </>
                        )}
                    </ScrollView>
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1 },
    scroll: { paddingBottom: 24 },
    container: { padding: 16, gap: 14 },
    label: { fontWeight: '600' },
    row: { flexDirection: 'row', gap: 12 },
    input: {
        backgroundColor: '#111827',
        color: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#374151',
        padding: 12,
        borderRadius: 8,
    },
    toggle: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#3B82F6',
        alignItems: 'center',
    },
    toggleSelected: { backgroundColor: '#3B82F6' },
    toggleText: { color: '#3B82F6' },
    selectedText: { color: '#FFF', fontWeight: '700' },
    save: {
        marginTop: 16,
        padding: 14,
        borderRadius: 10,
        backgroundColor: '#22C55E',
        alignItems: 'center',
    },
    saveText: {
        color: '#052e16',
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    modal: { padding: 16 },
    modalItem: {
        padding: 14,
        borderBottomWidth: 1,
        borderColor: '#374151',
    },
    addNew: {
        marginTop: 16,
        padding: 14,
        borderWidth: 1,
        borderColor: '#3B82F6',
        borderRadius: 8,
        alignItems: 'center',
    },
});
