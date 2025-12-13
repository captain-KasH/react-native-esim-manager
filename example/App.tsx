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
  const [loading, setLoading] = useState(false);
  const [activationCode, setActivationCode] = useState('LPA:1$prod.smdp-plus.rsp.goog$3TD6-8L82-HUE1-LVN6');
  
  const testCodes = [
    'LPA:1$prod.smdp-plus.rsp.goog$3TD6-8L82-HUE1-LVN6', // Google Test
    'LPA:1$rsp.truphone.com$TRUPHONE_TEST_CODE', // Truphone Test
    'LPA:1$consumer.smdp-plus.com$TEST123456789', // Generic Test
    'LPA:1$esim-man.com$TEST-ESIM-CODE-001', // eSIM Man Test
    'LPA:1$lpa.ds.gsma.com$GSMA-TEST-PROFILE' // GSMA Test
  ];
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    try {
      const granted = await ReactNativeEsimManager.requestPermissions();
      if (granted) {
        checkEsimStatus();
      } else {
        Alert.alert('Permission Denied', 'Phone state permission is required for eSIM detection');
      }
    } catch (err) {
      console.warn(err);
      checkEsimStatus(); // Try anyway on iOS
    }
  };

  const checkEsimStatus = async () => {
    setLoading(true);
    try {
      const info = await ReactNativeEsimManager.getEsimInfo();
      setEsimInfo(info);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const checkSupport = async () => {
    try {
      const supported = await ReactNativeEsimManager.isEsimSupported();
      Alert.alert('eSIM Support', supported ? 'Supported' : 'Not Supported');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const checkEnabled = async () => {
    try {
      const enabled = await ReactNativeEsimManager.isEsimEnabled();
      Alert.alert('eSIM Status', enabled ? 'Enabled' : 'Disabled');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const installEsim = async () => {
    try {
      const success = await ReactNativeEsimManager.installEsimProfile({
        activationCode: activationCode
      });
      
      if (success) {
        Alert.alert(
          'Installation Result', 
          Platform.OS === 'android' 
            ? 'Function returned success. On Android, this may have opened device settings.'
            : 'eSIM installed successfully!'
        );
        // Refresh info after installation
        setTimeout(checkEsimStatus, 2000);
      } else {
        Alert.alert('Installation Failed', 'Installation returned false.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      Alert.alert('Installation Error', `Failed to install eSIM: ${errorMessage}`);
    }
  };

  const getCellularPlans = async () => {
    try {
      const cellularPlans = await ReactNativeEsimManager.getCellularPlans();
      setPlans(cellularPlans);
      Alert.alert('Cellular Plans', `Found ${cellularPlans.length} plans`);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const Button = ({ title, onPress, style }: { title: string; onPress: () => void; style?: ViewStyle }) => (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        
        <Text style={styles.title}>eSIM Manager Example</Text>
        
        {loading ? (
          <Text style={styles.loading}>Loading...</Text>
        ) : esimInfo ? (
          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>eSIM Information:</Text>
            <Text style={styles.infoText}>Supported: {esimInfo.isEsimSupported ? '✅' : '❌'}</Text>
            <Text style={styles.infoText}>Enabled: {esimInfo.isEsimEnabled ? '✅' : '❌'}</Text>
            {esimInfo.carrierName && <Text style={styles.infoText}>Carrier: {esimInfo.carrierName}</Text>}
            {esimInfo.mobileCountryCode && <Text style={styles.infoText}>MCC: {esimInfo.mobileCountryCode}</Text>}
            {esimInfo.mobileNetworkCode && <Text style={styles.infoText}>MNC: {esimInfo.mobileNetworkCode}</Text>}
          </View>
        ) : null}

        <View style={styles.buttonContainer}>
          <Button title="Refresh eSIM Info" onPress={checkEsimStatus} />
          <Button title="Check Support" onPress={checkSupport} />
          <Button title="Check Enabled" onPress={checkEnabled} />
          <Button title="Get Cellular Plans" onPress={getCellularPlans} />
        </View>

        {plans.length > 0 && (
          <View style={styles.plansContainer}>
            <Text style={styles.sectionTitle}>Cellular Plans ({plans.length})</Text>
            {plans.map((plan, index) => (
              <View key={index} style={styles.planItem}>
                <Text style={styles.planText}>Carrier: {plan.carrierName || 'Unknown'}</Text>
                <Text style={styles.planText}>MCC: {plan.mobileCountryCode || 'N/A'}</Text>
                <Text style={styles.planText}>MNC: {plan.mobileNetworkCode || 'N/A'}</Text>
                {plan.isEmbedded !== undefined && (
                  <Text style={styles.planText}>eSIM: {plan.isEmbedded ? '✅' : '❌'}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        <View style={styles.installSection}>
          <Text style={styles.sectionTitle}>Install eSIM Profile</Text>
          {Platform.OS === 'android' && (
            <Text style={styles.androidNote}>On Android: Opens system eSIM settings</Text>
          )}
          <TextInput
            style={styles.input}
            value={activationCode}
            onChangeText={setActivationCode}
            placeholder="Enter activation code"
            multiline
          />
          <Button title="Install eSIM Profile" onPress={installEsim} style={styles.installButton} />
          
          <View style={styles.testCodesContainer}>
            <Text style={styles.testCodesTitle}>Test Activation Codes:</Text>
            {testCodes.map((code, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.testCodeButton}
                onPress={() => setActivationCode(code)}
              >
                <Text style={styles.testCodeText}>{code.split('$')[1] || 'Test Code'}</Text>
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
  plansContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 10,
  },
  planItem: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  planText: {
    fontSize: 14,
    color: '#495057',
    marginBottom: 2,
  },
  testCodesContainer: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  testCodesTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  testCodeButton: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  testCodeText: {
    fontSize: 14,
    color: '#495057',
  },
});

export default App;