//https://github.com/goldfire/howler.js/issues/1294#issuecomment-629809366
//genius lol
export const is_audio_playback_available = () => {
  return new Promise(resolve => {
    const checkHTML5Audio = async () => {
      const audio = new Audio();
      try {
        audio.play();
        resolve(false);
      } catch (err) {
        resolve(true);
      }
    };
    try {
      const context = new (window.AudioContext)();
      resolve(context.state === 'suspended');
    } catch (e) {
      checkHTML5Audio();
    }
  });
};
