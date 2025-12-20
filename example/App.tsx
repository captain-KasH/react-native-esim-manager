import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  TextInput,
  ViewStyle,
  Platform,
} from 'react-native';
import ReactNativeEsimManager, { EsimInfo } from 'react-native-esim-manager';

const App = () => {
  const [esimInfo, setEsimInfo] = useState<EsimInfo | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState<{
    [key: string]: boolean;
  }>({});
  const [activationCode, setActivationCode] = useState(
    'LPA:1$prod.smdp-plus.rsp.goog$3TD6-8L82-HUE1-LVN6',
  );

  const testCodes = [
    'LPA:1$prod.smdp-plus.rsp.goog$3TD6-8L82-HUE1-LVN6', // Google Test
    'LPA:1$rsp.truphone.com$TRUPHONE_TEST_CODE', // Truphone Test
    'LPA:1$consumer.smdp-plus.com$TEST123456789', // Generic Test
    'LPA:1$esim-man.com$TEST-ESIM-CODE-001', // eSIM Man Test
    'LPA:1$lpa.ds.gsma.com$GSMA-TEST-PROFILE', // GSMA Test
  ];
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    try {
      const granted = await ReactNativeEsimManager.requestPermissions();
      if (granted) {
        checkEsimStatus(true);
      } else {
        Alert.alert(
          'Permission Denied',
          'Phone state permission is required for eSIM detection',
        );
        setInitialLoading(false);
      }
    } catch (err) {
      console.warn(err);
      checkEsimStatus(true); // Try anyway on iOS
    }
  };

  const setButtonLoadingState = (key: string, loading: boolean) => {
    setButtonLoading(prev => ({ ...prev, [key]: loading }));
  };

  const checkEsimStatus = async (isInitial = false) => {
    if (isInitial) setInitialLoading(true);
    else setButtonLoadingState('refresh', true);
    try {
      const info = await ReactNativeEsimManager.getEsimInfo();
      setEsimInfo(info);
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Unknown error',
      );
    } finally {
      if (isInitial) setInitialLoading(false);
      else setButtonLoadingState('refresh', false);
    }
  };

  const checkSupport = async () => {
    setButtonLoadingState('support', true);
    try {
      const supported = await ReactNativeEsimManager.isEsimSupported();
      Alert.alert('eSIM Support', supported ? 'Supported' : 'Not Supported');
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Unknown error',
      );
    } finally {
      setButtonLoadingState('support', false);
    }
  };

  const checkEnabled = async () => {
    setButtonLoadingState('enabled', true);
    try {
      const enabled = await ReactNativeEsimManager.isEsimEnabled();
      Alert.alert('eSIM Status', enabled ? 'Enabled' : 'Disabled');
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Unknown error',
      );
    } finally {
      setButtonLoadingState('enabled', false);
    }
  };

  const installEsim = async () => {
    setButtonLoadingState('install', true);
    try {
      const success = await ReactNativeEsimManager.installEsimProfile({
        activationCode: activationCode,
      });

      if (success) {
        Alert.alert(
          'Installation Result',
          Platform.OS === 'android'
            ? 'Function returned success. On Android, this may have opened device settings.'
            : 'eSIM installed successfully!',
        );
        // Refresh info after installation
        setTimeout(() => checkEsimStatus(), 2000);
      } else {
        Alert.alert('Installation Failed', 'Installation returned false.');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      Alert.alert(
        'Installation Error',
        `Failed to install eSIM: ${errorMessage}`,
      );
    } finally {
      setButtonLoadingState('install', false);
    }
  };

  const getCellularPlans = async () => {
    setButtonLoadingState('plans', true);
    try {
      const cellularPlans = await ReactNativeEsimManager.getCellularPlans();
      setPlans(cellularPlans);
      Alert.alert('Cellular Plans', `Found ${cellularPlans.length} plans`);
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Unknown error',
      );
    } finally {
      setButtonLoadingState('plans', false);
    }
  };

  const validateEsimSupport = async () => {
    setButtonLoadingState('validate', true);
    try {
      // Step 1: Check basic support
      const isSupported = await ReactNativeEsimManager.isEsimSupported();
      
      if (!isSupported) {
        Alert.alert('eSIM Validation', '❌ Device does not support eSIM');
        return;
      }

      // Step 2: Try to get actual eSIM info to verify real functionality
      try {
        const esimInfo = await ReactNativeEsimManager.getEsimInfo();
        
        // Step 3: Additional validation checks
        const hasCarrierInfo = esimInfo.carrierName || esimInfo.mobileCountryCode;
        const canAccessEsimFeatures = esimInfo.isEsimSupported && 
          (esimInfo.isEsimEnabled || hasCarrierInfo);

        let validationResult = '';
        if (canAccessEsimFeatures) {
          validationResult = '✅ Real eSIM support confirmed\n';
          validationResult += `• Hardware: Supported\n`;
          validationResult += `• Status: ${esimInfo.isEsimEnabled ? 'Active' : 'Available'}\n`;
          if (hasCarrierInfo) {
            validationResult += `• Carrier: ${esimInfo.carrierName || 'Available'}\n`;
          }
        } else {
          validationResult = '⚠️ Possible false positive detected\n';
          validationResult += `• API reports support: ${isSupported}\n`;
          validationResult += `• Actual functionality: Limited\n`;
          validationResult += `• Recommendation: Test with real activation code`;
        }

        Alert.alert('eSIM Validation Result', validationResult);
      } catch (infoError) {
        // If we can't get eSIM info, it's likely a false positive
        Alert.alert(
          'eSIM Validation Result',
          `⚠️ Likely false positive detected\n\n` +
          `• API reports support: ${isSupported}\n` +
          `• Cannot access eSIM features\n` +
          `• Error: ${infoError instanceof Error ? infoError.message : 'Unknown'}\n\n` +
          `This device may have eSIM hardware but lacks software support.`
        );
      }
    } catch (error) {
      Alert.alert(
        'Validation Error',
        error instanceof Error ? error.message : 'Unknown error',
      );
    } finally {
      setButtonLoadingState('validate', false);
    }
  };

  const SkeletonLoader = () => (
    <View style={styles.skeletonContainer}>
      <View style={styles.skeletonTitle} />
      <View style={styles.skeletonLine} />
      <View style={styles.skeletonLine} />
      <View style={styles.skeletonLineShort} />
    </View>
  );

  const Button = ({
    title,
    onPress,
    style,
    loadingKey,
  }: {
    title: string;
    onPress: () => void;
    style?: ViewStyle;
    loadingKey?: string;
  }) => (
    <TouchableOpacity
      style={[
        styles.button,
        style,
        loadingKey && buttonLoading[loadingKey] && styles.buttonDisabled,
      ]}
      onPress={onPress}
      disabled={loadingKey ? buttonLoading[loadingKey] : false}
    >
      <Text style={styles.buttonText}>
        {loadingKey && buttonLoading[loadingKey] ? 'Loading...' : title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>eSIM Manager Example</Text>

        {initialLoading ? (
          <SkeletonLoader />
        ) : esimInfo ? (
          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>eSIM Information:</Text>
            <Text style={styles.infoText}>
              Supported: {esimInfo.isEsimSupported ? '✅' : '❌'}
            </Text>
            <Text style={styles.infoText}>
              Enabled: {esimInfo.isEsimEnabled ? '✅' : '❌'}
            </Text>
            {esimInfo.carrierName && (
              <Text style={styles.infoText}>
                Carrier: {esimInfo.carrierName}
              </Text>
            )}
            {esimInfo.mobileCountryCode && (
              <Text style={styles.infoText}>
                MCC: {esimInfo.mobileCountryCode}
              </Text>
            )}
            {esimInfo.mobileNetworkCode && (
              <Text style={styles.infoText}>
                MNC: {esimInfo.mobileNetworkCode}
              </Text>
            )}
          </View>
        ) : null}

        <View style={styles.buttonContainer}>
          <Button
            title="Refresh eSIM Info"
            onPress={() => checkEsimStatus()}
            loadingKey="refresh"
          />
          <Button
            title="Check Support"
            onPress={checkSupport}
            loadingKey="support"
          />
          <Button
            title="Validate Real eSIM Support"
            onPress={validateEsimSupport}
            loadingKey="validate"
            style={styles.validateButton}
          />
          <Button
            title="Check Enabled"
            onPress={checkEnabled}
            loadingKey="enabled"
          />
          <Button
            title="Get Cellular Plans"
            onPress={getCellularPlans}
            loadingKey="plans"
          />
        </View>

        {plans.length > 0 && (
          <View style={styles.plansContainer}>
            <Text style={styles.sectionTitle}>
              Cellular Plans ({plans.length})
            </Text>
            {plans.map((plan, index) => (
              <View key={index} style={styles.planItem}>
                <Text style={styles.planText}>
                  Carrier: {plan.carrierName || 'Unknown'}
                </Text>
                <Text style={styles.planText}>
                  MCC: {plan.mobileCountryCode || 'N/A'}
                </Text>
                <Text style={styles.planText}>
                  MNC: {plan.mobileNetworkCode || 'N/A'}
                </Text>
                {plan.isEmbedded !== undefined && (
                  <Text style={styles.planText}>
                    eSIM: {plan.isEmbedded ? '✅' : '❌'}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        <View style={styles.installSection}>
          <Text style={styles.sectionTitle}>Install eSIM Profile</Text>
          {Platform.OS === 'android' && (
            <Text style={styles.androidNote}>
              On Android: Opens system eSIM settings
            </Text>
          )}
          <TextInput
            style={styles.input}
            value={activationCode}
            onChangeText={setActivationCode}
            placeholder="Enter activation code"
            multiline
          />
          <Button
            title="Install eSIM Profile"
            onPress={installEsim}
            style={styles.installButton}
            loadingKey="install"
          />

          <View style={styles.testCodesContainer}>
            <Text style={styles.testCodesTitle}>Test Activation Codes:</Text>
            {testCodes.map((code, index) => (
              <TouchableOpacity
                key={index}
                style={styles.testCodeButton}
                onPress={() => setActivationCode(code)}
              >
                <Text style={styles.testCodeText}>
                  {code.split('$')[1] || 'Test Code'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  loading: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
  infoContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  infoText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#666',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  installSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  androidNote: {
    fontSize: 14,
    color: '#FF9500',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginBottom: 15,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  installButton: {
    backgroundColor: '#34C759',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  skeletonContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  skeletonTitle: {
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 15,
    width: '60%',
  },
  skeletonLine: {
    height: 16,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 8,
    width: '100%',
  },
  skeletonLineShort: {
    height: 16,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 8,
    width: '70%',
  },
  plansContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  planItem: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  planText: {
    fontSize: 14,
    marginBottom: 4,
    color: '#333',
  },
  testCodesContainer: {
    marginTop: 20,
  },
  testCodesTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  testCodeButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
  },
  testCodeText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  validateButton: {
    backgroundColor: '#FF9500',
  },
});

export default App;
