import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import Navbar from './src/components/Navbar';

const navLinks = [
  { id: 'inicio', label: 'Início' },
  { id: 'sobre', label: 'Sobre' },
  { id: 'projetos', label: 'Projetos' },
  { id: 'contato', label: 'Contato' },
];

export default function App() {
  return (
    <View style={styles.container}>
      <Navbar brand="Henrique.dev" links={navLinks} ctaLabel="Fale comigo" />

      <View style={styles.content}>
        <Text style={styles.title}>Bem-vindo ao meu portfólio</Text>
        <Text style={styles.subtitle}>
          Esta é a Navbar do meu portfólio web reconstruída em React Native.
        </Text>
      </View>

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e1b4b',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: '#475569',
  },
});
