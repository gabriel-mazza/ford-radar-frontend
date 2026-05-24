import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { compareVehicle } from '../services/api';
import { Button, Input, BackHeader, Tag, Card, SectionHeader } from '../components/UI';
import { colors, spacing, radius } from '../theme';

const SUGGESTED_ATTRIBUTES = [
  'motor', 'potência', 'torque', 'transmissão', 'tração',
  'amortecedores', 'capacidade de carga', 'modos de condução',
  'consumo', 'dimensões', 'peso', 'freios', 'suspensão',
];


const DANGEROUS_CHARS = /[<>'"`;\\|&${}()\[\]]/;

function sanitize(value: string): string {
  return value.replace(DANGEROUS_CHARS, '').slice(0, 100);
}

function isSafe(value: string): boolean {
  return !DANGEROUS_CHARS.test(value);
}

export default function CompareScreen({ navigation }: any) {
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [version, setVersion] = useState('');
  const [attrInput, setAttrInput] = useState('');
  const [attributes, setAttributes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleBrandChange(text: string) {
    setBrand(sanitize(text));
  }

  function handleModelChange(text: string) {
    setModel(sanitize(text));
  }

  function handleVersionChange(text: string) {
    setVersion(sanitize(text));
  }

  function addAttribute(attr: string) {
    const clean = sanitize(attr.trim().toLowerCase());
    if (!clean) return;
    if (clean.length > 50) {
      Alert.alert('Atributo inválido', 'O atributo deve ter no máximo 50 caracteres.');
      return;
    }
    if (!isSafe(attr)) {
      Alert.alert('Atributo inválido', 'O atributo contém caracteres não permitidos.');
      return;
    }
    if (attributes.includes(clean)) return;
    if (attributes.length >= 20) {
      Alert.alert('Limite atingido', 'Máximo de 20 atributos por análise.');
      return;
    }
    setAttributes((prev) => [...prev, clean]);
    setAttrInput('');
  }

  function removeAttribute(attr: string) {
    setAttributes((prev) => prev.filter((a) => a !== attr));
  }

  function validate() {
    const e: Record<string, string> = {};

    if (!brand.trim()) {
      e.brand = 'Marca é obrigatória';
    } else if (brand.trim().length > 100) {
      e.brand = 'Marca deve ter no máximo 100 caracteres';
    } else if (!isSafe(brand)) {
      e.brand = 'Marca contém caracteres não permitidos';
    }

    if (!model.trim()) {
      e.model = 'Modelo é obrigatório';
    } else if (model.trim().length > 100) {
      e.model = 'Modelo deve ter no máximo 100 caracteres';
    } else if (!isSafe(model)) {
      e.model = 'Modelo contém caracteres não permitidos';
    }

    if (!version.trim()) {
      e.version = 'Versão é obrigatória';
    } else if (version.trim().length > 100) {
      e.version = 'Versão deve ter no máximo 100 caracteres';
    } else if (!isSafe(version)) {
      e.version = 'Versão contém caracteres não permitidos';
    }

    if (attributes.length === 0) {
      e.attrs = 'Adicione ao menos 1 atributo';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleAnalyze() {
    if (!validate()) return;
    setLoading(true);
    try {
      const result = await compareVehicle({
        brand: brand.trim(),
        model: model.trim(),
        version: version.trim(),
        targetAttributes: attributes,
      });
      navigation.navigate('CompareResult', { result, attributes });
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        'Não foi possível analisar o veículo. Verifique a conexão.';
      Alert.alert('Erro na análise', msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <BackHeader title="Radar de Concorrência" onBack={() => navigation.goBack()} />

        <View style={styles.banner}>
          <Text style={styles.bannerIcon}>⚡</Text>
          <Text style={styles.bannerText}>
            Informe o veículo concorrente e os atributos. A IA montará a ficha técnica comparativa.
          </Text>
        </View>

        <Card style={styles.card}>
          <SectionHeader title="Veículo Concorrente" subtitle="Marca, modelo e versão exatos" />

          <Input
            label="Marca"
            value={brand}
            onChangeText={handleBrandChange}
            placeholder="Ex: Toyota, Volkswagen, Chevrolet"
            autoCapitalize="words"
            error={errors.brand}
          />
          <Input
            label="Modelo"
            value={model}
            onChangeText={handleModelChange}
            placeholder="Ex: Hilux, Amarok, S10"
            autoCapitalize="words"
            error={errors.model}
          />
          <Input
            label="Versão"
            value={version}
            onChangeText={handleVersionChange}
            placeholder="Ex: GR-Sport, V6, High Country"
            autoCapitalize="words"
            error={errors.version}
          />
        </Card>

        <Card style={[styles.card, errors.attrs ? styles.cardError : null]}>
          <SectionHeader
            title="Atributos para Análise"
            subtitle="O que você quer comparar?"
          />

          <View style={styles.attrRow}>
            <TextInput
              value={attrInput}
              onChangeText={(text) => setAttrInput(sanitize(text))}
              placeholder="Digite um atributo..."
              placeholderTextColor={colors.textMuted}
              style={styles.attrInput}
              onSubmitEditing={() => addAttribute(attrInput)}
              returnKeyType="done"
              maxLength={50}
            />
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => addAttribute(attrInput)}
            >
              <Text style={styles.addBtnText}>+</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.suggestLabel}>Sugestões:</Text>
          <View style={styles.suggestions}>
            {SUGGESTED_ATTRIBUTES.filter((s) => !attributes.includes(s)).slice(0, 8).map((s) => (
              <TouchableOpacity
                key={s}
                style={styles.suggestion}
                onPress={() => addAttribute(s)}
              >
                <Text style={styles.suggestionText}>+ {s}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {attributes.length > 0 && (
            <View style={styles.selectedSection}>
              <Text style={styles.selectedLabel}>Selecionados ({attributes.length}/20):</Text>
              <View style={styles.tags}>
                {attributes.map((a) => (
                  <Tag key={a} label={a} onRemove={() => removeAttribute(a)} />
                ))}
              </View>
            </View>
          )}

          {errors.attrs && <Text style={styles.errorText}>{errors.attrs}</Text>}
        </Card>

        <Button
          title={loading ? 'Analisando com IA...' : '⚡  ANALISAR CONCORRÊNCIA'}
          onPress={handleAnalyze}
          loading={loading}
          style={styles.analyzeBtn}
        />

        <Text style={styles.disclaimer}>
          A análise usa IA e pode levar alguns segundos na primeira consulta.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },
  banner: {
    flexDirection: 'row',
    backgroundColor: colors.accentGlow,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.accentDim,
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  bannerIcon: { fontSize: 18 },
  bannerText: { color: colors.accent, fontSize: 13, flex: 1, lineHeight: 18 },
  card: { marginBottom: spacing.md },
  cardError: { borderColor: colors.danger },
  attrRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  attrInput: {
    flex: 1,
    backgroundColor: colors.bgInput,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    color: colors.textPrimary,
    fontSize: 14,
  },
  addBtn: {
    width: 48,
    backgroundColor: colors.fordBlueLight,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: { color: '#fff', fontSize: 24, fontWeight: '300', lineHeight: 28 },
  suggestLabel: {
    fontSize: 11,
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  suggestions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  suggestion: {
    backgroundColor: colors.bgElevated,
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: colors.border,
  },
  suggestionText: { color: colors.textSecondary, fontSize: 12 },
  selectedSection: { marginTop: spacing.md },
  selectedLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  tags: { flexDirection: 'row', flexWrap: 'wrap' },
  errorText: { color: colors.danger, fontSize: 12, marginTop: spacing.xs },
  analyzeBtn: { marginTop: spacing.sm },
  disclaimer: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: 11,
    marginTop: spacing.md,
    lineHeight: 16,
  },
});