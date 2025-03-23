let array = [];
let steps = [];
let currentStep = 0;
const maxHeight = 200; // Max height for bars
const barWidth = 30; // Fixed width for bars
const sortMethod = "bubble";
const inputString = [8,4,7,5,3,9,2,6,1,10];
const inputArray = inputString.slice();
// Function to trigger sorting algorithm and visualization
function generateAndSort() {
    // Use the global variables for sortMethod and inputArray
    sortArrayWithFunction(sortMethod, inputArray); 
}

// Function to execute the chosen sorting algorithm
function sortArrayWithFunction(sortMethod, arr) {
    array = arr.slice();  // Copy the array
    steps = [];           // Clear any previous steps
    currentStep = 0;

    // Call the respective sorting function based on sortMethod
    switch (sortMethod) {
        case 'bubble':
            bubbleSort(array.slice());
            break;
        case 'insertion':
            insertionSort(array.slice());
            break;
        case 'selection':
            selectionSort(array.slice());
            break;
        case 'quick':
            quickSort(array.slice(), 0, array.length - 1);
            break;
        case 'merge':
            mergeSort(array.slice());
            break;
        case 'counting':
            countingSort(array.slice());
            break;
        case 'radix':
            radixSort(array.slice());
            break;
        case 'heap':
            heapSort(array.slice());
            break;
        case 'bucket':
            bucketSort(array.slice());
            break;
        default:
            console.error('Invalid sorting method');
            return;
    }

    renderArray(); // Render the array after sorting
}

// Sorting Algorithms

// Bubble Sort
function bubbleSort(arr) {
    let tempArr = arr.slice();
    let stepsTemp = [];
    for (let i = 0; i < tempArr.length; i++) {
        for (let j = 0; j < tempArr.length - 1 - i; j++) {
            if (tempArr[j] > tempArr[j + 1]) {
                [tempArr[j], tempArr[j + 1]] = [tempArr[j + 1], tempArr[j]]; // Swap
                stepsTemp.push(tempArr.slice()); // Capture the state after each swap
            }
        }
    }
    steps = stepsTemp;
}

// Insertion Sort
function insertionSort(arr) {
    let tempArr = arr.slice();
    let stepsTemp = [];
    for (let i = 1; i < tempArr.length; i++) {
        let key = tempArr[i];
        let j = i - 1;
        while (j >= 0 && tempArr[j] > key) {
            tempArr[j + 1] = tempArr[j];
            j--;
        }
        tempArr[j + 1] = key;
        stepsTemp.push(tempArr.slice());
    }
    steps = stepsTemp;
}

// Merge Sort
function mergeSort(arr) {
    if (arr.length <= 1) return arr;
    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));
    return merge(left, right, arr);
}

function merge(left, right, arr) {
    const result = [];
    let i = 0, j = 0;
    while (i < left.length && j < right.length) {
        if (left[i] < right[j]) result.push(left[i++]);
        else result.push(right[j++]);
    }
    result.push(...left.slice(i));
    result.push(...right.slice(j));
    for (let k = 0; k < result.length; k++) {
        arr[k] = result[k];
    }
    steps.push(arr.slice()); // Capture the state of the array after each merge
}

