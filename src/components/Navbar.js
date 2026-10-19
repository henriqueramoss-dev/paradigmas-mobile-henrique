import { useState } from 'react';
import {
  Image,
  Modal,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

// Espaço da barra de status/notch: no Android o sistema informa a altura,
// no iOS usamos um valor fixo que cobre a Dynamic Island.
const topInset = Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 48;

const cartIcon = require('../../assets/icons/carrinho.png');
const loginIcon = require('../../assets/icons/login.png');

function Brand({ highlight, name, size }) {
  return (
    <Text style={[styles.brand, size === 'small' && styles.brandSmall]}>
      <Text style={styles.brandHighlight}>{highlight}</Text> {name}
    </Text>
  );
}

export default function Navbar({
  brandHighlight,
  brandName,
  links = [],
  onLinkPress,
  onCartPress,
  onLoginPress,
  onSearch,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLinkId, setActiveLinkId] = useState(null);
  const [searchText, setSearchText] = useState('');

  function closeMenu() {
    setIsMenuOpen(false);
  }

  function handleLinkPress(link) {
    setActiveLinkId(link.id);
    closeMenu();
    onLinkPress?.(link);
  }

  function handleCartPress() {
    closeMenu();
    onCartPress?.();
  }

  function handleLoginPress() {
    closeMenu();
    onLoginPress?.();
  }

  return (
    <View style={styles.header}>
      <Brand highlight={brandHighlight} name={brandName} />

      <View style={styles.actions}>
        <Pressable
          onPress={handleCartPress}
          accessibilityRole="button"
          accessibilityLabel="Carrinho"
          style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
        >
          <Image source={cartIcon} style={styles.icon} />
        </Pressable>

        <Pressable
          onPress={() => setIsMenuOpen(true)}
          accessibilityRole="button"
          accessibilityLabel="Abrir menu"
          accessibilityState={{ expanded: isMenuOpen }}
          style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
        >
          <View style={styles.hamburgerLine} />
          <View style={styles.hamburgerLine} />
          <View style={styles.hamburgerLine} />
        </Pressable>
      </View>

      <Modal
        visible={isMenuOpen}
        transparent
        animationType="fade"
        onRequestClose={closeMenu}
      >
        <View style={styles.modalRoot}>
          <Pressable
            style={styles.overlay}
            onPress={closeMenu}
            accessibilityLabel="Fechar menu"
          />

          <View style={styles.menu}>
            <View style={styles.menuTop}>
              <Brand highlight={brandHighlight} name={brandName} size="small" />

              <Pressable
                onPress={closeMenu}
                accessibilityRole="button"
                accessibilityLabel="Fechar menu"
                style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
              >
                <Text style={styles.closeIcon}>✕</Text>
              </Pressable>
            </View>
            <View style={styles.divider} />

            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={() => onSearch?.(searchText)}
              placeholder="Buscar produtos"
              placeholderTextColor="#9ca3af"
              returnKeyType="search"
              style={styles.search}
            />

            {links.map((link) => {
              const isActive = link.id === activeLinkId;

              return (
                <Pressable
                  key={link.id}
                  onPress={() => handleLinkPress(link)}
                  accessibilityRole="link"
                  accessibilityState={{ selected: isActive }}
                  style={({ pressed }) => [styles.menuItem, pressed && styles.pressed]}
                >
                  <Text style={[styles.menuText, isActive && styles.menuTextActive]}>
                    {link.label}
                  </Text>
                </Pressable>
              );
            })}

            <Pressable
              onPress={handleCartPress}
              style={({ pressed }) => [styles.menuItem, styles.menuItemRow, pressed && styles.pressed]}
            >
              <Image source={cartIcon} style={styles.menuIcon} />
              <Text style={styles.menuText}>Carrinho</Text>
            </Pressable>

            <Pressable
              onPress={handleLoginPress}
              style={({ pressed }) => [styles.menuItem, styles.menuItemRow, pressed && styles.pressed]}
            >
              <Image source={loginIcon} style={styles.menuIcon} />
              <Text style={styles.menuText}>Login</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const green = '#1eff00';

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 64,
    paddingTop: topInset,
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: '#000000',
  },
  brand: {
    color: green,
    fontSize: 24,
    fontWeight: '800',
  },
  brandSmall: {
    fontSize: 22,
  },
  brandHighlight: {
    color: '#ffffff',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  iconButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    borderRadius: 24,
  },
  pressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  icon: {
    width: 28,
    height: 28,
  },
  hamburgerLine: {
    width: 24,
    height: 2,
    backgroundColor: '#ffffff',
  },
  modalRoot: {
    flex: 1,
    flexDirection: 'row',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  menu: {
    width: '78%',
    maxWidth: 320,
    paddingTop: topInset,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.96)',
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
  },
  menuTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeIcon: {
    color: '#ffffff',
    fontSize: 22,
  },
  divider: {
    height: 1,
    marginVertical: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  search: {
    height: 44,
    marginBottom: 12,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: '#3a3a3a',
    color: '#ffffff',
    fontSize: 16,
  },
  menuItem: {
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  menuItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 12,
  },
  menuIcon: {
    width: 22,
    height: 22,
  },
  menuText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  menuTextActive: {
    color: green,
  },
});
