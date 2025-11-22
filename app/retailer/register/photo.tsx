import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useRegistration } from '../../../context/RegistrationContext';
import { Ionicons } from '@expo/vector-icons';

export default function PhotoCaptureScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const [photo, setPhoto] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const cameraRef = useRef<CameraView>(null);
    const router = useRouter();
    const { updateData } = useRegistration();

    if (!permission) {
        return <View className="flex-1 bg-slate-900" />;
    }

    if (!permission.granted) {
        return (
            <View className="flex-1 bg-slate-900 justify-center items-center p-6">
                <Text className="text-white text-center mb-4">We need your permission to show the camera</Text>
                <TouchableOpacity onPress={requestPermission} className="bg-blue-600 px-6 py-3 rounded-xl">
                    <Text className="text-white font-bold">Grant Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const takePicture = async () => {
        if (cameraRef.current) {
            setLoading(true);
            try {
                const photoData = await cameraRef.current.takePictureAsync({ quality: 0.7 });

                // Get Location
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permission Denied', 'Location permission is required to tag the photo.');
                    setLoading(false);
                    return;
                }

                let location = await Location.getCurrentPositionAsync({});

                setPhoto(photoData?.uri ?? null);
                updateData({
                    photoUri: photoData?.uri ?? null,
                    location: {
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                    },
                    timestamp: new Date().toISOString(),
                });
            } catch (error) {
                console.error(error);
                Alert.alert('Error', 'Failed to capture photo or location.');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleNext = () => {
        if (photo) {
            router.push('/retailer/register/consent');
        }
    };

    const handleRetake = () => {
        setPhoto(null);
        updateData({ photoUri: null, location: null, timestamp: null });
    };

    if (photo) {
        return (
            <View className="flex-1 bg-slate-900 p-4">
                <Text className="text-slate-400 mb-4 text-center">Step 2 of 4: Review Photo</Text>
                <View className="flex-1 bg-black rounded-2xl overflow-hidden mb-6 relative">
                    <Image source={{ uri: photo }} className="flex-1" resizeMode="cover" />
                    <View className="absolute bottom-4 left-4 bg-black/60 px-3 py-1 rounded-lg">
                        <Text className="text-white text-xs">📍 GPS Tagged</Text>
                        <Text className="text-white text-xs">🕒 {new Date().toLocaleTimeString()}</Text>
                    </View>
                </View>

                <View className="flex-row gap-4 mb-6">
                    <TouchableOpacity
                        onPress={handleRetake}
                        className="flex-1 bg-slate-700 py-4 rounded-xl active:bg-slate-600"
                    >
                        <Text className="text-white text-center font-bold">Retake</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleNext}
                        className="flex-1 bg-blue-600 py-4 rounded-xl active:bg-blue-700"
                    >
                        <Text className="text-white text-center font-bold">Next</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-slate-900">
            <CameraView
                ref={cameraRef}
                style={{ flex: 1 }}
                facing="front"
                mode="picture"
            >
                <View className="flex-1 bg-black/30 justify-center items-center">
                    {/* Face Guide Overlay */}
                    <View className="w-64 h-80 border-2 border-white/50 rounded-3xl border-dashed" />
                    <Text className="text-white/80 mt-4 bg-black/40 px-4 py-2 rounded-full">
                        Position face within the frame
                    </Text>
                </View>

                <View className="p-6 pb-10 bg-black/50 flex-row justify-between items-center">
                    <TouchableOpacity
                        onPress={() => router.replace('/(tabs)/home')}
                        className="p-4"
                    >
                        <Text className="text-white font-bold">Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={takePicture}
                        disabled={loading}
                        className="w-20 h-20 bg-white rounded-full border-4 border-slate-300 items-center justify-center"
                    >
                        {loading ? (
                            <ActivityIndicator color="black" />
                        ) : (
                            <View className="w-16 h-16 bg-white rounded-full border-2 border-black" />
                        )}
                    </TouchableOpacity>

                    <View className="w-16" />
                </View>
            </CameraView>
        </View>
    );
}
