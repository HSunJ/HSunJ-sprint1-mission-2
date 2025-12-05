const selectionSort = (arr) => {
  const len = arr.length;

  for (let cur = 0; cur < len-1; cur++) {
    let min = cur;
    for (let j = cur + 1; j < len; j++) {
      if (arr[min] > arr[j]) {
        min = j;
      }
    }
    if (min !== cur) {
      const temp = arr[cur];
      arr[cur] = arr[min];
      arr[min] = temp;
    }
  }
}

const insertionSort = (arr) => {
  const len = arr.length;

  for (let i = 1; i < len; i++) {
    let cur = i;
    for (let j = i - 1; j >= 0; j--) {
      if (arr[j] > arr[cur]) {
        const temp = arr[cur];
        arr[cur] = arr[j];
        arr[j] = temp;
      }
      cur--;
    }
  }
}

const mergeSort = (arr) => {
  if (arr.length <= 1) return arr;

  const result = [];
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  let leftIndex = 0;
  let rightIndex = 0;
  while (leftIndex < left.length || rightIndex < right.length) {
    if (left[leftIndex] < right[rightIndex] || rightIndex === right.length) {
      result.push(left[leftIndex]);
      leftIndex++;
    } else {
      result.push(right[rightIndex]);
      rightIndex++;
    }
  }
  
  return result;
}

const quickSort = (arr, l, r) => {
  if (r <= l) {
    return
  }

  const pivot = arr[l];
  let low = l + 1;
  let high = r;
  
  while (low < high) {
    if (arr[low] <= pivot) {
      low++;
      continue;
    }
    if (arr[high] > pivot) {
      high--;
      continue;
    }

    if (low < high) {
      const temp = arr[low];
      arr[low] = arr[high];
      arr[high] = temp;
    }
  }

  if (pivot < arr[high]) high--;
  arr[l] = arr[high];
  arr[high] = pivot;

  quickSort(arr, l, high - 1);
  quickSort(arr, high + 1, r);
}

const arr1 = [64, 25, 12, 22, 11];
selectionSort(arr1);
console.log("Selection Sort:", arr1);

const arr2 = [12, 11, 13, 5, 6];
insertionSort(arr2);
console.log("Insertion Sort:", arr2);

const arr3 = [38, 27, 43, 3, 9, 82, 10];
const sortedArr3 = mergeSort(arr3);
console.log("Merge Sort:", sortedArr3);

const arr = [10, 7, 8, 9, 1, 5];
quickSort(arr, 0, arr.length - 1);
console.log("Quick Sort:", arr);