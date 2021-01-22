var sdk = require("microsoft-cognitiveservices-speech-sdk");
var readline = require("readline");

const { subscriptionKey, serviceRegion, filename } = require('../../config.json');

module.exports = {
	name: 'speak',
	description: 'Give words to be spoken.',
	args: true,
	execute(message, args) {
        let textCommand = args.toString();
        let text = textCommand.substring(6);

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

		message.channel.send(text);
	},
};