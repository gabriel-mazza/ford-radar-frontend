import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { login } from '../services/api';
import { Button, Input } from '../components/UI';
import { colors, spacing, radius } from '../theme';

export default function LoginScreen({ navigation }: any) {
  const { saveToken } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  function validate() {
    const e: typeof errors = {};
    if (!email.includes('@')) e.email = 'E-mail inválido';
    if (password.length < 4) e.password = 'Senha muito curta';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleLogin() {
    if (!validate()) return;
    setLoading(true);
    try {
      const { token } = await login(email.trim(), password);
      await saveToken(token);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || 'Credenciais inválidas. Verifique e-mail e senha.';
      Alert.alert('Erro ao entrar', msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={styles.logoRing}>
            <Text style={styles.logoText}>⬡</Text>
          </View>
          <Text style={styles.brand}>FORD RADAR</Text>
          <Text style={styles.tagline}>Inteligência competitiva em tempo real</Text>
        </View>

        {/* Form Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Acesso</Text>
          <Text style={styles.cardSub}>Área exclusiva para consultores Ford</Text>

          <View style={styles.divider} />

          <Input
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            placeholder="seu@email.com"
            keyboardType="email-address"
            error={errors.email}
          />

          <Input
            label="Senha"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
            error={errors.password}
          />

          <Button
            title="ENTRAR"
            onPress={handleLogin}
            loading={loading}
            style={styles.btn}
          />
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('Register')}
          style={styles.registerLink}
        >
          <Text style={styles.registerText}>
            Novo consultor?{' '}
            <Text style={styles.registerAction}>Criar conta</Text>
          </Text>
        </TouchableOpacity>

        {/* Footer */}
        <Text style={styles.footer}>Ford Motor Company © 2025</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: {
    flexGrow: 1,
    padding: spacing.lg,
    justifyContent: 'center',
    gap: spacing.lg,
  },
  header: { alignItems: 'center', paddingVertical: spacing.xl },
  logoRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    backgroundColor: colors.accentGlow,
  },
  logoText: { fontSize: 32, color: colors.accent },
  brand: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 6,
    color: colors.textPrimary,
  },
  tagline: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 6,
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: 1,
  },
  cardSub: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.lg,
  },
  btn: { marginTop: spacing.sm },
  registerLink: { alignItems: 'center', paddingVertical: spacing.sm },
  registerText: { color: colors.textSecondary, fontSize: 14 },
  registerAction: { color: colors.accent, fontWeight: '700' },
  footer: {
    color: colors.textMuted,
    fontSize: 11,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});
