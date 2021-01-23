var sdk = require("microsoft-cognitiveservices-speech-sdk");
var path = require('path');

const { subscriptionKey, serviceRegion, filename } = require('../../config.json');

function speak(text) {
    // now create the audio-config pointing to our stream and
    // the speech config specifying the language.
    var audioConfig = sdk.AudioConfig.fromAudioFileOutput(filename);
    var speechConfig = sdk.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);
    
    // create the speech synthesizer.
    var synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

    // start the synthesizer and wait for a result.
    synthesizer.speakTextAsync(text, function (result) {
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
            console.log("synthesis finished.");
        } else {
            console.error("Speech synthesis canceled, " + result.errorDetails +
                "\nDid you update the subscription info?");
        }
        synthesizer.close();
        synthesizer = undefined;
    }, function (err) {
        console.trace("err - " + err);
        synthesizer.close();
        synthesizer = undefined;
    });
    console.log("Now synthesizing to: " + filename);
}

module.exports = {
	name: 'speak',
	description: 'Give words to be spoken.',
	args: true,
	async execute(message, args) {

        // Cannot join if message author is not in a voice channel
        if (!message.member.voice.channel) {
            message.reply('You must be in a voice channel to use the "speak" command');
            return;
        }

        let textCommand = args.toString();
        let text = textCommand.substring(6);

        // Join the same voice channel of the author of the message
        message.member.voice.channel.join().then((connection) => {
            //speak(text);
            connection.play('troll_audio.wav');
        });
	},
};