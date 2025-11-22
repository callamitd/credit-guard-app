import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Switch, Image, Platform, KeyboardAvoidingView } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

export default function FlagRetailerScreen() {
    const router = useRouter();
    const [retailer, setRetailer] = useState('');
    const [reason, setReason] = useState('Non-payment');
    const [notes, setNotes] = useState('');
    const [publish, setPublish] = useState(false);
    const [evidence, setEvidence] = useState<string | null>(null);

    const reasons = ['Non-payment', 'Fraud', 'Abusive Behavior', 'Other'];

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setEvidence(result.assets[0].uri);
        }
    };

    const handleSubmit = () => {
        if (!retailer) {
            Alert.alert('Validation Error', 'Please select a retailer.');
            return;
        }

        Alert.alert(
            'Flag Submitted',
            `Retailer ${retailer} has been flagged for ${reason}. Status: ${publish ? 'Published to Network' : 'Pending Review'}`,
            [
                { text: 'OK', onPress: () => router.back() }
            ]
        );
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
                    <Text className="text-white text-xl font-bold">Flag Retailer</Text>
                    <TouchableOpacity
                        onPress={() => router.push('/retailer/flag/review')}
                        className="ml-auto bg-slate-800 px-3 py-1 rounded-lg border border-slate-700"
                    >
                        <Text className="text-xs text-slate-400">Admin View</Text>
                    </TouchableOpacity>
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
                                <Ionicons name="scan-outline" size={24} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Reason Dropdown (Simulated) */}
                    <View className="mb-6">
                        <Text className="text-slate-300 mb-2 ml-1">Reason for Flagging</Text>
                        <View className="flex-row flex-wrap gap-2">
                            {reasons.map((r) => (
                                <TouchableOpacity
                                    key={r}
                                    onPress={() => setReason(r)}
                                    className={`px-4 py-2 rounded-full border ${reason === r ? 'bg-red-500/20 border-red-500' : 'bg-slate-800 border-slate-700'}`}
                                >
                                    <Text className={reason === r ? 'text-red-400 font-semibold' : 'text-slate-400'}>{r}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Notes */}
                    <View className="mb-6">
                        <Text className="text-slate-300 mb-1 ml-1">Notes</Text>
                        <TextInput
                            className="bg-slate-800 text-white p-4 rounded-xl border border-slate-700 h-24"
                            placeholder="Describe the incident..."
                            placeholderTextColor="#64748b"
                            multiline
                            textAlignVertical="top"
                            value={notes}
                            onChangeText={setNotes}
                        />
                    </View>

                    {/* Evidence Photo */}
                    <View className="mb-6">
                        <Text className="text-slate-300 mb-2 ml-1">Evidence (Optional)</Text>
                        <TouchableOpacity
                            onPress={pickImage}
                            className="bg-slate-800 border border-dashed border-slate-600 rounded-xl h-40 items-center justify-center overflow-hidden"
                        >
                            {evidence ? (
                                <Image source={{ uri: evidence }} className="w-full h-full" resizeMode="cover" />
                            ) : (
                                <View className="items-center">
                                    <Ionicons name="camera-outline" size={32} color="#64748b" />
                                    <Text className="text-slate-500 mt-2">Tap to upload photo</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Publish Toggle */}
                    <View className="flex-row items-center justify-between bg-slate-800 p-4 rounded-xl border border-slate-700 mb-8">
                        <View className="flex-1 mr-4">
                            <Text className="text-white font-bold text-lg">Publish to Network</Text>
                            <Text className="text-slate-400 text-xs">
                                Make this flag visible to other wholesalers in the network immediately.
                            </Text>
                        </View>
                        <Switch
                            value={publish}
                            onValueChange={setPublish}
                            trackColor={{ false: '#334155', true: '#ef4444' }}
                            thumbColor={publish ? '#ffffff' : '#94a3b8'}
                        />
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                        onPress={handleSubmit}
                        className="bg-red-600 py-4 rounded-xl active:bg-red-700 mb-10 shadow-lg shadow-red-900/20"
                    >
                        <Text className="text-white text-center font-bold text-lg">Submit Flag</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
