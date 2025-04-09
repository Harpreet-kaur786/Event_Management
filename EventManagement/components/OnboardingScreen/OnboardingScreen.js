import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function OnboardingScreen({ navigation }) {
  return (
    <LinearGradient
      colors={['#3E82F7', '#A55DE8']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      {/* Gradient Circles */}
      <LinearGradient
        colors={['#61C2F3', '#C66AE1']}
        style={[styles.circle, styles.circle1]}
      />
      <LinearGradient
        colors={['#61C2F3', '#C66AE1']}
        style={[styles.circle, styles.circle2]}
      />

      {/* Main Text */}
      <View style={styles.textWrapper}>
        <Text style={styles.heading}>Create & find{'\n'}events in{'\n'}one place.</Text>
      </View>

      {/* Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.replace('Dashboard')}
      >
        <Text style={styles.buttonText}>Lets get started →</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 30,
    position: 'relative',
  },
  circle: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.6,
  },
  circle1: {
    width: width * 0.8,
    height: width * 0.8,
    top: -100,
    left: -100,
  },
  circle2: {
    width: width * 0.5,
    height: width * 0.5,
    bottom: 100,
    right: -80,
  },
  textWrapper: {
    marginBottom: 70,
  },
  heading: {
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 38,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 26,
    borderRadius: 30,
    alignItems: 'center',
    alignSelf: 'center',
  },
  buttonText: {
    color: '#6B4EFF',
    fontSize: 16,
    fontWeight: '600',
  },
});


// import React from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';

// const { width, height } = Dimensions.get('window');

// export default function OnboardingScreen({ navigation }) {
//   return (
//     <LinearGradient
//       colors={['#A55DE8','#3E82F7']} 
//       start={{ x: 0.5, y: 0 }}
//       end={{ x: 0.5, y: 1 }}
//       style={styles.container}
//     >
//       {/* Gradient Circles */}
//       <LinearGradient
//         colors={['#E8A8F8', '#A0E1FF']}
//         style={[styles.circle, styles.circle1]}
//       />
//       <LinearGradient
//         colors={['#E8A8F8', '#A0E1FF']}
//         style={[styles.circle, styles.circle2]}
//       />

//       {/* Center Image */}
//       <Image
//         source={require('../../assets/FrontImage.png')}
//         style={styles.image}
//         resizeMode="contain"
//       />

//       {/* Main Text */}
//       <View style={styles.textWrapper}>
//         <Text style={styles.heading}>Create & find{'\n'}events in{'\n'}one place.</Text>
//       </View>

//       {/* Button */}
//       <TouchableOpacity
//         style={styles.button}
//         onPress={() => navigation.replace('Dashboard')}
//       >
//         <Text style={styles.buttonText}>Lets get started →</Text>
//       </TouchableOpacity>
//     </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     padding: 30,
//     position: 'relative',
//   },
//   circle: {
//     position: 'absolute',
//     borderRadius: 999,
//     opacity: 0.4,
//   },
//   circle1: {
//     width: width * 0.8,
//     height: width * 0.8,
//     top: -100,
//     left: -100,
//   },
//   circle2: {
//     width: width * 0.5,
//     height: width * 0.5,
//     bottom: 100,
//     right: -80,
//   },
//   image: {
//     width: width * 0.7,
//     height: height * 0.3,
//     marginTop: 50,
//     alignSelf: 'center',
//   },
//   textWrapper: {
//     marginBottom: 70,
//   },
//   heading: {
//     fontSize: 30,
//     color: '#fff',
//     fontWeight: 'bold',
//     textAlign: 'center',
//     lineHeight: 38,
//   },
//   button: {
//     backgroundColor: '#fff',
//     paddingVertical: 16,
//     paddingHorizontal: 26,
//     borderRadius: 30,
//     alignItems: 'center',
//     alignSelf: 'center',
//     marginBottom: 40,
//   },
//   buttonText: {
//     color: '#6B4EFF',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });
