export const isNumeric = (char: string) => char !== ' ' && !isNaN(Number(char));

export const isAlphabet = (char: string) => {
	const code = char.charCodeAt(0);

	return code >= 97 && code <= 122;
};

export const getLeadingNumeric = (text: string, i: number) => {
	let kind = '';

	for (; isNumeric(text[i]) || text[i] === '.'; i++) {
		kind += text[i];
	}

	return [Number(kind || NaN), i] as const;
};

export const getLiteralPosition = (text: string, i: number, match: string) => {
	let buffer = '';

	for (; text[i] !== match; i++) {
		buffer += text[i];
	}

	return [buffer, i] as const;
};

export const getNumericSize = (n: number) => {
	let a = 10;
	let b = 1;

	while (n / a >= 1) {
		a *= 10;
		b++;
	}

	return b;
};

// Unfortunately, since we're targeting wide compatibility, we need to increase the complexity limit
/* eslint-disable complexity */
export const parse = (text: string) => {
	const low = text.toLowerCase();
	const objet = {
		title: {
			original: '',
			seasonal: '',
			series: '',
		},
		file: {
			name: text,
			resolution: '',
			codec: {
				video: '',
				audio: '',
			},
		},
		provider: {
			channel: '',
		},
		episodes: [] as number[],
		seasons: [] as number[],
	};

	let buffer = '';

	for (let i = 0; i < low.length; i++) {
		switch (low[i]) {
			case '-': {
				// Should be matched during default match -> to be title
				if (
					isNumeric(low[i - 1])
					&& isNumeric(low[i + 1])
				) {
					// Catch SERIESN-N pattern
					let _kind = low[i - 1];

					for (let k = i - 2; isNumeric(low[k]); k++) {
						_kind = low[k] + _kind;
					}

					const kind = Number(_kind);
					const [following, next] = getLeadingNumeric(text, i + 1);

					// Case of 1-1
					if (!(following - kind)) {
						buffer += text[i];

						continue;
					}

					objet.title.series = objet.title.series.slice(0, -1);
					objet.episodes = new Array(following - kind + 1).fill(kind).map((_, i) => _ + i);
					buffer = '';
					i = next;

					continue;
				} else if (low[i - 1] !== ' ') {
					// It's not type of episode number or series name
					buffer += text[i];

					continue;
				}

				// It's kind of episode number or series name
				// Let's set the title and empty buffer
				objet.title.seasonal ||= objet.title.original + buffer;
				// Fallback for original title because of default case of switch statement
				objet.title.original ||= objet.title.seasonal;

				// If text[i + 2] equal to number or string
				// Note that i is original i at the start of this code block
				const expect = ++i + 1;

				if (isNumeric(low[expect])) {
					// Should be episode number
					const [kind, next] = getLeadingNumeric(low, expect);

					objet.episodes = [kind];
					i = next;
				} else if (low.indexOf('-', i) >= 0) {
					// Should be series name
					const [series, next] = getLiteralPosition(text, i, '-');

					objet.title.series += series.trim();
					// Make sure that the hyphen to be matched in next loop
					i = next - 1;
				} else if (low.indexOf('(', i) >= 0) {
					const [series, next] = getLiteralPosition(text, i, '(');

					objet.title.series += series.trim();
					// Make sure that the symbol to be matched in next loop
					i = next - 1;
				}

				break;
			}

			case '(': {
				// Fallback if there was no hyphen during loop
				objet.title.seasonal ||= objet.title.original + buffer;
				objet.title.original ||= objet.title.seasonal;

				// Skip initial
				i++;

				const [inner, next] = getLiteralPosition(text, i, ')');
				const parts = inner.split(' ');

				if (parts.length === 1) {
					buffer += text[i];

					continue;
				}

				// Almost every extractors set like: CHANNEL RESOLUTION VIDEO_CODEC AUDIO_CODEC
				const [channel, resolution, videoCodec, ..._audioCodec] = parts;

				objet.provider.channel = channel;
				objet.file.resolution = resolution;
				objet.file.codec.video = videoCodec;
				objet.file.codec.audio = _audioCodec.join(' ');
				i = next;

				break;
			}

			case 's': {
				// Check if SNEN style available
				const [kind, next] = getLeadingNumeric(low, i + 1);

				if (
					isNaN(kind)
					|| isAlphabet(low[i - 1]) // Reduce error rate by assumption: avoid TITLESN
				) {
					buffer += text[i];

					continue;
				}

				// Set the title before clearing out the buffer
				objet.title.original ||= buffer;
				objet.title.seasonal ||= buffer + text[i] + kind;

				// Put seasonal data
				objet.seasons.push(kind);
				buffer = '';
				i = next;

				break;
			}

			case 'e': {
				// Check if SNEN style available
				const [kind, next] = getLeadingNumeric(low, i + 1);

				if (isNaN(kind)) {
					buffer += text[i];

					break;
				}

				objet.episodes = [kind];
				buffer = '';
				i = next;

				break;
			}

			case ']': {
				buffer = '';

				break;
			}

			default: {
				// Think about the case of: 1st, 2nd, 3rd, and Nth season
				if (isNumeric(low[i])) {
					const [kind, unitFrom] = getLeadingNumeric(low, i);
					const unit = low.slice(unitFrom, unitFrom + 2);

					if (['st', 'nd', 'rd', 'th'].indexOf(unit) >= 0) {
						// Fill out the seasonal information and the title
						objet.title.original ||= buffer;
						objet.seasons = [kind];
						buffer = kind + unit;
						i = unitFrom + 2;
					} else if (!isAlphabet(low[i + getNumericSize(kind) + 1])) {
						// Heuristically guess seasonal information
						// If text[i + 2] is not alphabet, I suppose text[i + 2] is space or hyphen
						objet.title.original ||= buffer;
						objet.seasons = [kind];
						buffer = kind.toString();
						i = unitFrom;
					}
				}

				if (
					buffer.length
					|| low[i] !== ' '
				) {
					buffer += text[i];
				}
			}
		}
	}

	if (!objet.seasons.length) {
		objet.seasons.push(1);
	}

	objet.title.original = objet.title.original.trim();
	objet.title.seasonal = objet.title.seasonal.trim();
	objet.title.series = objet.title.series.trim();

	return objet;
};
