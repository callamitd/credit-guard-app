import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FaceScanScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const router = useRouter();
    const [scanning, setScanning] = useState(false);
    const scanAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (scanning) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(scanAnim, {
                        toValue: 1,
                        duration: 1500,
                        easing: Easing.linear,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scanAnim, {
                        toValue: 0,
                        duration: 1500,
                        easing: Easing.linear,
                        useNativeDriver: true,
                    }),
                ])
            ).start();

            // Simulate search delay
            const timer = setTimeout(() => {
                router.replace('/search/result');
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [scanning]);

    if (!permission) {
        return <View className="flex-1 bg-slate-900" />;
    }

    if (!permission.granted) {
        return (
            <View className="flex-1 bg-slate-900 justify-center items-center p-6">
                <Text className="text-white text-center mb-4">Camera permission is needed for face search.</Text>
                <TouchableOpacity onPress={requestPermission} className="bg-blue-600 px-6 py-3 rounded-xl">
                    <Text className="text-white font-bold">Grant Permission</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.back()} className="mt-4">
                    <Text className="text-slate-400">Cancel</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const handleScan = () => {
        setScanning(true);
    };

    return (
        <View className="flex-1 bg-black">
            <CameraView style={{ flex: 1 }} facing="front">
                <SafeAreaView className="flex-1">
                    <View className="flex-row justify-between items-center p-4">
                        <TouchableOpacity onPress={() => router.back()} className="bg-black/40 p-2 rounded-full">
                            <Ionicons name="close" size={24} color="white" />
                        </TouchableOpacity>
                        <Text className="text-white font-bold text-lg bg-black/40 px-3 py-1 rounded-full">
                            Face Search
                        </Text>
                        <View className="w-10" />
                    </View>

                    <View className="flex-1 justify-center items-center">
                        <View className="w-72 h-72 border-2 border-white/30 rounded-full relative overflow-hidden">
                            {scanning && (
                                <Animated.View
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: 2,
                                        backgroundColor: '#4ade80',
                                        shadowColor: '#4ade80',
                                        shadowOpacity: 1,
                                        shadowRadius: 10,
                                        transform: [{
                                            translateY: scanAnim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [0, 288] // Height of the circle
                                            })
                                        }]
                                    }}
                                />
                            )}
                        </View>
                        <Text className="text-white/80 mt-6 bg-black/40 px-4 py-2 rounded-full">
                            {scanning ? 'Searching Database...' : 'Align face within frame'}
                        </Text>
                    </View>

                    <View className="p-8 items-center">
                        {!scanning && (
                            <TouchableOpacity
                                onPress={handleScan}
                                className="w-20 h-20 bg-white rounded-full border-4 border-slate-300 items-center justify-center"
                            >
                                <View className="w-16 h-16 bg-white rounded-full border-2 border-black" />
                            </TouchableOpacity>
                        )}
                    </View>
                </SafeAreaView>
            </CameraView>
        </View>
    );
}
