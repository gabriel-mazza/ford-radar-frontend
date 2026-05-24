import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  Alert,
} from 'react-native';
import { listPredictions, getPredictionByVin, PredictionResponse } from '../services/api';
import { BackHeader, ScoreBadge, Card, Button } from '../components/UI';
import { colors, spacing, radius } from '../theme';

function PredictionCard({
  item,
  onPress,
}: {
  item: PredictionResponse;
  onPress: () => void;
}) {
  const date = new Date(item.predictionDate).toLocaleDateString('pt-BR');

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.75}>
      <Card style={styles.predCard}>
        <View style={styles.predRow}>
          <View style={{ flex: 1, gap: 3 }}>
            <Text style={styles.predName}>{item.customerName || 'Cliente sem nome'}</Text>
            <Text style={styles.predVin}>VIN: {item.vin}</Text>
            <Text style={styles.predEmail}>{item.customerEmail}</Text>
            <Text style={styles.predDate}>{date}</Text>
          </View>
          <ScoreBadge score={Number(item.retentionScore)} />
        </View>
      </Card>
    </TouchableOpacity>
  );
}

export default function PredictionsScreen({ navigation }: any) {
  const [predictions, setPredictions] = useState<PredictionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [vinSearch, setVinSearch] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchList = useCallback(async (p = 0, clear = false) => {
    try {
      const data = await listPredictions(p, 10);
      setPredictions((prev) => (clear ? data.content : [...prev, ...data.content]));
      setTotalPages(data.totalPages);
      setPage(p);
    } catch (err: any) {
      Alert.alert('Erro', 'Não foi possível carregar as predições.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchList(0, true);
  }, [fetchList]);

  async function handleVinSearch() {
    if (vinSearch.trim().length !== 17) {
      Alert.alert('VIN inválido', 'O VIN deve ter exatamente 17 caracteres.');
      return;
    }
    setSearchLoading(true);
    try {
      const result = await getPredictionByVin(vinSearch.trim().toUpperCase());
      navigation.navigate('PredictionDetail', { prediction: result });
    } catch (err: any) {
      const msg = err?.response?.status === 404
        ? 'VIN não encontrado na base.'
        : 'Erro ao buscar. Verifique a conexão.';
      Alert.alert('Não encontrado', msg);
    } finally {
      setSearchLoading(false);
    }
  }

  function handleLoadMore() {
    if (page + 1 < totalPages && !loading) {
      fetchList(page + 1);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <BackHeader title="Retenção de Clientes" onBack={() => navigation.goBack()} />

          {/* VIN search */}
          <View style={styles.searchBar}>
            <TextInput
              value={vinSearch}
              onChangeText={(v) => setVinSearch(v.toUpperCase())}
              placeholder="Buscar por VIN (17 caracteres)..."
              placeholderTextColor={colors.textMuted}
              style={styles.searchInput}
              autoCapitalize="characters"
              maxLength={17}
            />
            <TouchableOpacity
              style={[styles.searchBtn, searchLoading && { opacity: 0.5 }]}
              onPress={handleVinSearch}
              disabled={searchLoading}
            >
              <Text style={styles.searchBtnText}>🔍</Text>
            </TouchableOpacity>
          </View>
        </View>

        {loading && predictions.length === 0 ? (
          <View style={styles.center}>
            <Text style={styles.loadingText}>Carregando predições...</Text>
          </View>
        ) : predictions.length === 0 ? (
          <View style={styles.center}>
            <Text style={styles.emptyIcon}>📊</Text>
            <Text style={styles.emptyText}>Nenhuma predição cadastrada.</Text>
            <Text style={styles.emptyHint}>Os scores são gerados pelo modelo de ML.</Text>
          </View>
        ) : (
          <FlatList
            data={predictions}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <PredictionCard
                item={item}
                onPress={() => navigation.navigate('PredictionDetail', { prediction: item })}
              />
            )}
            contentContainerStyle={styles.list}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.3}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  setRefreshing(true);
                  fetchList(0, true);
                }}
                tintColor={colors.accent}
              />
            }
            ListFooterComponent={
              page + 1 < totalPages ? (
                <Text style={styles.loadMore}>↓ Carregando mais...</Text>
              ) : null
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { flex: 1 },
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  searchBar: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  searchInput: {
    flex: 1,
    backgroundColor: colors.bgInput,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    color: colors.textPrimary,
    fontSize: 13,
    letterSpacing: 1,
  },
  searchBtn: {
    width: 44,
    backgroundColor: colors.fordBlueLight,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBtnText: { fontSize: 18 },

  list: { padding: spacing.lg, gap: spacing.sm, paddingBottom: spacing.xxl },

  predCard: { padding: spacing.md },
  predRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  predName: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  predVin: { fontSize: 11, color: colors.accent, fontFamily: 'Courier New', letterSpacing: 0.5 },
  predEmail: { fontSize: 11, color: colors.textSecondary },
  predDate: { fontSize: 10, color: colors.textMuted },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  loadingText: { color: colors.textSecondary, fontSize: 14 },
  emptyIcon: { fontSize: 48, marginBottom: spacing.sm },
  emptyText: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  emptyHint: { fontSize: 13, color: colors.textSecondary, textAlign: 'center' },

  loadMore: { textAlign: 'center', color: colors.textMuted, padding: spacing.md },
});
