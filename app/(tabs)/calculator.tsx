import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight } from 'lucide-react-native';
import Card from '@/components/Card';
import Button from '@/components/Button';
import HealthMetricInput from '@/components/HealthMetricInput';
import HealthMetricPicker from '@/components/HealthMetricPicker';
import Colors from '@/constants/colors';
import useAuthStore from '@/store/auth-store';
import useHealthStore from '@/store/health-store';
import useCalculateHealthStore from "@/store/calculate-health"
import { bloodWorkMetrics, lifestyleMetrics, vitalMetrics } from '@/constants/metrics';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { OpenAI } from "openai"
import { Upload } from 'lucide-react-native';
export default function CalculatorScreen() {
    const { user, isAuthenticated } = useAuthStore();

    // const {
    //     bloodwork,
    //     lifestyle,
    //     vitals,
    //     setBloodwork,
    //     setLifestyle,
    //     setVitals,
    //     calculateBioAge,
    //     isLoading,
    // } = useHealthStore();

    const {
        bloodwork,
        lifestyle,
        vitals,
        setBloodwork,
        setLifestyle,
        setVitals,
        calculateWithAI,
        isLoading,
        uploadAndParsePdf
    } = useCalculateHealthStore();

    const [activeSection, setActiveSection] = useState<'vitals' | 'lifestyle' | 'bloodwork'>('vitals');
    const [formData, setFormData] = useState({
        systolicBP: '',
        diastolicBP: '',
        restingHR: '',
        bmi: '',
        sleepHours: '',
        exerciseMinutes: '',
        alcoholDrinks: '',
        smokingStatus: 'Never',
        stressLevel: 'Low',
        dietQuality: 'Good',
        glucose: '',
        totalCholesterol: '',
        hdl: '',
        ldl: '',
        triglycerides: '',
        creatinine: '',
        bun: '',
        alt: '',
        ast: '',
        hba1c: '',
        vitaminD: '',
        tsh: '',
    });
    const [uploadMode, setUploadMode] = useState<'manual' | 'pdf'>('manual');
    const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);


    useEffect(() => {
        if (!isAuthenticated) {
            router.replace('/(auth)');
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (bloodwork) {
            setFormData(prev => ({
                ...prev,
                glucose: bloodwork.glucose?.toString() || '',
                totalCholesterol: bloodwork.totalCholesterol?.toString() || '',
                hdl: bloodwork.hdl?.toString() || '',
                ldl: bloodwork.ldl?.toString() || '',
                triglycerides: bloodwork.triglycerides?.toString() || '',
                creatinine: bloodwork.creatinine?.toString() || '',
                bun: bloodwork.bun?.toString() || '',
                alt: bloodwork.alt?.toString() || '',
                ast: bloodwork.ast?.toString() || '',
                hba1c: bloodwork.hba1c?.toString() || '',
                vitaminD: bloodwork.vitaminD?.toString() || '',
                tsh: bloodwork.tsh?.toString() || '',
            }));
        }

        if (lifestyle) {
            setFormData(prev => ({
                ...prev,
                sleepHours: lifestyle.sleepHours?.toString() || '',
                exerciseMinutes: lifestyle.exerciseMinutes?.toString() || '',
                alcoholDrinks: lifestyle.alcoholDrinks?.toString() || '',
                smokingStatus: lifestyle.smokingStatus || 'Never',
                stressLevel: lifestyle.stressLevel || 'Low',
                dietQuality: lifestyle.dietQuality || 'Good',
            }));
        }

        if (vitals) {
            setFormData(prev => ({
                ...prev,
                systolicBP: vitals.systolicBP?.toString() || '',
                diastolicBP: vitals.diastolicBP?.toString() || '',
                restingHR: vitals.restingHR?.toString() || '',
                bmi: vitals.bmi?.toString() || '',
            }));
        }
    }, [bloodwork, lifestyle, vitals]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const handlePickerChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const saveVitals = () => {
        const vitalsData = {
            id: vitals?.id || Date.now().toString(),
            userId: user?.id || '',
            date: new Date().toISOString(),
            systolicBP: formData.systolicBP ? parseFloat(formData.systolicBP) : undefined,
            diastolicBP: formData.diastolicBP ? parseFloat(formData.diastolicBP) : undefined,
            restingHR: formData.restingHR ? parseFloat(formData.restingHR) : undefined,
            bmi: formData.bmi ? parseFloat(formData.bmi) : undefined,
        };

        setVitals(vitalsData);
        setActiveSection('lifestyle');
    };

    const saveLifestyle = () => {
        const lifestyleData = {
            id: lifestyle?.id || Date.now().toString(),
            userId: user?.id || '',
            date: new Date().toISOString(),
            sleepHours: formData.sleepHours ? parseFloat(formData.sleepHours) : undefined,
            exerciseMinutes: formData.exerciseMinutes ? parseFloat(formData.exerciseMinutes) : undefined,
            alcoholDrinks: formData.alcoholDrinks ? parseFloat(formData.alcoholDrinks) : undefined,
            smokingStatus: formData.smokingStatus as 'Never' | 'Former' | 'Current',
            stressLevel: formData.stressLevel as 'Low' | 'Moderate' | 'High',
            dietQuality: formData.dietQuality as 'Poor' | 'Average' | 'Good' | 'Excellent',
        };

        setLifestyle(lifestyleData);
        setActiveSection('bloodwork');
    };

    const saveBloodwork = () => {
        const bloodworkData = {
            id: bloodwork?.id || Date.now().toString(),
            userId: user?.id || '',
            date: new Date().toISOString(),
            glucose: formData.glucose ? parseFloat(formData.glucose) : undefined,
            totalCholesterol: formData.totalCholesterol ? parseFloat(formData.totalCholesterol) : undefined,
            hdl: formData.hdl ? parseFloat(formData.hdl) : undefined,
            ldl: formData.ldl ? parseFloat(formData.ldl) : undefined,
            triglycerides: formData.triglycerides ? parseFloat(formData.triglycerides) : undefined,
            creatinine: formData.creatinine ? parseFloat(formData.creatinine) : undefined,
            bun: formData.bun ? parseFloat(formData.bun) : undefined,
            alt: formData.alt ? parseFloat(formData.alt) : undefined,
            ast: formData.ast ? parseFloat(formData.ast) : undefined,
            hba1c: formData.hba1c ? parseFloat(formData.hba1c) : undefined,
            vitaminD: formData.vitaminD ? parseFloat(formData.vitaminD) : undefined,
            tsh: formData.tsh ? parseFloat(formData.tsh) : undefined,
        };

        setBloodwork(bloodworkData);
    };

    const handleCalculate = async () => {
        if (activeSection === 'vitals') {
            saveVitals();
        } else if (activeSection === 'lifestyle') {
            saveLifestyle();
        } else if (activeSection === 'bloodwork' && uploadMode === 'manual') {
            saveBloodwork();
        }


        // Calculate age from DOB
        let chronologicalAge = 30;
        if (user?.dateOfBirth) {
            const birthDate = new Date(user.dateOfBirth);
            const today = new Date();
            chronologicalAge = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                chronologicalAge--;
            }
        }

        // console.log("Calling OpenAI with age", chronologicalAge);

        const result = await calculateWithAI(chronologicalAge, user?.id || '');

        if (result) {
            router.push('/recommendations');
        } else {
            Alert.alert('Error', 'Failed to calculate biological age. Please try again.');
        }
    };


    const renderVitalsSection = () => (
        <View>
            <Text style={styles.sectionTitle}>Vital Measurements</Text>
            <Text style={styles.sectionDescription}>
                Enter your basic health measurements to help calculate your biological age.
            </Text>

            {vitalMetrics.map(metric => (
                <HealthMetricInput
                    key={metric.id}
                    label={metric.name}
                    value={formData[metric.id as keyof typeof formData]}
                    onChangeText={(value) => handleInputChange(metric.id, value)}
                    unit={metric.unit}
                    normalRange={metric.normalRange}
                />
            ))}

            <View style={styles.buttonContainer}>
                <Button
                    title="Next: Lifestyle"
                    onPress={saveVitals}
                    variant="primary"
                    fullWidth
                />
            </View>
        </View>
    );

    const renderLifestyleSection = () => (
        <View>
            <Text style={styles.sectionTitle}>Lifestyle Factors</Text>
            <Text style={styles.sectionDescription}>
                Your daily habits significantly impact your biological age.
            </Text>

            {lifestyleMetrics.map(metric => {
                if (metric.options) {
                    return (
                        <HealthMetricPicker
                            key={metric.id}
                            label={metric.name}
                            options={metric.options}
                            selectedValue={formData[metric.id as keyof typeof formData]}
                            onSelect={(value) => handlePickerChange(metric.id, value)}
                        />
                    );
                } else {
                    return (
                        <HealthMetricInput
                            key={metric.id}
                            label={metric.name}
                            value={formData[metric.id as keyof typeof formData]}
                            onChangeText={(value) => handleInputChange(metric.id, value)}
                            unit={metric.unit}
                            normalRange={metric.normalRange}
                        />
                    );
                }
            })}

            <View style={styles.buttonContainer}>
                <Button
                    title="Back to Vitals"
                    onPress={() => setActiveSection('vitals')}
                    variant="outline"
                    style={styles.backButton}
                />
                <Button
                    title="Next: Blood Work"
                    onPress={saveLifestyle}
                    variant="primary"
                    style={styles.nextButton}
                />
            </View>
        </View>
    );

    const renderBloodworkSection = () => (
        <View>
            <Text style={styles.sectionTitle}>Blood Work Input</Text>
            <Text style={styles.sectionDescription}>
                Choose how you want to enter your blood work data.
            </Text>

            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
                <Button
                    title="Upload PDF"
                    variant={uploadMode === 'pdf' ? 'primary' : 'outline'}
                    onPress={() => setUploadMode('pdf')}
                    style={{ flex: 1 }}
                />
                <Button
                    title="Add Manually"
                    variant={uploadMode === 'manual' ? 'primary' : 'outline'}
                    onPress={() => setUploadMode('manual')}
                    style={{ flex: 1 }}
                />
            </View>

            {uploadMode === 'pdf' && (
                // <View style={{ marginTop: 30 }}>
                //     <TouchableOpacity style={styles.uploadContainer} onPress={pickAndParsePdf}>
                //         <Upload size={20} color="#007AFF" style={{ marginRight: 8 }} onPress={pickAndParsePdf} />
                //         <Text style={styles.uploadText}>Select PDF File</Text>
                //     </TouchableOpacity>
                // </View>
                <View style={{ marginTop: 30 }}>
                    {!uploadedFileName ? (
                        <TouchableOpacity style={styles.uploadContainer} onPress={pickAndParsePdf}>
                            {uploading ? (
                                <Text style={styles.uploadText}>Uploading...</Text>
                            ) : (
                                <>
                                    <Upload size={20} color="#007AFF" style={{ marginRight: 8 }} />
                                    <Text style={styles.uploadText}>Select PDF File</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.uploadedFileContainer}>
                            <Text style={styles.uploadedFileName}>{uploadedFileName}</Text>
                            <TouchableOpacity onPress={removeUploadedPdf}>
                                <Text style={styles.removeText}>✕</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>


            )}

            {uploadMode === 'manual' && (
                <View>
                    <Text style={styles.sectionTitle}>Blood Work Results</Text>
                    <Text style={styles.sectionDescription}>
                        Enter your most recent blood test results for a more accurate biological age calculation.
                    </Text>

                    <Text style={styles.optionalText}>
                        This section is optional but provides more accurate results.
                    </Text>

                    {bloodWorkMetrics.map(metric => (
                        <HealthMetricInput
                            key={metric.id}
                            label={metric.name}
                            value={formData[metric.id as keyof typeof formData]}
                            onChangeText={(value) => handleInputChange(metric.id, value)}
                            unit={metric.unit}
                            normalRange={metric.normalRange}
                        />
                    ))}

                    {/* <View style={styles.buttonContainer}>
                        <Button
                            title="Back to Lifestyle"
                            onPress={() => setActiveSection('lifestyle')}
                            variant="outline"
                            style={styles.backButton}
                        />
                        <Button
                            title="Calculate"
                            onPress={handleCalculate}
                            variant="primary"
                            loading={isLoading}
                            disabled={isLoading}
                            style={styles.nextButton}
                        />
                    </View> */}
                </View>
            )}

            <View style={styles.pdfUploadContainer}>
                <Button
                    title="Back to Lifestyle"
                    onPress={() => setActiveSection('lifestyle')}
                    variant="outline"
                    style={styles.backButton}
                />
                <Button
                    title="Calculate"
                    onPress={handleCalculate}
                    variant="primary"
                    loading={isLoading}
                    disabled={isLoading}
                    style={styles.nextButton}
                />
            </View>
        </View>
    );


    const pickAndParsePdf = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: "application/pdf",
            });

            if (!result.assets?.length) return;

            const uri = result.assets[0].uri;
            const name = result.assets[0].name || "Uploaded PDF";

            setUploading(true);
            const success = await uploadAndParsePdf(uri);
            setUploading(false);


            if (success) {
                setUploadedFileName(name);
                Alert.alert("Success", "Health data extracted and populated from PDF.");
            } else {
                setUploadedFileName(null);
                Alert.alert("Error", "Failed to process PDF.");
            }
        } catch (err) {
            console.error("PDF upload/parse error", err);
            Alert.alert("Error", "Something went wrong while uploading PDF.");
            setUploading(false);
        }
    };

    const removeUploadedPdf = () => {
        setUploadedFileName(null);
        // setBloodwork(null); // clear parsed data
    };

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.progressContainer}>
                    <TouchableOpacity
                        style={[
                            styles.progressItem,
                            activeSection === 'vitals' && styles.activeProgressItem
                        ]}
                        onPress={() => setActiveSection('vitals')}
                    >
                        <Text
                            style={[
                                styles.progressText,
                                activeSection === 'vitals' && styles.activeProgressText
                            ]}
                        >
                            Vitals
                        </Text>
                    </TouchableOpacity>

                    <ChevronRight size={16} color={Colors.textLight} />

                    <TouchableOpacity
                        style={[
                            styles.progressItem,
                            activeSection === 'lifestyle' && styles.activeProgressItem
                        ]}
                        onPress={() => setActiveSection('lifestyle')}
                    >
                        <Text
                            style={[
                                styles.progressText,
                                activeSection === 'lifestyle' && styles.activeProgressText
                            ]}
                        >
                            Lifestyle
                        </Text>
                    </TouchableOpacity>

                    <ChevronRight size={16} color={Colors.textLight} />

                    <TouchableOpacity
                        style={[
                            styles.progressItem,
                            activeSection === 'bloodwork' && styles.activeProgressItem
                        ]}
                        onPress={() => setActiveSection('bloodwork')}
                    >
                        <Text
                            style={[
                                styles.progressText,
                                activeSection === 'bloodwork' && styles.activeProgressText
                            ]}
                        >
                            Blood Work
                        </Text>
                    </TouchableOpacity>
                </View>

                <Card variant="elevated" style={styles.formCard}>
                    {activeSection === 'vitals' && renderVitalsSection()}
                    {activeSection === 'lifestyle' && renderLifestyleSection()}
                    {activeSection === 'bloodwork' && renderBloodworkSection()}
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollContent: {
        padding: 16,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    progressItem: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
        backgroundColor: Colors.card,
    },
    activeProgressItem: {
        backgroundColor: Colors.primary,
    },
    progressText: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
    activeProgressText: {
        color: '#fff',
        fontWeight: '500',
    },
    formCard: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 8,
    },
    sectionDescription: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginBottom: 24,
        lineHeight: 20,
    },
    optionalText: {
        fontSize: 12,
        fontStyle: 'italic',
        color: Colors.textLight,
        marginBottom: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 24,
    },
    backButton: {
        flex: 1,
        marginRight: 8,
    },
    nextButton: {
        flex: 1,
        marginLeft: 8,
    },
    pdfUploadContainer: {
        flexDirection: 'row',
        marginTop: 40,
        width: "auto"
    },
    uploadContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#f9f9f9',
        height: 200,
        marginBottom: 70
    },
    uploadText: {
        fontSize: 16,
        color: '#007AFF',
        fontWeight: '500',
    },
    uploadedFileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#e9f5ff',
        marginBottom: 16,
    },
    uploadedFileName: {
        fontSize: 16,
        color: '#333',
        flex: 1,
    },
    removeText: {
        color: '#ff3b30',
        fontSize: 18,
        fontWeight: 'bold',
        paddingHorizontal: 8,
    },

});