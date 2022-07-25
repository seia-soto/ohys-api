import test from 'ava';
import * as parser from '../source/parser.js';

test('isNumeric', t => {
	t.is(parser.isNumeric(' '), false);
	t.is(parser.isNumeric('0'), true);
	t.is(parser.isNumeric('1'), true);
});

test('getLeadingNumeric', t => {
	t.deepEqual(parser.getLeadingNumeric('1a', 0), [1, 1]);
	t.deepEqual(parser.getLeadingNumeric('123a', 0), [123, 3]);
	t.deepEqual(parser.getLeadingNumeric('a', 0), [NaN, 0]);
	t.deepEqual(parser.getLeadingNumeric('12', 0), [12, 2]);
});

test('getLiteralPosition', t => {
	t.deepEqual(parser.getLiteralPosition('abc-', 0, '-'), ['abc', 3]);
});

test('getNumbericSize', t => {
	t.is(parser.getNumericSize(1), 1);
	t.is(parser.getNumericSize(0), 1);
	t.is(parser.getNumericSize(10), 2);
	t.is(parser.getNumericSize(100), 3);
});

test('isAlphabet', t => {
	t.is(parser.isAlphabet('a'), true);
	t.is(parser.isAlphabet('A'), false);
	t.is(parser.isAlphabet('z'), true);
	t.is(parser.isAlphabet('Z'), false);
	t.is(parser.isAlphabet('0'), false);
	t.is(parser.isAlphabet('-'), false);
});

test('parse', t => {
	// Title with numeric episode number
	t.deepEqual(
		parser.parse('Title - 1 (CH 1920x1080 x264 AAC)'),
		{
			title: {
				original: 'Title',
				seasonal: 'Title',
				series: '',
			},
			file: {
				name: 'Title - 1 (CH 1920x1080 x264 AAC)',
				resolution: '1920x1080',
				codec: {
					video: 'x264',
					audio: 'AAC',
				},
			},
			provider: {
				channel: 'CH',
			},
			episodes: [1],
			seasons: [1],
		},
	);
	// Title with numeric episode number and season number
	t.deepEqual(
		parser.parse('Title 2 - 1 (CH 1920x1080 x264 AAC)'),
		{
			title: {
				original: 'Title',
				seasonal: 'Title 2',
				series: '',
			},
			file: {
				name: 'Title 2 - 1 (CH 1920x1080 x264 AAC)',
				resolution: '1920x1080',
				codec: {
					video: 'x264',
					audio: 'AAC',
				},
			},
			provider: {
				channel: 'CH',
			},
			episodes: [1],
			seasons: [2],
		},
	);
	// Title with two digit numeric episode number
	t.deepEqual(
		parser.parse('Title - 01 (CH 1920x1080 x264 AAC)'),
		{
			title: {
				original: 'Title',
				seasonal: 'Title',
				series: '',
			},
			file: {
				name: 'Title - 01 (CH 1920x1080 x264 AAC)',
				resolution: '1920x1080',
				codec: {
					video: 'x264',
					audio: 'AAC',
				},
			},
			provider: {
				channel: 'CH',
			},
			episodes: [1],
			seasons: [1],
		},
	);
	// Title with float type episode number
	t.deepEqual(
		parser.parse('Title - 01.2 (CH 1920x1080 x264 AAC)'),
		{
			title: {
				original: 'Title',
				seasonal: 'Title',
				series: '',
			},
			file: {
				name: 'Title - 01.2 (CH 1920x1080 x264 AAC)',
				resolution: '1920x1080',
				codec: {
					video: 'x264',
					audio: 'AAC',
				},
			},
			provider: {
				channel: 'CH',
			},
			episodes: [1.2],
			seasons: [1],
		},
	);
	// Title with series name and episode number
	t.deepEqual(
		parser.parse('Title - Subtitle - 01 (CH 1920x1080 x264 AAC)'),
		{
			title: {
				original: 'Title',
				seasonal: 'Title',
				series: 'Subtitle',
			},
			file: {
				name: 'Title - Subtitle - 01 (CH 1920x1080 x264 AAC)',
				resolution: '1920x1080',
				codec: {
					video: 'x264',
					audio: 'AAC',
				},
			},
			provider: {
				channel: 'CH',
			},
			episodes: [1],
			seasons: [1],
		},
	);
	// Title with ranged episode number
	t.deepEqual(
		parser.parse('Title - SUB2-9 (CH 1920x1080 x264 AAC)'),
		{
			title: {
				original: 'Title',
				seasonal: 'Title',
				series: 'SUB',
			},
			file: {
				name: 'Title - SUB2-9 (CH 1920x1080 x264 AAC)',
				resolution: '1920x1080',
				codec: {
					video: 'x264',
					audio: 'AAC',
				},
			},
			provider: {
				channel: 'CH',
			},
			episodes: [
				2, 3, 4, 5, 6, 7, 8, 9,
			],
			seasons: [1],
		},
	);
	// Title with provider name
	t.deepEqual(
		parser.parse('[PROVIDER] Title - SUB2-9 (CH 1920x1080 x264 AAC)'),
		{
			title: {
				original: 'Title',
				seasonal: 'Title',
				series: 'SUB',
			},
			file: {
				name: '[PROVIDER] Title - SUB2-9 (CH 1920x1080 x264 AAC)',
				resolution: '1920x1080',
				codec: {
					video: 'x264',
					audio: 'AAC',
				},
			},
			provider: {
				channel: 'CH',
			},
			episodes: [
				2, 3, 4, 5, 6, 7, 8, 9,
			],
			seasons: [1],
		},
	);
	// Title with literal season
	t.deepEqual(
		parser.parse('[PROVIDER] Title 2nd season - SUB2-9 (CH 1920x1080 x264 AAC)'),
		{
			title: {
				original: 'Title',
				seasonal: 'Title 2nd season',
				series: 'SUB',
			},
			file: {
				name: '[PROVIDER] Title 2nd season - SUB2-9 (CH 1920x1080 x264 AAC)',
				resolution: '1920x1080',
				codec: {
					video: 'x264',
					audio: 'AAC',
				},
			},
			provider: {
				channel: 'CH',
			},
			episodes: [
				2, 3, 4, 5, 6, 7, 8, 9,
			],
			seasons: [2],
		},
	);
	// Title with no episode numbers (condensed)
	t.deepEqual(
		parser.parse('[PROVIDER] Title 2nd season (CH 1920x1080 x264 AAC)'),
		{
			title: {
				original: 'Title',
				seasonal: 'Title 2nd season',
				series: '',
			},
			file: {
				name: '[PROVIDER] Title 2nd season (CH 1920x1080 x264 AAC)',
				resolution: '1920x1080',
				codec: {
					video: 'x264',
					audio: 'AAC',
				},
			},
			provider: {
				channel: 'CH',
			},
			episodes: [],
			seasons: [2],
		},
	);
	// Title with episode name including ending note
	t.deepEqual(
		parser.parse('[PROVIDER] Title 2nd season - 2 END (CH 1920x1080 x264 AAC)'),
		{
			title: {
				original: 'Title',
				seasonal: 'Title 2nd season',
				series: '',
			},
			file: {
				name: '[PROVIDER] Title 2nd season - 2 END (CH 1920x1080 x264 AAC)',
				resolution: '1920x1080',
				codec: {
					video: 'x264',
					audio: 'AAC',
				},
			},
			provider: {
				channel: 'CH',
			},
			episodes: [2],
			seasons: [2],
		},
	);
});
