import NetInfo, {NetInfoState} from '@react-native-community/netinfo';
import axios from 'axios';
import {NetworkQuality} from '../types/network';

export const calculateNetworkQuality = async (
  state: NetInfoState,
): Promise<NetworkQuality> => {
  if (!state.isConnected) {
    return 'Bad';
  }

  if (state.type === 'wifi') {
    return 'Excellent';
  }

  if (state.type === 'cellular') {
    const generation = state.details.cellularGeneration;
    if (generation === '5g') {
      return 'Excellent';
    } else if (generation === '4g') {
      return 'Good';
    } else if (generation === '3g') {
      return state.details.isConnectionExpensive ? 'Bad' : 'Good';
    } else if (generation === '2g') {
      return 'Bad';
    }
  }

  return 'Unknown';
};

export const performSpeedTest = async (): Promise<number> => {
  const testFileUrl = 'https://speed.cloudflare.com/__down?bytes=25000000'; // 25MB file
  const startTime = Date.now();

  try {
    const response = await axios.get(testFileUrl, {
      responseType: 'arraybuffer',
      timeout: 30000, // 30 second timeout
    });
    const endTime = Date.now();
    const durationSeconds = (endTime - startTime) / 1000;
    const fileSizeBytes = response.data.byteLength;
    const speedBps = (fileSizeBytes * 8) / durationSeconds; // Bits per second
    const speedMbps = speedBps / 1000000; // Convert to Mbps
    return Number(speedMbps.toFixed(2));
  } catch (error) {
    console.error('Speed test error:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(`Speed test failed: ${error.message}`);
    }
    throw new Error('Speed test failed: Unknown error');
  }
};
