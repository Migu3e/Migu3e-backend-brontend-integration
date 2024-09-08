//based on the channel and knob position
export const calculateFrequency = (channel: number, knob: number, minFreq: number, maxFreq: number): number => {
    const channelStep = (maxFreq - minFreq) / 9;
    const channels: number[] = [];
    for (let i = 0; i < 10; i++) {
        const channelFreq = minFreq + channelStep * i;
        channels.push(channelFreq);
    }

    const frequencies: number[] = [];
    for (let channelIndex = 0; channelIndex < 9; channelIndex++) {
        const currentChannelFreq = channels[channelIndex];
        const nextChannelFreq = channels[channelIndex + 1];
        const freqStep = (nextChannelFreq - currentChannelFreq) / 10;

        for (let knobPosition = 0; knobPosition < 10; knobPosition++) {
            const frequency = currentChannelFreq + freqStep * knobPosition;
            frequencies.push(frequency);
        }
    }
    const index = (channel - 1) * 10 + (knob - 1);
    return frequencies[index];
};



// the channel and knob position based on the frequency
export const calculateChannelAndKnob = (frequency: number, minFreq: number, maxFreq: number): { channel: number, knob: number } => {
    const channelStep = (maxFreq - minFreq) / 9;
    const channels: number[] = [];

    for (let i = 0; i < 10; i++) {
        const channelFreq = minFreq + channelStep * i;
        channels.push(channelFreq);
    }

    const frequencies: number[] = [];
    for (let channelIndex = 0; channelIndex < 9; channelIndex++) {
        const currentChannelFreq = channels[channelIndex];
        const nextChannelFreq = channels[channelIndex + 1];
        const freqStep = (nextChannelFreq - currentChannelFreq) / 10;

        for (let knobPosition = 0; knobPosition < 10; knobPosition++) {
            const freq = currentChannelFreq + freqStep * knobPosition;
            frequencies.push(freq);
        }
    }

    let index = frequencies.findIndex(freq => freq >= frequency);
    if (index === -1) {
        index = frequencies.length - 1;
    }
    const totalKnobsPerChannel = 10;
    const channelIndex = Math.floor(index / totalKnobsPerChannel);
    const knobPosition = (index % totalKnobsPerChannel) + 1;

    const channel = channelIndex + 1;

    return { channel, knob: knobPosition };
};
