import { View, Text, TouchableOpacity, ScrollView, Alert, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useRegistration } from '../../../context/RegistrationContext';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { registerRetailer } from '../../../services/api';

export default function ConsentScreen() {
    const router = useRouter();
    const { data } = useRegistration();
    const [agreed, setAgreed] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!agreed) {
            Alert.alert('Consent Required', 'Please agree to the terms to proceed.');
            return;
        }

        setSubmitting(true);
        try {
            // Mask Aadhaar if present
            const payload = { ...data, consentObtained: true };
            if (payload.aadhaar && payload.aadhaar.length === 12) {
                payload.aadhaar = 'XXXXXXXX' + payload.aadhaar.slice(8);
            }

            await registerRetailer(payload);
            Alert.alert('Success', 'Retailer Registered Successfully!');
            router.push('/retailer/register/success');
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to register retailer');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <View className="flex-1 bg-slate-900 p-4">
            <ScrollView className="flex-1">
                <Text className="text-slate-400 mb-6 text-center">Step 3 of 4: Consent & Review</Text>

                <View className="bg-slate-800 rounded-2xl p-6 border border-slate-700 mb-6">
                    <Text className="text-white text-lg font-bold mb-4">Review Details</Text>

                    <DetailRow label="Name" value={data.name} />
                    <DetailRow label="Shop" value={data.shopName} />
                    <DetailRow label="Mobile" value={data.mobile} />
                    <DetailRow label="Address" value={data.address} />
                    {data.gstin ? <DetailRow label="GSTIN" value={data.gstin} /> : null}
                    {data.aadhaar ? <DetailRow label="Aadhaar" value={'XXXXXXXX' + data.aadhaar.slice(8)} /> : null}

                    <View className="mt-4 pt-4 border-t border-slate-700 flex-row items-center">
                        <Ionicons name="checkmark-circle" size={20} color="#4ade80" />
                        <Text className="text-green-400 ml-2 font-semibold">Photo & Location Captured</Text>
                    </View>
                </View>

                <View className="bg-slate-800 rounded-2xl p-6 border border-slate-700 mb-6">
                    <Text className="text-white text-lg font-bold mb-4">Consent</Text>
                    <Text className="text-slate-300 leading-6 mb-4">
                        By proceeding, you agree to capture and store your photo and location for identity verification purposes.
                        This data will be securely stored and used only for credit management and verification within the Credit Guard system.
                    </Text>

                    <View className="flex-row items-center bg-slate-900 p-4 rounded-xl border border-slate-700">
                        <Switch
                            value={agreed}
                            onValueChange={setAgreed}
                            trackColor={{ false: '#334155', true: '#2563eb' }}
                            thumbColor={agreed ? '#ffffff' : '#94a3b8'}
                        />
                        <Text className="text-white ml-3 flex-1 font-semibold">
                            I agree and understand the use of my data.
                        </Text>
                    </View>
                </View>
            </ScrollView>

            <View className="flex-row gap-4 mb-4">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="flex-1 bg-slate-700 py-4 rounded-xl active:bg-slate-600"
                    disabled={submitting}
                >
                    <Text className="text-white text-center font-bold">Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handleSubmit}
                    className={`flex-1 py-4 rounded-xl ${agreed ? 'bg-green-600 active:bg-green-700' : 'bg-slate-600'}`}
                    disabled={!agreed || submitting}
                >
                    <Text className="text-white text-center font-bold">
                        {submitting ? 'Submitting...' : 'Submit Registration'}
                    </Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                onPress={() => router.replace('/(tabs)/home')}
                className="mb-6 py-2"
            >
                <Text className="text-slate-500 text-center font-bold">Cancel Registration</Text>
            </TouchableOpacity>
        </View>
    );
}

function DetailRow({ label, value }: { label: string, value: string }) {
    return (
        <View className="flex-row justify-between mb-2">
            <Text className="text-slate-400">{label}</Text>
            <Text className="text-white font-medium text-right flex-1 ml-4">{value}</Text>
        </View>
    );
}
