import { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Pedometer } from 'expo-sensors';
import { Text } from 'react-native';

export default function App() {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const [pastStepCount, setPastStepCount] = useState(0);
  const [currentStepCount, setCurrentStepCount] = useState(0);

  const subscribe = async () => {
    const isAvailable = await Pedometer.isAvailableAsync();
    setIsPedometerAvailable(String(isAvailable));

    if (isAvailable) {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 1);

      const pastStepCountResult = await Pedometer.getStepCountAsync(start, end);
      if (pastStepCountResult) {
        setPastStepCount(pastStepCountResult.steps);
      }

      return Pedometer.watchStepCount(result => {
        setCurrentStepCount(result.steps);
      });
    }
  };

  useEffect(() => {
    const subscription = subscribe();
    return () => subscription && subscription.remove();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={{borderWidth: '2', fontSize: 30, borderRadius: 9,}}>{pastStepCount}</Text>
       <Text size="h3" style={{borderWidth: '0'}}>(In the last 24hrs)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 150,
    marginBottom: 150,
    marginLeft: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0083ff',
    width: 200,
    height: 10,
    borderRadius: 9,
    shadow: 4,
  },
});
