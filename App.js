import {
	Animated,
	AppRegistry,
	Dimensions,
	Image,
	StyleSheet,
	Switch,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
	Vibration,
	View
} from 'react-native';
import React, { Component } from 'react';
import FAIcon from 'react-native-vector-icons/FontAwesome'; 

import { getCharacterBySequence } from './utility/morseTree';
import { TAPTYPE_DAH, TAPTYPE_DIT } from './utility/constants';

// Constants
const ORIGINAL_MESSAGE_BY_SAMUEL_MORSE = '[What hath God wrought?]';
const CHARACTER_DELAY_DURATION = 800;

// Global variables to keep track of when a morse sequence should be parsed into a character.
let characterCheckerIntervalId = null;
let previousTapTime = null;
let startPressTime = null;
export default class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			text: ORIGINAL_MESSAGE_BY_SAMUEL_MORSE,
			ditDahText: '',
			currentCharacter: '',
			morseSequence: [],
			showMorseTreeImage: false,
			automaticModeEnabled: true,
			backgroundHighlightTapAnim: new Animated.Value(300),
			textTapFadeAnim: new Animated.Value(0)
		};

		this.onPressIn = this.onPressIn.bind(this);
		this.onPressOut = this.onPressOut.bind(this);
		this.pressTextContainer = this.pressTextContainer.bind(this);
	}

	onPressIn() {
		if (this.state.automaticModeEnabled) {
			clearInterval(characterCheckerIntervalId);
		}
		startPressTime = Date.now();
	}

	onPressOut() {
		if (Date.now() - startPressTime <= 150) {
			this.pressedDit();
		} else {
			this.pressedDah();
		}
		if (this.state.automaticModeEnabled) {
			this.startCharacterCheckerInterval();
		}
	}
	pressedDit() {
		this.setState({ditDahText: 'dit'});
		this.startTapAnimation(150);
		this.addToMorseSequence(TAPTYPE_DIT);
	}

	pressedDah() {
		this.setState({ditDahText: 'dah'});
		this.startTapAnimation(300);
		this.addToMorseSequence(TAPTYPE_DAH);
	}

	addToMorseSequence(tapType) {
		const { text, morseSequence } = this.state;
		// If this is the first tap we want to clear the placeholder text on screen.
		if (text == ORIGINAL_MESSAGE_BY_SAMUEL_MORSE) {
			this.setState({text: ''});
		}
		morseSequence.push(tapType);
		this.setState({morseSequence: morseSequence});
		this.setState({currentCharacter: this.parseMorseSequence(false)});
	}

	startCharacterCheckerInterval() {
		previousTapTime = Date.now();
		characterCheckerIntervalId = setInterval(() => {
			if (Date.now() >= previousTapTime + CHARACTER_DELAY_DURATION) {
				clearInterval(characterCheckerIntervalId);
				this.addCharacterToText();
			}
		}, 20);
	}

	pressTextContainer() {
    		const { automaticModeEnabled, text, morseSequence } = this.state;
		if (!automaticModeEnabled && text != ORIGINAL_MESSAGE_BY_SAMUEL_MORSE) {
			if (morseSequence.length === 0) {
				this.setState({text: text + ' '});
			} else {
				this.addCharacterToText();
			}
		}
	}

	addCharacterToText() {
		let text = this.state.text;
		this.setState({text: text + this.parseMorseSequence()});
		this.setState({currentCharacter: ''});
	}

	parseMorseSequence(clearSequenceState = true) {
		const { morseSequence } = this.state;
		if (clearSequenceState) {
			this.setState({morseSequence: []});
		}
		return getCharacterBySequence(morseSequence); ;
	}

	startTapAnimation(duration) {
		Vibration.vibrate();
		setTimeout(() => {
			Vibration.cancel();
		}, duration);

		this.state.backgroundHighlightTapAnim.setValue(0);
		Animated.timing(this.state.backgroundHighlightTapAnim, {toValue: 300, duration: duration, useNativeDriver: false}).start();

		this.state.textTapFadeAnim.setValue(1);
		Animated.timing(this.state.textTapFadeAnim, {toValue: 0, duration: duration, useNativeDriver: false}).start();
	}

	render() {
		const { 
			text, currentCharacter, ditDahText, automaticModeEnabled, 
			backgroundHighlightTapAnim, textTapFadeAnim, showMorseTreeImage } = this.state;
		const color = this.state.backgroundHighlightTapAnim.interpolate({
				inputRange: [0, 300],
				outputRange: ['rgba(55, 113, 24, 0.5)', 'rgba(245, 252, 255, 1)']
		});
		const morseTreeButtonCaption = showMorseTreeImage ? 'Hide tree' : 'Show tree';
		
		return (
			<View style={styles.container}>
				<TouchableWithoutFeedback style={{flex: 1}} onPress={this.pressTextContainer}>
					<View style={styles.textContainer}>
						<View>
							<Text style={{fontSize: 48}}>{currentCharacter}</Text>
						</View>
						<Text style={styles.text}>{text}</Text>
						<Animated.View style={[styles.ditDahTextOverlay, {opacity: textTapFadeAnim, backgroundColor: color}]}>
							<Animated.Text style={styles.ditDahText}>{ditDahText}</Animated.Text>
						</Animated.View>
					</View>
				</TouchableWithoutFeedback>
				<View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
					<Text style={[styles.automaticModeText , {opacity: automaticModeEnabled ? 1 : 0.5}]}>Automatic character check</Text>
					<Switch onValueChange={(value) => this.setState({automaticModeEnabled: value})}
						style={{marginBottom: 10}}
						value={automaticModeEnabled} />
					<FAIcon.Button name='eye' onPress={() => this.setState({showMorseTreeImage: !showMorseTreeImage})}>
						{morseTreeButtonCaption}
					</FAIcon.Button>
					<FAIcon.Button name='remove' backgroundColor='#8D0508' 
						onPress={() => this.setState({text: ORIGINAL_MESSAGE_BY_SAMUEL_MORSE, morseSequence: [], currentCharacter: ''})}
					>
						Clear all text
					</FAIcon.Button>
				</View>
				<TouchableOpacity style={styles.touchable} activeOpacity={0.8}
					onPressIn={this.onPressIn} onPressOut={this.onPressOut} delayPressIn={0} delayPressOut={0}>
					<View style={{flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
						<FAIcon name={'hand-pointer-o'} size={48} style={{opacity: 0.6}}></FAIcon>
						<Text style={styles.touchableText}>press</Text>
						{showMorseTreeImage ? (
							<Image
							resizeMode="contain"
							source={require('./assets/morse-tree.png')}
							style={{ width: Dimensions.get('window').width }}/>) : null}
					</View>
				</TouchableOpacity>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'stretch'
	},
	textContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#F5FCFF'
	},
	text: {
		fontSize: 20,
		fontFamily: 'monospace'
	},
	ditDahTextOverlay: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0
	},
	ditDahText: {
		fontSize: 64,
		fontFamily: 'monospace',
		opacity: 0.4
	},
	touchable: {
		flex: 2,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'cadetblue'
	},
	touchableText: {
		fontSize: 32,
		fontFamily: 'monospace',
		opacity: 0.8
	},
	automaticModeText: {
		color: 'black',
		fontSize: 16,
		fontFamily: 'monospace'
	}
});
