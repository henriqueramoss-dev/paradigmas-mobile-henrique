import { useState } from 'react';
import { Platform, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';

// Espaço da barra de status/notch: no Android o sistema informa a altura,
// no iOS usamos um valor fixo que cobre a Dynamic Island.
const topInset = Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 48;

export default function Navbar({ brand, links = [], ctaLabel, onLinkPress, onCtaPress }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLinkId, setActiveLinkId] = useState(links[0]?.id);

  function handleLinkPress(link) {
    setActiveLinkId(link.id);
    setIsMenuOpen(false);
    onLinkPress?.(link);
  }

  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        <Text style={styles.brand}>{brand}</Text>

        <Pressable
          onPress={() => setIsMenuOpen((open) => !open)}
          accessibilityRole="button"
          accessibilityLabel={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
          accessibilityState={{ expanded: isMenuOpen }}
          hitSlop={8}
          style={({ pressed }) => [styles.menuButton, pressed && styles.linkPressed]}
        >
          <Text style={styles.menuIcon}>{isMenuOpen ? '✕' : '☰'}</Text>
        </Pressable>
      </View>

      {isMenuOpen ? (
        <View style={styles.menu}>
          {links.map((link) => {
            const isActive = link.id === activeLinkId;

            return (
              <Pressable
                key={link.id}
                onPress={() => handleLinkPress(link)}
                accessibilityRole="link"
                accessibilityState={{ selected: isActive }}
                style={({ pressed }) => [
                  styles.link,
                  isActive && styles.linkActive,
                  pressed && styles.linkPressed,
                ]}
              >
                <Text style={[styles.linkText, isActive && styles.linkTextActive]}>
                  {link.label}
                </Text>
              </Pressable>
            );
          })}

          {ctaLabel ? (
            <Pressable
              onPress={onCtaPress}
              style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
            >
              <Text style={styles.ctaText}>{ctaLabel}</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e1b4b',
    paddingTop: topInset,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
  },
  brand: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  menuButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  menuIcon: {
    color: '#ffffff',
    fontSize: 24,
  },
  menu: {
    paddingVertical: 8,
    gap: 4,
  },
  link: {
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  linkPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  linkActive: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
  },
  linkText: {
    color: '#e0e7ff',
    fontSize: 16,
  },
  linkTextActive: {
    color: '#f59e0b',
    fontWeight: '700',
  },
  cta: {
    minHeight: 48,
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#f59e0b',
  },
  ctaPressed: {
    opacity: 0.8,
  },
  ctaText: {
    color: '#1e1b4b',
    fontSize: 16,
    fontWeight: '700',
  },
});
