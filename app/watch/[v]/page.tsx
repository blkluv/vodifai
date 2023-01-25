import { VideoInfo } from './types';
import ytdl, { captionTrack } from 'ytdl-core';
import {
	getTranscriptBackground,
	getVideoColors,
	getWatchViewBackground,
	getWatchViewColors,
} from './utils';
import { CSSProperties } from 'react';
import { SearchBar } from 'app/SearchBar';
import { Player } from './Player';
import { PlayerProvider } from './PlayerProvider';
import { Controls } from './Controls';
import { DownloadButton } from './DownloadButton';
import FileDownloadIcon from '@/public/file-download-icon.svg';
import { ShareButton } from './ShareButton';
import ShareIcon from '@/public/share-icon.svg';
import { TranscriptControls } from './Transcript/TranscriptControls';
import { Top } from './Transcript/Top';
import SearchIcon from '@/public/search-icon.svg';
import { MinimizeButton } from './Transcript/MinimizeButton';
import ChevronDownIcon from '@/public/chevron-back-icon.svg';
import { SearchTranscriptButton } from './Transcript/SearchTranscriptButton';
import { Transcript } from './Transcript';
import { Bottom } from './Transcript/Bottom';
import { ExpandButton } from './Transcript/ExpandButton';
import ExpandIcon from '@/public/expand-icon.svg';
import { Captions } from './Transcript/Captions';
import styles from './watch.module.scss';
import transcriptStyles from './Transcript/transcript.module.scss';

const baseYoutubeUrl = 'https://www.youtube.com/watch?v=';

async function getVideoInfo(
	videoId: string
): Promise<{ videoInfo: VideoInfo; captionTracks: captionTrack[] }> {
	const info = await ytdl.getInfo(videoId);
	const videoColors = await getVideoColors(info.videoDetails.thumbnails);

	return {
		videoInfo: {
			id: videoId,
			url: `${baseYoutubeUrl}${videoId}`,
			videoDetails: {
				author: {
					id: info.videoDetails.author.id,
					name: info.videoDetails.author.name,
				},
				description: info.videoDetails.description,
				title: info.videoDetails.title,
				duration: parseInt(info.videoDetails.lengthSeconds),
			},
			videoColors: getWatchViewColors(videoColors),
			formats: info.formats,
		},
		captionTracks:
			info.player_response.captions?.playerCaptionsTracklistRenderer
				.captionTracks || [],
	};
}

interface WatchPageProps {
	params: { v: string };
}

export default async function WatchPage({
	params: { v: videoId },
}: WatchPageProps) {
	const { videoInfo, captionTracks } = await getVideoInfo(videoId);

	const {
		videoDetails: {
			title: videoTitle,
			author: { name: authorName },
		},
		videoColors: { primaryBackground, secondaryBackground },
	} = videoInfo;

	return (
		<div
			className={styles.watchView}
			style={
				{
					background: getWatchViewBackground(primaryBackground),
					'--transcript-color': getTranscriptBackground(secondaryBackground),
				} as CSSProperties
			}
		>
			<SearchBar isButton />
			<PlayerProvider videoInfo={videoInfo}>
				<Player />
				<div className={styles.playerTray}>
					<div className={styles.details}>
						<div className={styles.detailsText}>
							<span className={styles.title}>{videoTitle}</span>
							<span className={styles.author}>{authorName}</span>
						</div>
					</div>
					<Controls />
					<div className={styles.secondaryControls}>
						<DownloadButton
							ariaLabel={'Open downloads menu'}
							icon={<FileDownloadIcon className={styles.secondaryButtonIcon} />}
						/>
						<ShareButton
							ariaLabel={'Share Video'}
							icon={<ShareIcon className={styles.secondaryButtonIcon} />}
						/>
					</div>
				</div>
				{/* @ts-expect-error Server Component */}
				<Transcript captionTracks={captionTracks}>
					<Top>
						<SearchTranscriptButton
							ariaLabel={'Search transcript'}
							icon={<SearchIcon className={styles.searchIcon} />}
						/>
						<div className={transcriptStyles.transcriptDetails}>
							<div className={transcriptStyles.transcriptTitle}>
								{videoTitle}
							</div>
							<div>{authorName}</div>
						</div>
						<MinimizeButton
							ariaLabel={'Minimize transcript'}
							icon={
								<ChevronDownIcon className={transcriptStyles.chevronDownIcon} />
							}
						/>
					</Top>
					<TranscriptControls>
						<Controls />
					</TranscriptControls>
					<Bottom>
						<div className={transcriptStyles.transcriptHeader}>
							<div>{'Transcript'}</div>
							<div className={transcriptStyles.bottomButtons}>
								<ExpandButton
									ariaLabel={'Expand transcript'}
									icon={<ExpandIcon className={transcriptStyles.expandIcon} />}
								/>
							</div>
						</div>
						<div className={transcriptStyles.captionsWrapper}>
							<Captions />
						</div>
					</Bottom>
				</Transcript>
			</PlayerProvider>
		</div>
	);
}
