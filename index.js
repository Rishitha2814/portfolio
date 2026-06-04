document.getElementById('startBtn').addEventListener('click', startVisualization);

// Helper function to pause execution for a clean animation timing loop
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function startVisualization() {
    const inputField = document.getElementById('wordInput');
    const track = document.getElementById('visualTrack');
    const status = document.getElementById('statusAlert');
    const startBtn = document.getElementById('startBtn');

    // Clean up input spaces
    let word = inputField.value.toUpperCase().replace(/\s+/g, '');
    if (!word) {
        status.textContent = "Please provide an alphanumeric text string.";
        return;
    }

    // Freeze inputs during active visualization loop
    startBtn.disabled = true;
    inputField.disabled = true;
    track.innerHTML = '';
    status.textContent = "Initializing pointers (Left = 0, Right = N-1)...";

    // Build the visual string track in the DOM
    for (let i = 0; i < word.length; i++) {
        const box = document.createElement('div');
        box.className = 'char-box';
        box.textContent = word[i];
        box.id = `char-${i}`;
        track.appendChild(box);
    }

    // Brief pause to let the user see the initial setup
    await delay(1000);

    // Two-Pointer Initialization
    let left = 0;
    let right = word.length - 1;
    let isPalindrome = true;

    while (left <= right) {
        const leftBox = document.getElementById(`char-${left}`);
        const rightBox = document.getElementById(`char-${right}`);

        // Apply pointer styles to trigger CSS pulseSelect animation
        if (left === right) {
            leftBox.className = 'char-box both-ptr';
            status.textContent = `Pointers met at index ${left}. Evaluating center element.`;
        } else {
            leftBox.classList.add('left-ptr');
            rightBox.classList.add('right-ptr');
            status.textContent = `Comparing indices: Left [${left}] vs Right [${right}]`;
        }

        // Give the selection pulse animation time to run fully
        await delay(1200);

        // Evaluate character equivalence
        if (word[left] === word[right]) {
            leftBox.className = 'char-box match';
            rightBox.className = 'char-box match';
            status.textContent = `Match: '${word[left]}' equals '${word[right]}'`;
        } else {
            leftBox.className = 'char-box mismatch';
            rightBox.className = 'char-box mismatch';
            status.textContent = `Mismatch: '${word[left]}' does not match '${word[right]}'`;
            isPalindrome = false;
            break; // Stop immediately on validation failure
        }

        // Give the success pop animation time to flash before stepping forward
        await delay(1000);

        // Clear pointer indicators before updating index states
        leftBox.classList.remove('left-ptr');
        rightBox.classList.remove('right-ptr');

        left++;
        right--;
    }

    // Final result output mapping
    if (isPalindrome) {
        status.style.color = '#4ade80';
        status.textContent = "Success: Valid symmetric palindrome verified!";
    } else {
        status.style.color = '#f87171';
        status.textContent = "Failed: Asymmetric sequence matches broken.";
    }

    // Re-enable interface controls
    startBtn.disabled = false;
    inputField.disabled = false;
    
    // Reset status text color back to default after 4 seconds
    setTimeout(() => { status.style.color = ''; }, 4000);
}
