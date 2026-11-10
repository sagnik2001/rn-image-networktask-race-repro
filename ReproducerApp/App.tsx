import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

const sources = [require('./assets/a.webp'), require('./assets/b.webp')];

const IMAGE_COUNT = 60;

export default function App() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let id = requestAnimationFrame(function loop() {
      setTick(t => t + 1);
      id = requestAnimationFrame(loop);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>webp remount · tick {tick}</Text>
      <View style={styles.grid}>
        {Array.from({length: IMAGE_COUNT}, (_, i) => (
          <Image
            key={`${tick}-${i}`}
            source={sources[(tick + i) % 2]}
            style={styles.image}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, paddingTop: 80, backgroundColor: 'white'},
  title: {fontSize: 20, color: 'black', margin: 16},
  grid: {flexDirection: 'row', flexWrap: 'wrap'},
  image: {width: 24, height: 24, margin: 2},
});
