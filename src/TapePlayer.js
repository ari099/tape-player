import './TapePlayer.css';
import anime from 'animejs';
import { useEffect, useRef, useState } from 'react';

/**
 * Potentially draggable tape player tracker component
 */
 const TapePlayerTracker = props => {
    const [trackerPosX, setTrackerPosX] = useState(0);
    useEffect(() => {
      setTrackerPosX((props.trackWidth * (props.currentTime / props.totalTime)) + 8);
    });
    return (
      <>
        <rect id="player-track"
          height={5} width={190}
          x={8} y={135} />
        <g id="player-tracker">
          <rect id="player-tracker-bottom"
            x={trackerPosX} y={124} height={20} width={8} />
          <rect id="player-tracker-top"
            x={trackerPosX} y={124} height={17} width={8} />
        </g>
      </>
    );
  };

/**
 * TapePlayer React Component
 */
const TapePlayer = props => {
  const reelsAnimationRef = useRef(null);
  const sound = useRef(new Audio('https://www.kozco.com/tech/audacity/ShudBeOKNow.mp3'));
  const [trackName, setTrackName] = useState("Piano Track.mp3");
  const [seekValue, setSeekValue] = useState(0);
  const [duration, setDuration] = useState(0);
  useEffect(() => {
    setSeekValue(sound.current.currentTime);
    sound.current.type = "audio/mpeg";
    sound.current.addEventListener('ended', () => { rewindTrack(); });
    sound.current.addEventListener('loadedmetadata', () => { setDuration(sound.current.duration); });
    sound.current.addEventListener('timeupdate', () => { setSeekValue(sound.current.currentTime); });
    sound.current.volume = 0.1;
    sound.current.load();
    reelsAnimationRef.current = anime({
          targets: '.reel-platter',
          rotate: '360deg',
          loop: true,
          duration: 400,
          easing: 'linear'
    });
    reelsAnimationRef.current.pause();
  }, []);

  const rewindTrack = () => {
    reelsAnimationRef.current.pause();
    let rewindAnimation = anime.timeline({
      easing: 'easeInOutQuad',
      duration: 200
    });
    
    rewindAnimation.add({
      targets: ".reel-platter",
      rotate: "0deg"
    }).add({
      targets: '#player-tracker-bottom, #player-tracker-top',
      x: 0,
      complete: () => { 
        sound.current.pause();
        sound.current.currentTime = 0;
      }
    }, '-=300');
  };

  const playTrack = () => {
    reelsAnimationRef.current.restart();
    sound.current.play();
  }
  const stopTrack = () => { 
    reelsAnimationRef.current.pause();
    sound.current.pause()
  };

  return (
      <>
        <svg className="tape-player" width="210" height="189.715">
            <g id="layer1">
                <rect id="tape-player-bottom"
                    height={189} width={210}
                    x={0} y={0} />
                <rect id="tape-player-top"
                    height={184} width={210}
                    x={0} y={0} />
                <TapePlayerTracker limit={150}
                  currentTime={seekValue}
                  totalTime={duration}
                  trackWidth={182} />
                <text className="track-name" x={8} y={111}>{trackName}</text>
                <polygon className="play-button" onClick={playTrack} points="8,155 8,170 23,162.5" />
                <rect className="stop-button" onClick={stopTrack} x={35} y={155} height={15} width={15} />
                <g className="rewind-button" onClick={rewindTrack}>
                  <polygon points="65,162.5 75,155 75,170" />
                  <rect x={62} y={155} height={15} width={2.5} />
                </g>
                <g id="reel-left" transform="translate(-5.9629533)">
                    <circle id="reel-bottom-left"
                        cx={65.175735} cy={55.370739} r={33.105137} />
                    <g className="reel-platter">
                        <circle id="reel-platter-left"
                            cx={65.175735} cy={51.607777} r={33.105137} />
                        <path id="reel-holes-left"
                            d="m 65.17649,24.032378 a 27.352509,27.352509 0 0 0 -12.973007,3.293021 l 11.890571,20.59544 a 3.6470017,3.6470017 0 0 1 1.082436,-0.182834 3.6470017,3.6470017 0 0 1 1.082767,0.182834 L 78.14983,27.325399 A 27.352509,27.352509 0 0 0 65.17649,24.032378 Z M 37.857557,52.282382 A 27.352509,27.352509 0 0 0 50.827252,74.649865 L 62.714841,54.059724 a 3.6470017,3.6470017 0 0 1 -1.058587,-1.777342 z m 30.852087,0 A 3.6470017,3.6470017 0 0 1 67.6441,54.069329 L 79.534008,74.663776 A 27.352509,27.352509 0 0 0 92.512647,52.282382 Z" />
                    </g>
                </g>
                <g id="reel-right" transform="translate(5.9629533)">
                    <circle id="reel-bottom-right"
                        cx={144.55074} cy={55.370739} r={33.105137} />
                    <g className="reel-platter">
                        <circle id="reel-platter-right"
                            cx={144.55074} cy={51.607777} r={33.105137} />
                        <path id="reel-holes-right"
                            d="m 144.55149,24.032378 a 27.352509,27.352509 0 0 0 -12.973,3.293021 l 11.89057,20.59544 a 3.6470017,3.6470017 0 0 1 1.08243,-0.182834 3.6470017,3.6470017 0 0 1 1.08277,0.182834 l 11.89058,-20.59544 a 27.352509,27.352509 0 0 0 -12.97335,-3.293021 z m -27.31893,28.250004 a 27.352509,27.352509 0 0 0 12.9697,22.367483 l 11.88759,-20.590141 a 3.6470017,3.6470017 0 0 1 -1.05859,-1.777342 z m 30.85209,0 a 3.6470017,3.6470017 0 0 1 -1.06555,1.786947 l 11.88991,20.594447 a 27.352509,27.352509 0 0 0 12.97864,-22.381394 z" />
                    </g>
                </g>
            </g>
        </svg>
      </>
  );
}

export default TapePlayer;
