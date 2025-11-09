import React from 'react';
import { StyleSheet, TouchableOpacity, Text, ViewStyle, TextStyle } from 'react-native';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

// Button Theme: Dark background with neon blue accents
export const buttonTheme = {
  primary: {
    backgroundColor: 'rgba(10, 14, 39, 1)', // Dark navy/black background
    borderColor: 'rgba(255, 255, 255, 1)', // White border
    borderWidth: 2,
    textColor: 'rgba(255, 255, 255, 1)', // White text
    shadowColor: 'rgba(0, 217, 255, 1)', // Neon glow
  },
};

export const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: buttonTheme.primary.backgroundColor,
    borderColor: buttonTheme.primary.borderColor,
    borderWidth: buttonTheme.primary.borderWidth,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    shadowColor: buttonTheme.primary.shadowColor,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryText: {
    color: buttonTheme.primary.textColor,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
    textShadowColor: buttonTheme.primary.shadowColor,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
  disabled: {
    backgroundColor: 'rgba(26, 26, 26, 1)',
    borderColor: 'rgba(102, 102, 102, 1)',
    opacity: 0.7,
  },
});

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  buttonStyle,
  textStyle,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[buttonStyles.primary, buttonStyle, disabled && buttonStyles.disabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={[buttonStyles.primaryText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;

