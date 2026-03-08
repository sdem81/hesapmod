import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  calculatorCatalog,
  createInitialFormState,
  type CalculatorDefinition,
  type CalculatorField,
} from "./src/calculators";

const palette = {
  background: "#101820",
  backgroundSoft: "#172539",
  surface: "#f7f1e8",
  surfaceStrong: "#fffaf2",
  border: "#d9cbb8",
  text: "#122033",
  textSoft: "#5e6c84",
  accent: "#ee6c4d",
  accentStrong: "#d5573d",
  success: "#2a9d8f",
  shadow: "rgba(6, 13, 22, 0.18)",
};

function formatResult(
  value: number | string,
  kind: CalculatorDefinition["results"][number]["kind"],
  decimals = 0
) {
  if (kind === "text") {
    return String(value);
  }

  const numericValue = typeof value === "number" ? value : Number(value);
  const safeValue = Number.isFinite(numericValue) ? numericValue : 0;

  if (kind === "currency") {
    return `${safeValue.toLocaleString("tr-TR", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })} TL`;
  }

  return safeValue.toLocaleString("tr-TR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function FieldInput({
  field,
  value,
  accentColor,
  onChange,
}: {
  field: CalculatorField;
  value: string;
  accentColor: string;
  onChange: (nextValue: string) => void;
}) {
  if (field.type === "select") {
    return (
      <View style={styles.fieldBlock}>
        <Text style={styles.fieldLabel}>{field.label}</Text>
        <View style={styles.optionRow}>
          {field.options.map((option) => {
            const isActive = value === option.value;
            return (
              <Pressable
                key={option.value}
                onPress={() => onChange(option.value)}
                style={[
                  styles.optionChip,
                  isActive && {
                    backgroundColor: accentColor,
                    borderColor: accentColor,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    isActive && styles.optionTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
        {field.hint ? <Text style={styles.fieldHint}>{field.hint}</Text> : null}
      </View>
    );
  }

  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.fieldLabel}>{field.label}</Text>
      <View style={styles.inputShell}>
        <TextInput
          keyboardType="numeric"
          value={value}
          onChangeText={onChange}
          placeholder={field.placeholder}
          placeholderTextColor={palette.textSoft}
          style={styles.input}
        />
        {field.suffix ? <Text style={styles.inputSuffix}>{field.suffix}</Text> : null}
      </View>
      {field.hint ? <Text style={styles.fieldHint}>{field.hint}</Text> : null}
    </View>
  );
}

export default function App() {
  const [activeCalculatorId, setActiveCalculatorId] = useState(
    calculatorCatalog[0].id
  );
  const [forms, setForms] = useState(createInitialFormState);

  const activeCalculator =
    calculatorCatalog.find((calculator) => calculator.id === activeCalculatorId) ??
    calculatorCatalog[0];
  const activeValues = forms[activeCalculator.id];
  const results = activeCalculator.calculate(activeValues);

  function updateField(fieldId: string, nextValue: string) {
    setForms((current) => ({
      ...current,
      [activeCalculator.id]: {
        ...current[activeCalculator.id],
        [fieldId]: nextValue,
      },
    }));
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <Text style={styles.heroEyebrow}>HesapMod Mobile MVP</Text>
          <Text style={styles.heroTitle}>Mobil uygulamaya buradan baslayabilirsin.</Text>
          <Text style={styles.heroDescription}>
            Mevcut web mantiginin mobil karsiligini tek ekranda topladim. Bu baslangic
            surumu cihaz icinde hesaplama yapar ve uc populer araci hazir getirir.
          </Text>

          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Cihaz ici hesaplama</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Turkce oncelikli</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Expo tabanli</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Hesaplayici Sec</Text>
          <Text style={styles.sectionDescription}>
            Webdeki yapinin mobilde nasil gorunecegini gosteren ilk ekran.
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardRail}
        >
          {calculatorCatalog.map((calculator) => {
            const isActive = calculator.id === activeCalculator.id;
            return (
              <Pressable
                key={calculator.id}
                onPress={() => setActiveCalculatorId(calculator.id)}
                style={[
                  styles.calculatorCard,
                  isActive && {
                    backgroundColor: calculator.accentColor,
                    borderColor: calculator.accentColor,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.calculatorCategory,
                    isActive && styles.calculatorCategoryActive,
                  ]}
                >
                  {calculator.category}
                </Text>
                <Text
                  style={[
                    styles.calculatorTitle,
                    isActive && styles.calculatorTitleActive,
                  ]}
                >
                  {calculator.title}
                </Text>
                <Text
                  style={[
                    styles.calculatorSummary,
                    isActive && styles.calculatorSummaryActive,
                  ]}
                >
                  {calculator.summary}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Girdiler</Text>
          <Text style={styles.panelDescription}>
            {activeCalculator.summary}
          </Text>

          {activeCalculator.inputs.map((field) => (
            <FieldInput
              key={field.id}
              field={field}
              value={activeValues[field.id]}
              accentColor={activeCalculator.accentColor}
              onChange={(nextValue) => updateField(field.id, nextValue)}
            />
          ))}
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Sonuclar</Text>
          <Text style={styles.panelDescription}>
            Sonuclar her alan degistiginde aninda guncellenir.
          </Text>

          {activeCalculator.results.map((result) => (
            <View key={result.id} style={styles.resultCard}>
              <Text style={styles.resultLabel}>{result.label}</Text>
              <Text style={styles.resultValue}>
                {formatResult(results[result.id], result.kind, result.decimals)}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.roadmapCard}>
          <Text style={styles.roadmapTitle}>Sonraki mantikli adimlar</Text>
          <Text style={styles.roadmapItem}>
            1. Ortak cekirdege tasinan hesaplayici sayisini hizla artirmak.
          </Text>
          <Text style={styles.roadmapItem}>
            2. Favoriler, gecmis hesaplar ve cihaz ici saklama eklemek.
          </Text>
          <Text style={styles.roadmapItem}>
            3. Push bildirim, premium araclar veya offline paketleme dusunmek.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 36,
    gap: 18,
  },
  heroCard: {
    backgroundColor: palette.backgroundSoft,
    borderRadius: 28,
    padding: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  heroEyebrow: {
    color: "#ffd7cc",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  heroTitle: {
    color: "#fff7ef",
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "800",
  },
  heroDescription: {
    color: "#d7dfeb",
    fontSize: 15,
    lineHeight: 23,
    marginTop: 12,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 18,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  badgeText: {
    color: "#fff7ef",
    fontSize: 12,
    fontWeight: "600",
  },
  sectionHeader: {
    gap: 6,
  },
  sectionTitle: {
    color: "#fff7ef",
    fontSize: 22,
    fontWeight: "800",
  },
  sectionDescription: {
    color: "#b9c4d6",
    fontSize: 14,
    lineHeight: 20,
  },
  cardRail: {
    gap: 12,
    paddingRight: 8,
  },
  calculatorCard: {
    width: 260,
    borderRadius: 24,
    padding: 18,
    backgroundColor: palette.surfaceStrong,
    borderWidth: 1,
    borderColor: palette.border,
    shadowColor: palette.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  calculatorCategory: {
    color: palette.accentStrong,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  calculatorCategoryActive: {
    color: "#fff2ea",
  },
  calculatorTitle: {
    color: palette.text,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "800",
    marginTop: 12,
  },
  calculatorTitleActive: {
    color: "#fff8f2",
  },
  calculatorSummary: {
    color: palette.textSoft,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 10,
  },
  calculatorSummaryActive: {
    color: "#ffe5dd",
  },
  panel: {
    backgroundColor: palette.surface,
    borderRadius: 28,
    padding: 20,
    gap: 14,
  },
  panelTitle: {
    color: palette.text,
    fontSize: 22,
    fontWeight: "800",
  },
  panelDescription: {
    color: palette.textSoft,
    fontSize: 14,
    lineHeight: 20,
  },
  fieldBlock: {
    gap: 8,
  },
  fieldLabel: {
    color: palette.text,
    fontSize: 14,
    fontWeight: "700",
  },
  fieldHint: {
    color: palette.textSoft,
    fontSize: 12,
    lineHeight: 18,
  },
  inputShell: {
    minHeight: 56,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surfaceStrong,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: palette.text,
    fontWeight: "600",
  },
  inputSuffix: {
    color: palette.textSoft,
    fontSize: 13,
    fontWeight: "700",
    marginLeft: 12,
  },
  optionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  optionChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surfaceStrong,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  optionText: {
    color: palette.text,
    fontSize: 13,
    fontWeight: "700",
  },
  optionTextActive: {
    color: "#fff8f2",
  },
  resultCard: {
    borderRadius: 20,
    padding: 16,
    backgroundColor: palette.surfaceStrong,
    borderWidth: 1,
    borderColor: palette.border,
    gap: 8,
  },
  resultLabel: {
    color: palette.textSoft,
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  resultValue: {
    color: palette.text,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "800",
  },
  roadmapCard: {
    backgroundColor: "#163047",
    borderRadius: 28,
    padding: 20,
    gap: 10,
  },
  roadmapTitle: {
    color: "#f7f1e8",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 4,
  },
  roadmapItem: {
    color: "#dbe6f3",
    fontSize: 14,
    lineHeight: 21,
  },
});
