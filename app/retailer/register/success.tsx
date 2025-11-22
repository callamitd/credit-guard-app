import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useRegistration } from '../../../context/RegistrationContext';
import { useEffect, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function SuccessScreen() {
    const router = useRouter();
    const { resetData } = useRegistration();
    const scaleAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 5,
            tension: 40,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleGoHome = () => {
        resetData();
        router.dismissAll();
        router.replace('/(tabs)/home');
    };

    const handleIssueGoods = () => {
        resetData();
        // Navigate to Issue Goods flow (placeholder)
        router.dismissAll();
        router.replace('/(tabs)/home');
    };

    return (
        <View className="flex-1 bg-slate-900 justify-center items-center p-6">
            <Animated.View
                style={{ transform: [{ scale: scaleAnim }] }}
                className="bg-green-500 w-32 h-32 rounded-full items-center justify-center mb-8 shadow-lg shadow-green-500/50"
            >
                <Ionicons name="checkmark" size={80} color="white" />
            </Animated.View>

            <Text className="text-white text-3xl font-bold text-center mb-2">Success!</Text>
            <Text className="text-slate-400 text-center text-lg mb-10">
                Retailer Registered Successfully
            </Text>

            <View className="w-full gap-4">
                <TouchableOpacity
                    onPress={handleIssueGoods}
                    className="bg-blue-600 py-4 rounded-xl active:bg-blue-700 shadow-lg"
                >
                    <Text className="text-white text-center font-bold text-lg">Issue Goods</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleGoHome}
                    className="bg-slate-700 py-4 rounded-xl active:bg-slate-600"
                >
                    <Text className="text-white text-center font-bold text-lg">Go Home</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
