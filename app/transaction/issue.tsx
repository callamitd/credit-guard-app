import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Platform, KeyboardAvoidingView } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { issueGoods, getRetailers } from '../../services/api';

export default function IssueGoodsScreen() {
    const router = useRouter();
    const [retailer, setRetailer] = useState('');
    const [retailerName, setRetailerName] = useState('');
    const [retailersList, setRetailersList] = useState<any[]>([]);
    const [filteredRetailers, setFilteredRetailers] = useState<any[]>([]);
    const [showList, setShowList] = useState(false);
    const [goods, setGoods] = useState('');
    const [quantity, setQuantity] = useState('');
    const [value, setValue] = useState('');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [notes, setNotes] = useState('');

    useEffect(() => {
        fetchRetailers();
    }, []);

    const fetchRetailers = async () => {
        try {
            const data = await getRetailers();
            setRetailersList(data);
        } catch (error) {
            console.log('Error fetching retailers', error);
        }
    };

    const handleSearch = (text: string) => {
        setRetailerName(text);
        if (text.length > 0) {
            const filtered = retailersList.filter(r =>
                r.name.toLowerCase().includes(text.toLowerCase()) ||
                r.shopName.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredRetailers(filtered);
            setShowList(true);
        } else {
            setShowList(false);
        }
    };

    const selectRetailer = (item: any) => {
        setRetailer(item._id);
        setRetailerName(item.name);
        setShowList(false);
    };

    const handleSave = async () => {
        if (!retailer || !goods || !value) {
            Alert.alert('Validation Error', 'Please fill all required fields (Retailer, Goods, Value).');
            return;
        }

        try {
            await issueGoods({
                retailerId: retailer, // Assuming retailer ID is entered for now
                items: goods,
                quantity,
                amount: value,
                expectedRepaymentDate: date,
                notes
            });
            Alert.alert('Success', 'Transaction Recorded Successfully!', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to record transaction');
        }
    };

    const onChangeDate = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === 'ios');
        setDate(currentDate);
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
                    <Text className="text-white text-xl font-bold">Issue Goods</Text>
                </View>

                <ScrollView className="p-4">
                    {/* Retailer Selection */}
                    <View className="mb-4 z-50">
                        <Text className="text-slate-300 mb-1 ml-1">Select Retailer *</Text>
                        <View className="flex-row gap-2">
                            <TextInput
                                className="flex-1 bg-slate-800 text-white p-4 rounded-xl border border-slate-700"
                                placeholder="Search Retailer..."
                                placeholderTextColor="#64748b"
                                value={retailerName}
                                onChangeText={handleSearch}
                                onFocus={() => {
                                    if (retailersList.length > 0) {
                                        setFilteredRetailers(retailersList);
                                        setShowList(true);
                                    }
                                }}
                            />

                        </View>
                        {showList && (
                            <View className="absolute top-24 left-0 right-0 bg-slate-800 border border-slate-700 rounded-xl max-h-48 z-50 shadow-lg">
                                <ScrollView nestedScrollEnabled={true} keyboardShouldPersistTaps="handled">
                                    {filteredRetailers.map((item) => (
                                        <TouchableOpacity
                                            key={item._id}
                                            className="p-4 border-b border-slate-700"
                                            onPress={() => selectRetailer(item)}
                                        >
                                            <Text className="text-white font-bold">{item.name}</Text>
                                            <Text className="text-slate-400 text-xs">{item.shopName}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        )}
                    </View>

                    {/* Goods Description */}
                    <View className="mb-4">
                        <Text className="text-slate-300 mb-1 ml-1">Goods / Description *</Text>
                        <TextInput
                            className="bg-slate-800 text-white p-4 rounded-xl border border-slate-700"
                            placeholder="Enter item details"
                            placeholderTextColor="#64748b"
                            value={goods}
                            onChangeText={setGoods}
                        />
                    </View>

                    <View className="flex-row gap-4 mb-4">
                        {/* Quantity */}
                        <View className="flex-1">
                            <Text className="text-slate-300 mb-1 ml-1">Quantity</Text>
                            <TextInput
                                className="bg-slate-800 text-white p-4 rounded-xl border border-slate-700"
                                placeholder="Qty"
                                placeholderTextColor="#64748b"
                                keyboardType="numeric"
                                value={quantity}
                                onChangeText={setQuantity}
                            />
                        </View>

                        {/* Value */}
                        <View className="flex-1">
                            <Text className="text-slate-300 mb-1 ml-1">Value (₹) *</Text>
                            <TextInput
                                className="bg-slate-800 text-white p-4 rounded-xl border border-slate-700"
                                placeholder="Amount"
                                placeholderTextColor="#64748b"
                                keyboardType="numeric"
                                value={value}
                                onChangeText={setValue}
                            />
                        </View>
                    </View>

                    {/* Repayment Date */}
                    <View className="mb-4">
                        <Text className="text-slate-300 mb-1 ml-1">Expected Repayment Date</Text>
                        <TouchableOpacity
                            onPress={() => setShowDatePicker(true)}
                            className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex-row justify-between items-center"
                        >
                            <Text className="text-white">{date.toLocaleDateString()}</Text>
                            <Ionicons name="calendar-outline" size={20} color="#94a3b8" />
                        </TouchableOpacity>
                        {showDatePicker && (
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={date}
                                mode="date"
                                is24Hour={true}
                                display="default"
                                onChange={onChangeDate}
                            />
                        )}
                    </View>

                    {/* Notes */}
                    <View className="mb-8">
                        <Text className="text-slate-300 mb-1 ml-1">Notes</Text>
                        <TextInput
                            className="bg-slate-800 text-white p-4 rounded-xl border border-slate-700 h-24"
                            placeholder="Add any additional notes..."
                            placeholderTextColor="#64748b"
                            multiline
                            textAlignVertical="top"
                            value={notes}
                            onChangeText={setNotes}
                        />
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
                            <Text className="text-white text-center font-bold">Save</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
