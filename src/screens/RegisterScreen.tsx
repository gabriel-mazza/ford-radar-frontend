import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { register } from '../services/api';
import { Button, Input, BackHeader } from '../components/UI';
import { colors, spacing, radius } from '../theme';

export default function RegisterScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (name.trim().length < 2) e.name = 'Nome muito curto';
    if (!email.includes('@')) e.email = 'E-mail inválido';
    if (password.length < 6) e.password = 'Senha: mínimo 6 caracteres';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleRegister() {
    if (!validate()) return;
    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password);
      Alert.alert('Conta criada!', 'Faça login para continuar.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Erro ao criar conta. Tente novamente.';
      Alert.alert('Erro', msg);
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
        <BackHeader title="Criar Conta" onBack={() => navigation.goBack()} />

        <View style={styles.card}>
          <Text style={styles.title}>Novo Consultor</Text>
          <Text style={styles.sub}>Preencha os dados para criar seu acesso</Text>

          <View style={styles.divider} />

          <Input
            label="Nome completo"
            value={name}
            onChangeText={setName}
            placeholder="João Silva"
            autoCapitalize="words"
            error={errors.name}
          />
          <Input
            label="E-mail corporativo"
            value={email}
            onChangeText={setEmail}
            placeholder="joao@ford.com.br"
            keyboardType="email-address"
            error={errors.email}
          />
          <Input
            label="Senha"
            value={password}
            onChangeText={setPassword}
            placeholder="Mínimo 6 caracteres"
            secureTextEntry
            error={errors.password}
          />

          <View style={styles.roleInfo}>
            <Text style={styles.roleInfoText}>
              ⓘ  Conta será criada com perfil de Consultor (ANALISTA)
            </Text>
          </View>

          <Button
            title="CRIAR CONTA"
            onPress={handleRegister}
            loading={loading}
            style={styles.btn}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { flexGrow: 1, padding: spacing.lg },
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.sm,
  },
  title: { fontSize: 20, fontWeight: '800', color: colors.textPrimary, letterSpacing: 1 },
  sub: { fontSize: 13, color: colors.textSecondary, marginTop: 2, marginBottom: spacing.md },
  divider: { height: 1, backgroundColor: colors.border, marginBottom: spacing.lg },
  roleInfo: {
    backgroundColor: colors.accentGlow,
    borderRadius: radius.sm,
    padding: spacing.sm,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.accentDim,
  },
  roleInfoText: { color: colors.accent, fontSize: 12 },
  btn: { marginTop: spacing.xs },
});
