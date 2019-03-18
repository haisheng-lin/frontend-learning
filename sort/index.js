const testArr = [2, 4, 1, 5];

/**
 * 交换元素
 *
 * @param {number[]} nums
 * @param {number} i
 * @param {number} j
 */
function swap (nums, i, j) {
  const temp = nums[i];
  nums[i] = nums[j];
  nums[j] = temp;
}

/**
 * 选择排序：对于每个待排序的位置，试图这位置后寻找比它更小的元素
 *
 * @param {number[]} nums
 * @returns {number[]}
 */
function selectionSort (nums) {
  const ret = nums.slice(0);
  for (let i = 0; i < ret.length; i++) {
    for (let j = i + 1; j < ret.length; j++) {
      if (ret[j] < ret[i]) {
        swap(ret, i, j);
      }
    }
  }
  return ret;
}

console.log(selectionSort(testArr));

/**
 * 冒泡排序：依次比较两个相邻的元素，如果它们的顺序错误就把他们交换过来
 *
 * @param {number[]} nums
 * @returns {number[]}
 */
function bubbleSort (nums) {
  const ret = nums.slice(0);
  for (let i = nums.length - 1; i >= 0; i--) {
    for (let j = 0; j < i; j++) {
      if (ret[j] > ret[j + 1]) {
        swap(ret, j, j + 1);
      }
    }
  }
  return ret;
}

console.log(bubbleSort(testArr));

/**
 * 归并排序：每次对数组进行对半分，对每一半先排序，再合并起来
 *
 * @param {number[]} nums
 * @returns {number[]}
 */
function mergeSort (nums) {
  if (!nums || nums.length <= 1) {
    return nums;
  }
  const halfIndex = Math.floor(nums.length / 2);
  const left = mergeSort(nums.slice(0, halfIndex));
  const right = mergeSort(nums.slice(halfIndex, nums.length));

  const ret = [];
  let p1 = 0, p2 = 0;
  while (p1 < left.length || p2 < right.length) {
    if (p2 >= right.length || left[p1] < right[p2]) {
      ret.push(left[p1]);
      p1++;
    } else {
      ret.push(right[p2]);
      p2++;
    }
  }
  return ret;
}

console.log(mergeSort(testArr));

/**
 * 快速排序
 *
 * @param {number[]} nums
 * @returns {number[]}
 */
function quickSort (nums) {
  const cloned = nums.slice(0);
  quickSortUtil(cloned, 0, cloned.length - 1);
  return cloned;
}

/**
 * 快速排序：辅助函数
 *
 * @param {number[]} nums
 * @param {number} start
 * @param {number} end
 * @returns {void}
 */
function quickSortUtil (nums, start, end) {
  if (!nums || start >= end) {
    return;
  }
  const pivot = nums[start];
  let lo = start, hi = end; // lo 是待替换元素的前一个位置，hi 是当前被比较的元素的位置
  while (lo < hi) {
    if (nums[hi--] < pivot) { // 把小于 pivot 的元素置于左边，大于 pivot 的元素置于右边
      lo++;
      hi++;
      swap(nums, lo, hi);
    }
  }
  swap(nums, start, lo); // 把 pivot 置于它在数组里第 lo 大的位置

  quickSortUtil(nums, start, lo - 1);
  quickSortUtil(nums, lo, hi);
}

console.log(quickSort(testArr));
