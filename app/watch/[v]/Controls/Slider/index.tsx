import styled from '@emotion/styled';
import { StyledComponent } from '../../types';
import {
	usePlayerStateDispatch,
	usePlayerRef,
	usePlayerState,
} from '../../PlayerProvider/playerContext';
import { Root } from '@radix-ui/react-slider';
import { Track } from './Track';
import { Thumb } from './Thumb';
import { css } from '@emotion/react';

export const Slider = styled(({ className }: StyledComponent) => {
	const {
		duration,
		played,
		videoInfo: { videoDetails },
	} = usePlayerState();
	const playerStateDispatch = usePlayerStateDispatch();
	const { seekTo } = usePlayerRef();

	const handleSeek = (value: number[]) => {
		playerStateDispatch({ type: 'seek', seconds: value[0] });
	};

	const handleSeekCommitted = (value: number[]) => {
		const seconds = value[0];
		playerStateDispatch({ type: 'seekEnd', seconds });
		seekTo(seconds);
	};

	return (
		<form>
			<Root
				className={className}
				value={[played]}
				max={duration || videoDetails.duration}
				step={1}
				aria-label="Player scrubber"
				onValueChange={handleSeek}
				onValueCommit={handleSeekCommitted}
			>
				<Track />
				<Thumb />
			</Root>
		</form>
	);
})(css`
	position: relative;
	display: flex;
	align-items: center;
	user-select: none;
	touch-action: none;
	height: 1rem;
`);
