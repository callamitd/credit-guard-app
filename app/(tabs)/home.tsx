import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
    const router = useRouter();
    const menuItems = [
        { id: 1, title: 'Register Retailer', icon: 'person-add-outline', color: 'bg-blue-600' },
        { id: 2, title: 'Issue Goods', icon: 'cube-outline', color: 'bg-indigo-600' },
        { id: 3, title: 'Record Repayment', icon: 'cash-outline', color: 'bg-green-600' },
        { id: 4, title: 'Flag Retailer', icon: 'flag-outline', color: 'bg-red-600' },
        { id: 5, title: 'Search / Scan', icon: 'scan-outline', color: 'bg-purple-600' },
        { id: 6, title: 'Reports', icon: 'bar-chart-outline', color: 'bg-orange-600' },
    ];

    return (
        <SafeAreaView className="flex-1 bg-slate-900">
            <ScrollView className="p-4">
                {/* Header */}
                <View className="flex-row justify-between items-center mb-8 mt-2">
                    <View>
                        <Text className="text-slate-400 text-sm">Welcome back,</Text>
                        <Text className="text-white text-2xl font-bold">Amit Deshpande</Text>
                        <View className="flex-row items-center mt-1">
                            <Ionicons name="location-outline" size={14} color="#94a3b8" />
                            <Text className="text-slate-400 text-xs ml-1">Bangalore Main Branch</Text>
                        </View>
                    </View>
                    <View className="w-10 h-10 bg-slate-800 rounded-full items-center justify-center border border-slate-700">
                        <Ionicons name="notifications-outline" size={20} color="white" />
                    </View>
                </View>

                {/* Grid Layout */}
                <View className="flex-row flex-wrap justify-between">
                    {menuItems.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            className="w-[48%] bg-slate-800 rounded-2xl p-4 mb-4 border border-slate-700 items-center justify-center aspect-square shadow-lg"
                            activeOpacity={0.7}
                            onPress={() => {
                                if (item.id === 1) {
                                    router.push('/retailer/register');
                                } else if (item.id === 2) {
                                    router.push('/transaction/issue');
                                } else if (item.id === 3) {
                                    router.push('/transaction/repayment');
                                } else if (item.id === 4) {
                                    router.push('/retailer/flag');
                                } else if (item.id === 5) {
                                    router.push('/search/scan');
                                }
                            }}
                        >
                            <View className={`${item.color} w-14 h-14 rounded-full items-center justify-center mb-3 shadow-md`}>
                                <Ionicons name={item.icon as any} size={28} color="white" />
                            </View>
                            <Text className="text-white font-semibold text-center">{item.title}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Recent Activity Section (Optional, kept for context) */}
                <View className="mt-4">
                    <Text className="text-white text-lg font-bold mb-4">Recent Actions</Text>
                    <View className="bg-slate-800 rounded-xl p-4 border border-slate-700 flex-row items-center mb-3">
                        <View className="bg-green-500/20 p-2 rounded-lg mr-3">
                            <Ionicons name="cash-outline" size={20} color="#4ade80" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-white font-medium">Repayment Received</Text>
                            <Text className="text-slate-500 text-xs">Retailer: Shiva Electronics</Text>
                        </View>
                        <Text className="text-green-400 font-bold">+₹5,000</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
