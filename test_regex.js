
const urls = [
    'https://www.youtube.com/embed/oDygW-E2xWo',
    'https://www.youtube.com/embed/hGZk1o_QkM8',
    'https://www.youtube.com/embed/F7pYpn9j4MA',
    'https://www.youtube.com/embed/v1jJq8j_3Fw',
    'https://www.youtube.com/embed/kh3reR6d_qI',
    'https://www.youtube.com/embed/yr1aXzW5J8I',
    'https://www.youtube.com/embed/UaaYZ8kM4Gg',
    'https://www.youtube.com/embed/l3_Z2K0H5wI'
];

const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
};

console.log("Testing Regex Logic:");
urls.forEach(url => {
    const id = getYouTubeId(url);
    console.log(`URL: ${url} -> ID: '${id}'`);
    if (id.length !== 11) console.error("❌ INVALID ID LENGTH");
});
