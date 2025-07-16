import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import {NativeModules} from 'react-native';


const { VanguardModule } = NativeModules as {
  VanguardModule: {
    isSdkReady: () => Promise<boolean>;
    getWifiMacAddress: () => Promise<string>;
    getDeviceSerialNumber: () => Promise<string>;
    getImei: () => Promise<string>;
  };
};

export default function App() {
  const [wifiMac, setWifiMac] = useState<string>('Belum diambil');
  const [serialNumber, setSerialNumber, ] = useState<string>('Belum diambil');
  const [imei, setImei] = useState<string>('Belum diambil');
  const [sdkReady, setSdkReady] = useState<boolean>(false);

  useEffect(() => {
    const checkSdk = async () => {
      const ready = await VanguardModule.isSdkReady();
      setSdkReady(ready);
      console.log('SDK Ready:', ready);
    };

    // Cek SDK setiap 2 detik sampai ready
    const interval = setInterval(() => {
      checkSdk();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleGetWifiMac = async () => {
    try {
      const mac = await VanguardModule.getWifiMacAddress();
      setWifiMac(mac);
    } catch (e: any) {
      setWifiMac('Error: ' + e.message);
    }
  };

  const handleGetSerialNumber = async () => {
    try {
      const serial = await VanguardModule.getDeviceSerialNumber();
      setSerialNumber(serial);
    } catch (e: any) {
      setSerialNumber('Error: ' + e.message);
    }
  };

    const handleGetImei = async () => {
    try {
      const imei = await VanguardModule.getImei();
      setImei(imei);
    } catch (e: any) {
      setImei('Error: ' + e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.statusText}>
        SDK Status: {sdkReady ? 'Connected ✅' : 'Waiting...'}
      </Text>

      <Text style={styles.label}>WiFi MAC Address:</Text>
      <Text style={styles.text}>{wifiMac}</Text>
      <Button title="Ambil WiFi MAC" onPress={handleGetWifiMac} />

      <Text style={styles.label}>Device Serial Number:</Text>
      <Text style={styles.text}>{serialNumber}</Text>
      <Button title="Ambil Serial Number" onPress={handleGetSerialNumber} />

      <Text style={styles.label}>Device Imei:</Text>
      <Text style={styles.text}>{imei}</Text>
      <Button title="Ambil Imei" onPress={handleGetImei} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 16,
  },
  text: {
    marginBottom: 8,
    fontSize: 16,
  },
  statusText: {
    fontSize: 16,
    marginBottom: 24,
    color: 'blue',
  },
});
