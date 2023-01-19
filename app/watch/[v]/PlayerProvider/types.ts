import { Reducer } from 'react';
import { VideoInfo } from '../types';

export interface PlayerReducerState {
	isPlaying: boolean;
	isSeeking: boolean;
	hasSeeked: boolean;
	isBuffering: boolean;
	duration: number;
	played: number;
	videoInfo: VideoInfo;
}

export type PlayerReducerAction =
	| {
			type: 'url';
			url: string;
	  }
	| {
			type: 'play';
	  }
	| {
			type: 'pause';
	  }
	| {
			type: 'seek';
			seconds: number;
	  }
	| {
			type: 'seekEnd';
			seconds: number;
	  }
	| {
			type: 'seekComplete';
	  }
	| {
			type: 'buffer';
	  }
	| {
			type: 'bufferEnd';
	  }
	| {
			type: 'duration';
			seconds: number;
	  }
	| {
			type: 'played';
			seconds: number;
	  };

export type PlayerReducer = Reducer<PlayerReducerState, PlayerReducerAction>;

export interface PlayerProgressReducerState {
	played: number;
}

export type PlayerProgressReducerAction = {
	type: 'played';
	seconds: number;
};

export type PlayerProgressReducer = Reducer<
	PlayerProgressReducerState,
	PlayerProgressReducerAction
>;