// Quick Sort
function quickSort(arr, low, high) {
    if (low < high) {
        let pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

function partition(arr, low, high) {
    let pivot = arr[high];
    let i = low - 1;
    for (let j = low; j <= high - 1; j++) {
        if (arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
}

// Counting Sort
function countingSort(arr) {
    let tempArr = arr.slice();
    let max = Math.max(...tempArr);
    let min = Math.min(...tempArr);
    let count = Array(max - min + 1).fill(0);
    let stepsTemp = [];
    tempArr.forEach(num => count[num - min]++);
    let index = 0;
    for (let i = 0; i <= max - min; i++) {
        while (count[i] > 0) {
            tempArr[index++] = i + min;
            count[i]--;
        }
    }
    stepsTemp.push(tempArr);
    steps = stepsTemp;
}

// Radix Sort
function radixSort(arr) {
    let tempArr = arr.slice();
    let max = Math.max(...tempArr);
    let exp = 1;
    let stepsTemp = [];
    while (max / exp > 1) {
        tempArr = countingSortRadix(tempArr, exp);
        stepsTemp.push(tempArr);
        exp *= 10;
    }
    steps = stepsTemp;
}

function countingSortRadix(arr, exp) {
    let output = Array(arr.length).fill(0);
    let count = Array(10).fill(0);
    for (let i = 0; i < arr.length; i++) {
        let index = Math.floor(arr[i] / exp) % 10;
        count[index]++;
    }
    for (let i = 1; i < 10; i++) {
        count[i] += count[i - 1];
    }
    for (let i = arr.length - 1; i >= 0; i--) {
        let index = Math.floor(arr[i] / exp) % 10;
        output[count[index] - 1] = arr[i];
        count[index]--;
    }
    return output;
}

// Heap Sort
function heapSort(arr) {
    let tempArr = arr.slice();
    let stepsTemp = [];
    let n = tempArr.length;
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(tempArr, n, i);
    }
    for (let i = n - 1; i > 0; i--) {
        [tempArr[0], tempArr[i]] = [tempArr[i], tempArr[0]];
        heapify(tempArr, i, 0);
        stepsTemp.push(tempArr.slice());
    }
    steps = stepsTemp;
}

function heapify(arr, n, i) {
    let largest = i;
    let left = 2 * i + 1;
    let right = 2 * i + 2;
    if (left < n && arr[left] > arr[largest]) largest = left;
    if (right < n && arr[right] > arr[largest]) largest = right;
    if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        heapify(arr, n, largest);
    }
}

// Bucket Sort
function bucketSort(arr) {
    let tempArr = arr.slice();
    let stepsTemp = [];
    let buckets = Array.from({ length: 10 }, () => []); // Create 10 empty buckets
    let max = Math.max(...tempArr);
    let min = Math.min(...tempArr);
    tempArr.forEach(num => {
        let index = Math.floor(((num - min) / (max - min)) * (buckets.length - 1));
        buckets[index].push(num);
    });
    stepsTemp.push(buckets.map(bucket => [...bucket]));  // Capture after distributing
    buckets.forEach(bucket => bucket.sort((a, b) => a - b)); // Sort each bucket
    stepsTemp.push(buckets.map(bucket => [...bucket]));  // Capture after sorting buckets
    tempArr = [].concat(...buckets);  // Merge all the sorted buckets
    stepsTemp.push(tempArr);  // Capture the final sorted array
    steps = stepsTemp;
}

// Render array with bars for visualization
function renderArray() {
    const container = document.getElementById('arrayContainer');
    container.innerHTML = ''; // Clear previous array

    // Render each bar with corresponding value
    for (let i = 0; i < array.length; i++) {
        const bar = document.createElement('div');
        bar.classList.add('bar');

        // Adjust the height of the bars relative to the max value
        const height = (array[i] / Math.max(...array)) * maxHeight;
        bar.style.height = `${height}px`;
        bar.style.width = `${barWidth}px`;

        // Display value inside the bar
        const barText = document.createElement('span');
        barText.classList.add('bar-value');
        barText.innerText = array[i];
        bar.appendChild(barText);

        bar.style.backgroundColor = 'red';  // Initially all bars are red
        container.appendChild(bar);
    }

    // Update the step number on the page
    document.getElementById('stepNumber').innerText = currentStep + 1;
}

// **Next Step**: Move to the next step of the sorting process
function nextStep() {
    if (currentStep < steps.length - 1) {
        currentStep++;
        array = steps[currentStep].slice(); // Get the next step's state
        renderArray();  // Re-render the array for this step
    }
}

// **Previous Step**: Move to the previous step of the sorting process
function prevStep() {
    if (currentStep > 0) {
        currentStep--;
        array = steps[currentStep].slice(); // Get the previous step's state
        renderArray();  // Re-render the array for this step
    }
}
