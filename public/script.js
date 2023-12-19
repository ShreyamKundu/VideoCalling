const socket = io('/');
const VideoGrid = document.querySelector('.video-grid');
const myVideo = document.createElement('video');
const ChatMsg = document.querySelector('#chat_message');
const messages = document.querySelector('.messages');
const MuteBtn = document.querySelector('.main__controls__mute');
const VideoBtn = document.querySelector('.main__controls__video');

var peer = new Peer(undefined);


let myVideoStream;
navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true
}).then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo , stream);

    socket.on('user-connected', (userId) => {
        connectToNewUser(userId,stream);
    })

    peer.on('call', call => {
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream',(UserVideostream) => {
            addVideoStream(video,UserVideostream)
        })
    })
}).catch(err => {
    console.log(err);
})

peer.on('open',id => {
     socket.emit('join-room', RoomId,id);
})



const connectToNewUser = (userId,stream)=> {
    console.log('user connected',userId);
    const call = peer.call(userId,stream);
    const video = document.createElement('video');
    call.on('stream',(UserVideostream) => {
        addVideoStream(video,UserVideostream)
    })
}

const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata',() => {
        video.play();
    })
    VideoGrid.append(video);
}

ChatMsg.addEventListener('keypress', (e) => {
    let text = ChatMsg.value;
    if(e.key === "Enter" && text!= ''){
        console.log(text);
        socket.emit('message',text);
        ChatMsg.value = "";
    }
})

socket.on('createmessage', msg => { 
    console.log('from server',msg);
    messages.innerHTML += `<li class="message"><b>User</b><br/>${msg}</li>`;
    messages.scrollTop = messages.scrollHeight;
})

MuteBtn.addEventListener('click', () => {
    const audioTracks = myVideoStream.getAudioTracks();

    if (audioTracks.length > 0) {
        audioTracks[0].enabled = !audioTracks[0].enabled;
        
        const isMute = !audioTracks[0].enabled;
        const UnmuteHtml =  `<i class="unmute fas fa-microphone-slash"></i>
        <span>Unmute</span>`;
        const MuteHtml = ` <i class=" fas fa-microphone"></i>
        <span>Mute</span>`;
        if(isMute) {
            MuteBtn.innerHTML = UnmuteHtml;
        }else {
            MuteBtn.innerHTML = MuteHtml;
        }
    }
});

VideoBtn.addEventListener('click', () => {
    const videoTracks = myVideoStream.getVideoTracks();

    if (videoTracks.length > 0) {
        videoTracks[0].enabled = !videoTracks[0].enabled;
        
        const isStop = !videoTracks[0].enabled;
        const PlayHtml =  `<i class="stop fas fa-video-slash"></i>
        <span>Play Video</span>`;
        const StopHtml = ` <i class="fas fa-video"></i>
        <span>Stop Video</span>`;
        if(isStop) {
            VideoBtn.innerHTML = PlayHtml;
        }else {
            VideoBtn.innerHTML = StopHtml;
        }
    }
});

















// const socket = io('/');
// const VideoGrid = document.querySelector('.video-grid');
// const myVideo = document.createElement('video');
// myVideo.muted = true;

// var peer = new Peer();

// let myVideoStream;
// navigator.mediaDevices.getUserMedia({
//     audio: true,
//     video: true
// }).then((stream) => {
//     myVideoStream = stream;
//     addVideoStream(myVideo, stream);

//     socket.on('user-connected', (userId) => {
//         connectToNewUser(userId, stream);
//     });

//     peer.on('call', call => {
//         call.answer(stream);
//         const video = document.createElement('video');
//         call.on('stream', (userVideoStream) => {
//             addVideoStream(video, userVideoStream, call.peer);
//         });
//     });
// }).catch(err => {
//     console.log(err);
// });

// peer.on('open', id => {
//     socket.emit('join-room', RoomId, id);
// });

// const connectToNewUser = (userId, stream) => {
//     console.log('User connected:', userId);
//     const call = peer.call(userId, stream);
//     const video = document.createElement('video');
//     call.on('stream', (userVideoStream) => {
//         addVideoStream(video, userVideoStream, userId);
//     });
// };

// const addVideoStream = (video, stream, userId) => {
//     video.srcObject = stream;
//     video.addEventListener('loadedmetadata', () => {
//         video.play();
//     });
//     video.id = userId; // Set the user ID as the video element ID
//     VideoGrid.append(video);
// };
