import { View, Text, TouchableOpacity, ScrollView, FlatList, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

// Mock Data
const initialFlags = [
    { id: '1', retailer: 'Shiva Electronics', date: '2025-11-18', reason: 'Non-payment', status: 'Pending Review', notes: 'Payment overdue by 45 days.' },
    { id: '2', retailer: 'Lakshmi General Store', date: '2025-11-15', reason: 'Fraud', status: 'Published', notes: 'Fake GSTIN provided.' },
    { id: '3', retailer: 'Raju Kirana', date: '2025-11-10', reason: 'Abusive Behavior', status: 'Published', notes: 'Threatened delivery staff.' },
];

export default function FlagReviewScreen() {
    const router = useRouter();
    const [flags, setFlags] = useState(initialFlags);
    const [filter, setFilter] = useState('All');

    const handleApprove = (id: string) => {
        Alert.alert('Confirm', 'Publish this flag to the network?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Publish', onPress: () => {
                    setFlags(prev => prev.map(f => f.id === id ? { ...f, status: 'Published' } : f));
                }
            }
        ]);
    };

    const handleUnpublish = (id: string) => {
        setFlags(prev => prev.map(f => f.id === id ? { ...f, status: 'Unpublished' } : f));
    };

    const handleDelete = (id: string) => {
        Alert.alert('Delete Flag', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete', style: 'destructive', onPress: () => {
                    setFlags(prev => prev.filter(f => f.id !== id));
                }
            }
        ]);
    };

    const filteredFlags = filter === 'All' ? flags : flags.filter(f => f.status === filter);

    const renderItem = ({ item }: { item: typeof initialFlags[0] }) => (
        <View className="bg-slate-800 rounded-xl p-4 mb-4 border border-slate-700">
            <View className="flex-row justify-between items-start mb-2">
                <View>
                    <Text className="text-white font-bold text-lg">{item.retailer}</Text>
                    <Text className="text-slate-400 text-xs">{item.date}</Text>
                </View>
                <View className={`px-2 py-1 rounded-md ${item.status === 'Published' ? 'bg-red-500/20' : 'bg-yellow-500/20'}`}>
                    <Text className={`text-xs font-bold ${item.status === 'Published' ? 'text-red-400' : 'text-yellow-400'}`}>
                        {item.status}
                    </Text>
                </View>
            </View>

            <View className="flex-row items-center mb-2">
                <Text className="text-slate-300 text-sm font-semibold">Reason: </Text>
                <Text className="text-slate-300 text-sm">{item.reason}</Text>
            </View>

            <Text className="text-slate-400 text-sm italic mb-4">"{item.notes}"</Text>

            <View className="flex-row justify-end gap-2 pt-2 border-t border-slate-700">
                <TouchableOpacity onPress={() => handleDelete(item.id)} className="p-2">
                    <Ionicons name="trash-outline" size={20} color="#ef4444" />
                </TouchableOpacity>

                {item.status !== 'Published' ? (
                    <TouchableOpacity
                        onPress={() => handleApprove(item.id)}
                        className="bg-green-600 px-4 py-2 rounded-lg"
                    >
                        <Text className="text-white font-bold text-xs">Approve</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        onPress={() => handleUnpublish(item.id)}
                        className="bg-slate-600 px-4 py-2 rounded-lg"
                    >
                        <Text className="text-white font-bold text-xs">Unpublish</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-slate-900">
            <View className="flex-row items-center p-4 border-b border-slate-800 bg-slate-900">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-xl font-bold">Flag Review (Admin)</Text>
            </View>

            <View className="p-4">
                {/* Filter Tabs */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                    {['All', 'Pending Review', 'Published', 'Unpublished'].map((f) => (
                        <TouchableOpacity
                            key={f}
                            onPress={() => setFilter(f)}
                            className={`px-4 py-2 rounded-full mr-2 border ${filter === f ? 'bg-blue-600 border-blue-600' : 'bg-slate-800 border-slate-700'}`}
                        >
                            <Text className={filter === f ? 'text-white font-bold' : 'text-slate-400'}>{f}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <FlatList
                    data={filteredFlags}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    ListEmptyComponent={
                        <Text className="text-slate-500 text-center mt-10">No flags found.</Text>
                    }
                />
            </View>
        </SafeAreaView>
    );
}
