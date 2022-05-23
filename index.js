const midi = require('midi');
const _ = require('lodash');

// Set up a new input.
const input = new midi.Input();

// Set up a new output.
const output = new midi.Output();

// Count the available input ports.
const portsCount = input.getPortCount();

let MPD_A_ID = null;
const MPD_A_NAME = 'MPD232 Port A';

for (let i = 0; i < portsCount; i++) {
  if (input.getPortName(i) === MPD_A_NAME) {
    console.log('Found MPD');
    MPD_A_ID = i;
  }
}

if (MPD_A_ID === null) {
  console.log('available devices:');
  for (let i = 0; i < portsCount; i++) {
    console.log(input.getPortName(i));
  }
  throw 'MPD not found';
}

input.openPort(MPD_A_ID);
output.openPort(MPD_A_ID);

const TYPE_CC = 176;

input.on(
  'message',
  _.throttle((deltaTime, message) => {
    const [type, number, value] = message;
    if (type !== TYPE_CC) return;

    // indicate buttons by knob value
    if ([11, 12, 13, 14, 15, 16, 17, 18].includes(number)) {
      output.sendMessage([TYPE_CC, 41, value > 0 ? 127 : 0]);
      output.sendMessage([TYPE_CC, 42, value > 16 ? 127 : 0]);
      output.sendMessage([TYPE_CC, 43, value > 32 ? 127 : 0]);
      output.sendMessage([TYPE_CC, 44, value > 48 ? 127 : 0]);
      output.sendMessage([TYPE_CC, 45, value > 64 ? 127 : 0]);
      output.sendMessage([TYPE_CC, 46, value > 80 ? 127 : 0]);
      output.sendMessage([TYPE_CC, 47, value > 96 ? 127 : 0]);
      output.sendMessage([TYPE_CC, 48, value > 112 ? 127 : 0]);
    }
    if ([21, 22, 23, 24, 25, 26, 27, 28].includes(number)) {
      output.sendMessage([TYPE_CC, 51, value > 0 ? 127 : 0]);
      output.sendMessage([TYPE_CC, 52, value > 16 ? 127 : 0]);
      output.sendMessage([TYPE_CC, 53, value > 32 ? 127 : 0]);
      output.sendMessage([TYPE_CC, 54, value > 48 ? 127 : 0]);
      output.sendMessage([TYPE_CC, 55, value > 64 ? 127 : 0]);
      output.sendMessage([TYPE_CC, 56, value > 80 ? 127 : 0]);
      output.sendMessage([TYPE_CC, 57, value > 96 ? 127 : 0]);
      output.sendMessage([TYPE_CC, 58, value > 112 ? 127 : 0]);
    }
    if ([31, 32, 33, 34, 35, 36, 37, 38].includes(number)) {
      output.sendMessage([TYPE_CC, 61, value > 0 ? 127 : 0]);
      output.sendMessage([TYPE_CC, 62, value > 16 ? 127 : 0]);
      output.sendMessage([TYPE_CC, 63, value > 32 ? 127 : 0]);
      output.sendMessage([TYPE_CC, 64, value > 48 ? 127 : 0]);
      output.sendMessage([TYPE_CC, 65, value > 64 ? 127 : 0]);
      output.sendMessage([TYPE_CC, 66, value > 80 ? 127 : 0]);
      output.sendMessage([TYPE_CC, 67, value > 96 ? 127 : 0]);
      output.sendMessage([TYPE_CC, 68, value > 112 ? 127 : 0]);
    }

    // reset buttons highlighting when press button
    if ([41, 42, 43, 44, 45, 46, 47, 48].includes(number)) {
      setTimeout(() => {
        output.sendMessage([TYPE_CC, 41, 0]);
        output.sendMessage([TYPE_CC, 42, 0]);
        output.sendMessage([TYPE_CC, 43, 0]);
        output.sendMessage([TYPE_CC, 44, 0]);
        output.sendMessage([TYPE_CC, 45, 0]);
        output.sendMessage([TYPE_CC, 46, 0]);
        output.sendMessage([TYPE_CC, 47, 0]);
        output.sendMessage([TYPE_CC, 48, 0]);
      }, 50);
    }
    if ([61, 62, 63, 64, 65, 66, 67, 68].includes(number)) {
      setTimeout(() => {
        output.sendMessage([TYPE_CC, 61, 0]);
        output.sendMessage([TYPE_CC, 62, 0]);
        output.sendMessage([TYPE_CC, 63, 0]);
        output.sendMessage([TYPE_CC, 64, 0]);
        output.sendMessage([TYPE_CC, 65, 0]);
        output.sendMessage([TYPE_CC, 66, 0]);
        output.sendMessage([TYPE_CC, 67, 0]);
        output.sendMessage([TYPE_CC, 68, 0]);
      }, 50);
    }
    console.log(`${number} ${value}`);
  }, 150),
);

output.sendMessage([TYPE_CC, 41, 127]);

process.stdin.resume();
