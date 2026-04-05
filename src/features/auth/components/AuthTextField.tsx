import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  type KeyboardTypeOptions,
  type ReturnKeyTypeOptions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { authTheme } from "./authTheme";

interface AuthTextFieldProps {
  value: string;
  onChangeText: (value: string) => void;
  onBlur?: () => void;
  placeholder: string;
  label?: string;
  error?: string;
  secureTextEntry?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  keyboardType?: KeyboardTypeOptions;
  textContentType?:
    | "none"
    | "URL"
    | "addressCity"
    | "addressCityAndState"
    | "addressState"
    | "countryName"
    | "creditCardNumber"
    | "emailAddress"
    | "familyName"
    | "fullStreetAddress"
    | "givenName"
    | "jobTitle"
    | "location"
    | "middleName"
    | "name"
    | "namePrefix"
    | "nameSuffix"
    | "nickname"
    | "organizationName"
    | "postalCode"
    | "streetAddressLine1"
    | "streetAddressLine2"
    | "sublocality"
    | "telephoneNumber"
    | "username"
    | "password"
    | "newPassword"
    | "oneTimeCode";
  autoComplete?:
    | "additional-name"
    | "address-line1"
    | "address-line2"
    | "birthdate-day"
    | "birthdate-full"
    | "birthdate-month"
    | "birthdate-year"
    | "cc-csc"
    | "cc-exp"
    | "cc-exp-day"
    | "cc-exp-month"
    | "cc-exp-year"
    | "cc-number"
    | "country"
    | "current-password"
    | "email"
    | "family-name"
    | "given-name"
    | "honorific-prefix"
    | "honorific-suffix"
    | "name"
    | "new-password"
    | "nickname"
    | "one-time-code"
    | "organization"
    | "postal-code"
    | "street-address"
    | "tel"
    | "username"
    | "off";
  returnKeyType?: ReturnKeyTypeOptions;
  onSubmitEditing?: () => void;
}

export function AuthTextField({
  value,
  onChangeText,
  onBlur,
  placeholder,
  label,
  error,
  secureTextEntry = false,
  autoCapitalize = "none",
  keyboardType,
  textContentType,
  autoComplete,
  returnKeyType,
  onSubmitEditing,
}: AuthTextFieldProps) {
  const [isSecure, setIsSecure] = useState(secureTextEntry);

  return (
    <View style={{ marginBottom: error ? 10 : 14 }}>
      {label ? (
        <Text
          className="font-bold"
          style={{
            color: "#6d6468",
            fontSize: 11,
            letterSpacing: 1.1,
            marginBottom: 8,
          }}
        >
          {label}
        </Text>
      ) : null}
      <View
        className="flex-row items-center"
        style={{
          height: 48,
          borderRadius: 11,
          backgroundColor: authTheme.field,
          borderWidth: 1,
          borderColor: error ? "#f0b7c8" : authTheme.fieldBorder,
          paddingHorizontal: 14,
        }}
      >
        <TextInput
          className="flex-1"
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          placeholder={placeholder}
          placeholderTextColor="#c5babd"
          secureTextEntry={isSecure}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          textContentType={textContentType}
          autoComplete={autoComplete}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          style={{
            color: authTheme.text,
            fontSize: 15,
            paddingVertical: 0,
          }}
        />
        {secureTextEntry ? (
          <TouchableOpacity
            accessibilityRole="button"
            activeOpacity={0.7}
            onPress={() => setIsSecure((current) => !current)}
            style={{ marginLeft: 10 }}
          >
            <Ionicons
              name={isSecure ? "eye-outline" : "eye-off-outline"}
              size={18}
              color="#b5abad"
            />
          </TouchableOpacity>
        ) : null}
      </View>
      {error ? (
        <Text style={{ color: "#dc5d87", fontSize: 12, marginTop: 6 }}>{error}</Text>
      ) : null}
    </View>
  );
}
