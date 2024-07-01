const version = '2.0.0';  // * Change this if you want to change the version that is displayed in the net-stats container.
const pingTime = '1000';  // * Change this if you want to change how often the ping is updated (in milliseconds), the default is 3000ms (3 seconds).
const pingUrl = 'http://localhost:3000'; // * Change this to your localhost port, the default port is 3000
const previewUrl = 'http://localhost:3000/overlay'; // * Change this to your localhost port ./overlay, the default port is 3000
const lockInterfaceBtn = document.getElementById('lockInterfaceBtn');
function updateVersion() {
    const versionElement = document.getElementById('version-value');
    versionElement.textContent = version;
}

function toggleMenu() {
    const menuButton = document.querySelector('.hamburger-menu');
    const sideNav = document.querySelector('.sidenavbar');
    menuButton.classList.toggle('active');
    sideNav.classList.toggle('active');
}

function measurePing(url, callback) {
    const startTime = performance.now();

    fetch(url, { method: 'HEAD', cache: 'no-store' })
        .then(response => {
            if (response.ok) {
                const endTime = performance.now();
                const time = Math.round(endTime - startTime);
                callback(time);
            } else {
                callback('Ping Error: ' + response.status);
            }
        })
        .catch(() => {
            callback('Ping Error');
        });
}

function updatePing() {
    measurePing(pingUrl, ping => {
        const pingElement = document.getElementById('ping-value');
        if (typeof ping === 'number') {
            pingElement.textContent = `${ping} ms`;
        } else {
            pingElement.textContent = ping;
        }
    });
}


lockInterfaceBtn.addEventListener('click', function(event) {
    if (event.target !== lockInterfaceBtn) {
        document.body.classList.toggle('interface-locked');
        
        if (document.body.classList.contains('interface-locked')) {
            lockInterfaceBtn.innerHTML = '<strong>Unlock Interface</strong>';
            localStorage.setItem('lockState', 'locked');
        } else {
            lockInterfaceBtn.innerHTML = '<strong>Lock Interface</strong>';
            localStorage.setItem('lockState', 'unlocked');
        }
    }
});

// When refreshed load the lock state from local storage, if locked add the class to the index
window.addEventListener('load', function() {
    const lockState = localStorage.getItem('lockState');
    
    if (lockState === 'locked') {
        document.body.classList.add('interface-locked');
        lockInterfaceBtn.innerHTML = '<strong>Unlock Interface</strong>';
    } else {
        document.body.classList.remove('interface-locked');
        lockInterfaceBtn.innerHTML = '<strong>Lock Interface</strong>';
    }
});



updateVersion();
updatePing();
//* Updates ping every X second (1X*1000ms = 1 second)
setInterval(updatePing, pingTime);

function testLatency() {
    var startTime = Date.now();
    fetch(window.location.href) 
        .then(function(response) {
            var endTime = Date.now();
            var latency = endTime - startTime;
            document.getElementById('ping-value').textContent = latency + ' ms';
        })
        .catch(function(err) {
            console.error('Error fetching data:', err);
        });
}

document.addEventListener("DOMContentLoaded", function() {
    var iframe = document.getElementById("previewIframe");

    iframe.src = previewUrl;
});

function updatePing() {
    testLatency();
    setTimeout(updatePing, pingTime); 
}

updatePing(); 