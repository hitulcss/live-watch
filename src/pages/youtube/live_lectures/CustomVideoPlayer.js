import React, { useEffect, useRef, useState } from 'react';

const CustomVideoPlayer = ({ videoId }) => {
    const playerRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(50);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [videoTitle, setVideoTitle] = useState('');

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(script);

        script.onload = () => {
            window.YT.ready(() => {
                playerRef.current = new window.YT.Player('youtube-player', {
                    videoId,
                    playerVars: {
                        modestbranding: 1,
                        controls: 0,
                        showinfo: 0,
                        rel: 0,
                    },
                    events: {
                        onReady: onPlayerReady,
                        onStateChange: onPlayerStateChange,
                    },
                });

                fetchVideoTitle();
            });
        };

        return () => {
            document.body.removeChild(script);
        };
    }, [videoId]);

    const fetchVideoTitle = () => {
        fetch(
            `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet&key=AIzaSyD2ae6CguqNoGibnkbkT_TRxytAhZrmmlM`
        )
            .then((response) => response.json())
            .then((data) => {
                setVideoTitle(data.items[0].snippet.title);
            })
            .catch((error) => {
                console.error('Error fetching video title:', error);
            });
    };

    const onPlayerReady = (event) => {
        setDuration(event.target.getDuration());
    };

    const onPlayerStateChange = (event) => {
        const player = playerRef.current;
        const playerState = event.data;

        if (playerState === window.YT.PlayerState.PLAYING) {
            setIsPlaying(true);
        } else if (playerState === window.YT.PlayerState.PAUSED) {
            setIsPlaying(false);
        }
    };

    const togglePlay = () => {
        const player = playerRef.current;
        const playerState = player.getPlayerState();

        if (playerState === window.YT.PlayerState.PLAYING) {
            player.pauseVideo();
        } else if (playerState === window.YT.PlayerState.PAUSED) {
            player.playVideo();
        }
    };

    const handleVolumeChange = (e) => {
        const newVolume = e.target.value;
        setVolume(newVolume);
        const player = playerRef.current;
        player.setVolume(newVolume);
    };

    const handleSeek = (e) => {
        const newTime = (e.target.value / 100) * duration;
        setCurrentTime(newTime);
        const player = playerRef.current;
        player.seekTo(newTime);
    };

    const toggleFullScreen = () => {
        const player = playerRef.current;
        const iframe = player.getIframe();
        const isFullScreenCurrently =
            document.fullscreenElement ||
            document.mozFullScreenElement ||
            document.webkitFullscreenElement ||
            document.msFullscreenElement;

        if (!isFullScreenCurrently) {
            if (iframe.requestFullscreen) {
                iframe.requestFullscreen();
            } else if (iframe.mozRequestFullScreen) {
                iframe.mozRequestFullScreen();
            } else if (iframe.webkitRequestFullscreen) {
                iframe.webkitRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }

        setIsFullScreen(!isFullScreen);
    };

    return (
        <div className="custom-video-player">
            <div id="youtube-player"></div>

            <div className="controls">
                <h2>{videoTitle}</h2>
                <button onClick={togglePlay}>{isPlaying ? 'Pause' : 'Play'}</button>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={handleVolumeChange}
                />
                <input
                    type="range"
                    min="0"
                    max="100"
                    step="0.1"
                    value={(currentTime / duration) * 100 || 0}
                    onChange={handleSeek}
                />
                <button onClick={toggleFullScreen}>{isFullScreen ? 'Exit Fullscreen' : 'Fullscreen'}</button>
            </div>
        </div>
    );
};

export default CustomVideoPlayer;
