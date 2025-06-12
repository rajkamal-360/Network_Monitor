import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {NetworkQuality} from '../types/network';

interface NetworkStatusProps {
  connectionType: string;
  quality: NetworkQuality;
  speed: number | null;
}

const NetworkStatus: React.FC<NetworkStatusProps> = ({
  connectionType,
  quality,
  speed,
}) => {
  const getQualityColor = (quality: NetworkQuality) => {
    switch (quality) {
      case 'Excellent':
        return '#28a745';
      case 'Good':
        return '#ffc107';
      case 'Bad':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Connection Type: <Text style={styles.value}>{connectionType}</Text>
      </Text>
      <Text style={styles.label}>
        Network Quality:{' '}
        <Text style={[styles.value, {color: getQualityColor(quality)}]}>
          {quality}
        </Text>
      </Text>
      {speed !== null && (
        <Text style={styles.label}>
          Speed: <Text style={styles.value}>{speed.toFixed(2)} Mbps</Text>
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginVertical: 5,
    color: '#333',
  },
  value: {
    fontWeight: '600',
  },
});

export default NetworkStatus;
