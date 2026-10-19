import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import Navbar from './src/components/Navbar';

const navLinks = [
  { id: 'colecoes', label: 'Coleções' },
  { id: 'explorar', label: 'Explorar' },
  { id: 'outlet', label: 'Outlet' },
];

export default function App() {
  return (
    <View style={styles.container}>
      <Navbar brandHighlight="HC" brandName="STORE" links={navLinks} />

      <View style={styles.content}>
        <Text style={styles.title}>Nova coleção</Text>
        <Text style={styles.subtitle}>
          Header do site HC Store reconstruído em React Native.
        </Text>
      </View>

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: '#4b4b4b',
  },
});
