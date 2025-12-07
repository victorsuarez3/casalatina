/**
 * Splash Screen - Premium Cinematographic
 * Luxury first impression with animated elements
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Image,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { Button } from '../components/Button';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
  showContinueButton?: boolean;
  onContinue?: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish, showContinueButton = false, onContinue }) => {
  const { theme } = useTheme();

  // Animations - Start with black background for seamless transition from native splash
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.85)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const shimmerPosition = useRef(new Animated.Value(-width)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const sparkleOpacity = useRef(new Animated.Value(0)).current;
  const sparkleScale = useRef(new Animated.Value(0.1)).current; // Empieza pequeño como punto
  const sparkleRotate = useRef(new Animated.Value(-15)).current; // Empieza rotado
  const continueButtonOpacity = useRef(new Animated.Value(0)).current;
  const continueButtonTranslateY = useRef(new Animated.Value(20)).current;

  // Particles - Premium golden sparkles
  const particles: Particle[] = [
    { id: 1, x: width * 0.15, y: height * 0.25, size: 6, delay: 600 },
    { id: 2, x: width * 0.85, y: height * 0.2, size: 5, delay: 700 },
    { id: 3, x: width * 0.25, y: height * 0.45, size: 4, delay: 800 },
    { id: 4, x: width * 0.75, y: height * 0.55, size: 5, delay: 900 },
    { id: 5, x: width * 0.2, y: height * 0.75, size: 6, delay: 1000 },
    { id: 6, x: width * 0.8, y: height * 0.7, size: 4, delay: 1100 },
    { id: 7, x: width * 0.5, y: height * 0.15, size: 5, delay: 750 },
    { id: 8, x: width * 0.5, y: height * 0.85, size: 6, delay: 1050 },
  ];

  const particleAnims = useRef(
    particles.map(() => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    // Sequence of animations - Start immediately with black background
    Animated.sequence([
      // 1. Logo fade-in + scale (0-500ms) - Starts immediately
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),

      // 2. Text fade-in (500-1000ms)
      Animated.delay(200),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),

      // 3. Shimmer effect (800-1500ms)
      Animated.timing(shimmerPosition, {
        toValue: width * 2,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();

    // Particles animation (staggered sparkles)
    particles.forEach((particle, index) => {
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(particleAnims[index].opacity, {
            toValue: 0.9,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.loop(
            Animated.sequence([
              Animated.timing(particleAnims[index].translateY, {
                toValue: -20,
                duration: 2500,
                useNativeDriver: true,
              }),
              Animated.timing(particleAnims[index].translateY, {
                toValue: 0,
                duration: 2500,
                useNativeDriver: true,
              }),
            ])
          ),
        ]).start();
      }, particle.delay);
    });

    // Sparkle animation - Estilo RADIANT (1100ms - 200ms after logo)
    // Como una estrella lejana: crece explosivamente (0→2.0) y luego se asienta (2.0→1.0)
    // Mantiene -15° durante explosión/asentamiento, luego rota suavemente a 0°
    // VELOCIDAD MÁXIMA: destello instantáneo
    setTimeout(() => {
      // Fase 1: Aparece instantáneo (5ms)
      Animated.timing(sparkleOpacity, {
        toValue: 1,
        duration: 5,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start(() => {
        // Fase 2: EXPLOSIÓN - crece explosivo de 0.1 → 2.0 (40ms)
        // Mantiene -15° fijo
        Animated.timing(sparkleScale, {
          toValue: 2.0,
          duration: 40,
          easing: Easing.out(Easing.quad), // Explosión rápida
          useNativeDriver: true,
        }).start(() => {
          // Fase 3: ASENTAMIENTO - reduce de 2.0 → 1.0 (40ms)
          // Sigue manteniendo -15° fijo
          Animated.timing(sparkleScale, {
            toValue: 1.0,
            duration: 40,
            easing: Easing.out(Easing.cubic), // Suave asentamiento
            useNativeDriver: true,
          }).start(() => {
            // Fase 4: ROTACIÓN FINAL - rota seamless de -15° → 0° (80ms)
            Animated.timing(sparkleRotate, {
              toValue: 0,
              duration: 80,
              easing: Easing.bezier(0.25, 0.1, 0.25, 1.0), // Easing ultra suave (ease)
              useNativeDriver: true,
            }).start();
          });
        });
      });
    }, 1100); // 200ms después de que el logo aparece

    // Tagline fade-in (1200ms)
    setTimeout(() => {
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }, 1200);

    // Continue button fade-in (if enabled) - appears after all animations (2100ms)
    if (showContinueButton) {
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(continueButtonOpacity, {
            toValue: 1,
            duration: 500,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(continueButtonTranslateY, {
            toValue: 0,
            duration: 500,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]).start();
      }, 2100);
    } else {
      // Finish and transition (2100ms total - adjusted for background fade)
      setTimeout(() => {
        onFinish();
      }, 2100);
    }
  }, []);

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      {/* Background gradient - always visible with black background */}
      <LinearGradient
        colors={['#000000', 'rgba(15, 15, 15, 0.98)', '#000000']}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Radial vignette effect */}
      <View style={styles.vignette} />

      {/* Particles */}
      {particles.map((particle, index) => (
        <Animated.View
          key={particle.id}
          style={[
            styles.particle,
            {
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              opacity: particleAnims[index].opacity,
              transform: [{ translateY: particleAnims[index].translateY }],
            },
          ]}
        />
      ))}

      {/* Main content */}
      <View style={styles.content}>
        {/* Casa Latina Logo - Centered and Large */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <Image
            source={require('../../assets/splash-icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          {/* Sparkle - Top Right of Shield, overlapped on top */}
          <Animated.View
            style={[
              styles.sparkleContainer,
              {
                opacity: sparkleOpacity,
                transform: [
                  { scale: sparkleScale },
                  {
                    rotate: sparkleRotate.interpolate({
                      inputRange: [-15, 0],
                      outputRange: ['-15deg', '0deg'],
                    }),
                  },
                ],
              },
            ]}
          >
            <Svg width="50" height="50" viewBox="0 0 140 140">
              <Path
                d="M70 0 C63 20 55 28 35 35 C55 42 63 50 70 70 C77 50 85 42 105 35 C85 28 77 20 70 0 Z"
                fill="#F3E8D1"
              />
            </Svg>
          </Animated.View>
        </Animated.View>

        {/* Continue Button - appears after animation if showContinueButton is true */}
        {showContinueButton && (
          <Animated.View
            style={[
              styles.buttonContainer,
              {
                opacity: continueButtonOpacity,
                transform: [{ translateY: continueButtonTranslateY }],
              },
            ]}
          >
            <Button
              title="Continuar"
              onPress={() => {
                if (onContinue) {
                  onContinue();
                } else {
                  onFinish();
                }
              }}
              variant="primary"
              size="large"
              fullWidth
            />
          </Animated.View>
        )}
      </View>
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000000',
    },
    vignette: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'transparent',
      borderRadius: width / 2,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.8,
      shadowRadius: width / 2,
    },
    particle: {
      position: 'absolute',
      borderRadius: 50,
      backgroundColor: 'rgba(243, 232, 209, 0.85)',
      shadowColor: 'rgba(243, 232, 209, 1)',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 1,
      shadowRadius: 16,
      elevation: 10,
    },
    content: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 40,
    },
    logoContainer: {
      position: 'relative',
    },
    logo: {
      width: 260,
      height: 260,
      shadowColor: 'rgba(243, 232, 209, 0.6)',
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.8,
      shadowRadius: 32,
    },
    sparkleContainer: {
      position: 'absolute',
      top: 5, // Más cerca del borde superior del escudo
      right: 40, // Más cerca del borde derecho del escudo
      width: 50,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10, // Ensure it's on top
    },
    textContainer: {
      position: 'relative',
      overflow: 'hidden',
      paddingVertical: 20,
    },
    mainText: {
      fontSize: 32,
      fontWeight: '700',
      color: '#F3E8D1',
      fontFamily: 'Inter_700Bold',
      textAlign: 'center',
      letterSpacing: 5,
    },
    shimmer: {
      position: 'absolute',
      top: 0,
      left: -width,
      width: width,
      height: '100%',
    },
    shimmerGradient: {
      flex: 1,
      width: '100%',
    },
    tagline: {
      fontSize: 14,
      color: 'rgba(243, 232, 209, 0.7)',
      fontFamily: 'Inter_400Regular',
      letterSpacing: 1,
      marginTop: 20,
      textAlign: 'center',
    },
    buttonContainer: {
      position: 'absolute',
      bottom: 60,
      left: 40,
      right: 40,
      alignItems: 'center',
    },
  });
