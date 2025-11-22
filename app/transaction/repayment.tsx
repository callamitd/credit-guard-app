import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Platform, KeyboardAvoidingView } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { recordRepayment } from '../../services/api';

export default function RepaymentScreen() {
    const router = useRouter();
    const [retailer, setRetailer] = useState('');
    const [amount, setAmount] = useState('');
    const [mode, setMode] = useState<'Cash' | 'UPI' | 'Bank'>('Cash');

    // Mock Data
    const outstandingBalance = 50000;
    const [remainingBalance, setRemainingBalance] = useState(outstandingBalance);

    useEffect(() => {
        const repayment = parseFloat(amount) || 0;
        setRemainingBalance(outstandingBalance - repayment);
    }, [amount]);

    const handleSave = async () => {
        if (!retailer || !amount) {
            Alert.alert('Validation Error', 'Please select a retailer and enter an amount.');
            return;
        }

        const repayment = parseFloat(amount);
        if (repayment > outstandingBalance) {
            Alert.alert('Warning', 'Repayment amount cannot exceed outstanding balance.');
            return;
        }

        try {
            await recordRepayment({
                retailerId: retailer, // Assuming retailer ID is entered
                amount,
                mode: mode.toLowerCase(),
                transactionRef: 'REF-' + Date.now(), // Generate a dummy ref for now
                notes: 'Repayment via app'
            });
            Alert.alert('Success', 'Repayment Recorded Successfully!', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to record repayment');
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-900">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <View className="flex-row items-center p-4 border-b border-slate-800 bg-slate-900">
                    <TouchableOpacity onPress={() => router.back()} className="mr-4">
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text className="text-white text-xl font-bold">Record Repayment</Text>
                </View>

                <ScrollView className="p-4">
                    {/* Retailer Selection */}
                    <View className="mb-6">
                        <Text className="text-slate-300 mb-1 ml-1">Select Retailer *</Text>
                        <View className="flex-row gap-2">
                            <TextInput
                                className="flex-1 bg-slate-800 text-white p-4 rounded-xl border border-slate-700"
                                placeholder="Search Retailer..."
                                placeholderTextColor="#64748b"
                                autoFocus
                                value={retailer}
                                onChangeText={setRetailer}
                            />
                            <TouchableOpacity className="bg-blue-600 w-14 rounded-xl items-center justify-center">
                                <Ionicons name="search" size={24} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Outstanding Balance Card */}
                    <View className="bg-slate-800 p-6 rounded-2xl border border-slate-700 mb-6 items-center">
                        <Text className="text-slate-400 mb-2">Outstanding Balance</Text>
                        <Text className="text-red-400 text-3xl font-bold">
                            ₹{outstandingBalance.toLocaleString('en-IN')}
                        </Text>
                    </View>

                    {/* Repayment Amount */}
                    <View className="mb-6">
                        <Text className="text-slate-300 mb-1 ml-1">Repayment Amount (₹) *</Text>
                        <TextInput
                            className="bg-slate-800 text-white p-4 rounded-xl border border-slate-700 text-xl font-semibold"
                            placeholder="0"
                            placeholderTextColor="#64748b"
                            keyboardType="numeric"
                            value={amount}
                            onChangeText={setAmount}
                        />
                    </View>

                    {/* Payment Mode */}
                    <View className="mb-6">
                        <Text className="text-slate-300 mb-2 ml-1">Payment Mode</Text>
                        <View className="flex-row bg-slate-800 p-1 rounded-xl border border-slate-700">
                            {['Cash', 'UPI', 'Bank'].map((m) => (
                                <TouchableOpacity
                                    key={m}
                                    onPress={() => setMode(m as any)}
                                    className={`flex-1 py-3 rounded-lg ${mode === m ? 'bg-blue-600' : 'bg-transparent'}`}
                                >
                                    <Text className={`text-center font-semibold ${mode === m ? 'text-white' : 'text-slate-400'}`}>
                                        {m}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Remaining Balance Preview */}
                    <View className="flex-row justify-between items-center mb-8 px-2">
                        <Text className="text-slate-400">Remaining Balance:</Text>
                        <Text className={`text-xl font-bold ${remainingBalance < 0 ? 'text-red-500' : 'text-green-400'}`}>
                            ₹{remainingBalance.toLocaleString('en-IN')}
                        </Text>
                    </View>

                    {/* Actions */}
                    <View className="flex-row gap-4 mb-10">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="flex-1 bg-slate-700 py-4 rounded-xl active:bg-slate-600"
                        >
                            <Text className="text-white text-center font-bold">Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleSave}
                            className="flex-1 bg-blue-600 py-4 rounded-xl active:bg-blue-700"
                        >
                            <Text className="text-white text-center font-bold">
                                {parseFloat(amount) >= outstandingBalance ? 'Mark as Paid' : 'Record Payment'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
