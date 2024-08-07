// Ensure the script runs after the DOM is fully loaded
window.onload = () => {
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const audioPlayback = document.getElementById('audioPlayback');

    let mediaRecorder;
    let audioChunks = [];

    startBtn.addEventListener('click', async () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorder = new MediaRecorder(stream);

                mediaRecorder.onstart = () => {
                    audioChunks = [];
                    startBtn.disabled = true;
                    stopBtn.disabled = false;
                };

                mediaRecorder.ondataavailable = event => {
                    audioChunks.push(event.data);
                };

                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                    const audioUrl = URL.createObjectURL(audioBlob);
                    audioPlayback.src = audioUrl;
                    startBtn.disabled = false;
                    stopBtn.disabled = true;
                };

                mediaRecorder.start();
            } catch (error) {
                console.error('Error accessing microphone:', error);
            }
        } else {
            console.warn('getUserMedia is not supported in this browser.');
        }
    });

    stopBtn.addEventListener('click', () => {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
        }
    });


};