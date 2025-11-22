import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { getRetailer } from '../../services/api';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SearchResultScreen() {
    const router = useRouter();

    const { id } = useLocalSearchParams();
    const [retailer, setRetailer] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRetailer = async () => {
            try {
                if (id) {
                    const data = await getRetailer(id as string);
                    setRetailer(data);
                }
            } catch (error) {
                console.error('Failed to fetch retailer', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRetailer();
    }, [id]);

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-slate-900 items-center justify-center">
                <Text className="text-white">Loading...</Text>
            </SafeAreaView>
        );
    }

    if (!retailer) {
        return (
            <SafeAreaView className="flex-1 bg-slate-900 items-center justify-center">
                <Text className="text-white">Retailer not found</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-slate-900">
            <View className="flex-row items-center p-4 border-b border-slate-800 bg-slate-900">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-xl font-bold">Search Result</Text>
            </View>

            <ScrollView className="p-4">
                {/* Match Score Card */}
                <View className="bg-slate-800 rounded-2xl p-6 items-center mb-6 border border-slate-700">
                    <View className="w-32 h-32 rounded-full border-4 border-green-500 mb-4 overflow-hidden relative">
                        {/* Placeholder for actual image */}
                        <View className="w-full h-full bg-slate-600 items-center justify-center">
                            <Ionicons name="person" size={64} color="#94a3b8" />
                        </View>
                        <View className="absolute bottom-0 w-full bg-green-600 py-1">
                            <Text className="text-white text-center text-xs font-bold">{retailer.matchScore}% Match</Text>
                        </View>
                    </View>

                    <Text className="text-white text-2xl font-bold mb-1">{retailer.name}</Text>
                    <Text className="text-slate-400 text-base mb-4">{retailer.shopName}</Text>

                    {retailer.isFlagged && (
                        <View className="flex-row items-center bg-red-500/20 px-4 py-2 rounded-full border border-red-500/50">
                            <Ionicons name="warning" size={16} color="#f87171" />
                            <Text className="text-red-400 ml-2 font-bold">Flagged: {retailer.flagReason}</Text>
                        </View>
                    )}
                </View>

                {/* Details */}
                <View className="bg-slate-800 rounded-2xl p-6 mb-6 border border-slate-700">
                    <View className="mb-4">
                        <Text className="text-slate-400 text-sm mb-1">Address</Text>
                        <Text className="text-white text-base">{retailer.address}</Text>
                    </View>
                    <View className="h-[1px] bg-slate-700 my-2" />
                    <View className="mt-2">
                        <Text className="text-slate-400 text-sm mb-1">Outstanding Balance</Text>
                        <Text className="text-red-400 text-2xl font-bold">₹{retailer.outstandingBalance.toLocaleString('en-IN')}</Text>
                    </View>
                </View>

                {/* Actions */}
                <View className="flex-row gap-4 mb-10">
                    <TouchableOpacity
                        onPress={() => router.push('/(tabs)/details')} // Or profile
                        className="flex-1 bg-slate-700 py-4 rounded-xl active:bg-slate-600"
                    >
                        <Text className="text-white text-center font-bold">View Details</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => router.push('/transaction/issue')}
                        className="flex-1 bg-blue-600 py-4 rounded-xl active:bg-blue-700"
                    >
                        <Text className="text-white text-center font-bold">Issue Goods</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
