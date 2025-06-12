import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, Alert} from 'react-native';
import NetInfo, {NetInfoState} from '@react-native-community/netinfo';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import NetworkStatus from './components/NetworkStatus';
import SpeedTestButton from './components/SpeedTestButton';
import {calculateNetworkQuality, performSpeedTest} from './utils/networkSpeed';
import {NetworkQuality} from './types/network';

const App: React.FC = () => {
  const [networkState, setNetworkState] = useState<NetInfoState | null>(null);
  const [networkQuality, setNetworkQuality] =
    useState<NetworkQuality>('Unknown');
  const [speedMbps, setSpeedMbps] = useState<number | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener(state => {
      setNetworkState(state);
      updateNetworkQuality(state);
    });

    return () => unsubscribe();
  }, []);

  const updateNetworkQuality = async (state: NetInfoState) => {
    try {
      const quality = await calculateNetworkQuality(state);
      setNetworkQuality(quality);
    } catch (error) {
      console.log('🚀 ~ updateNetworkQuality ~ error:', error);
      Alert.alert('Error', 'Failed to determine network quality');
      setNetworkQuality('Unknown');
    }
  };

  const handleSpeedTest = async () => {
    if (!networkState?.isConnected) {
      Alert.alert('Error', 'No network connection available');
      return;
    }

    setIsTesting(true);
    try {
      const speed = await performSpeedTest();
      console.log('🚀 ~ handleSpeedTest ~ speed:', speed);
      setSpeedMbps(speed);
      // Update quality based on speed
      if (speed > 10) {
        setNetworkQuality('Excellent');
      } else if (speed >= 2) {
        setNetworkQuality('Good');
      } else {
        setNetworkQuality('Bad');
      }
    } catch (error) {
      console.log('🚀 ~ handleSpeedTest ~ error:', error);
      Alert.alert('Error', 'Speed test failed. Please try again.');
      setSpeedMbps(null);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeIn} exiting={FadeOut}>
        <Text style={styles.title}>Network Speed Monitor</Text>
        <NetworkStatus
          connectionType={networkState?.type ?? 'Unknown'}
          quality={networkQuality}
          speed={speedMbps}
        />
        <SpeedTestButton onPress={handleSpeedTest} isTesting={isTesting} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
  },
});

export default App;
