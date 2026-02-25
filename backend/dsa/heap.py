class MaxHeap:
    def __init__(self):
        self.heap = []
    
    def insert(self, value, product_id):
        self.heap.append((value, product_id))
        self._heapify_up(len(self.heap) - 1)
    
    def get_top(self, n=10):
        return sorted(self.heap, reverse=True)[:n]
    
    def _heapify_up(self, index):
        parent = (index - 1) // 2
        if index > 0 and self.heap[index][0] > self.heap[parent][0]:
            self.heap[index], self.heap[parent] = self.heap[parent], self.heap[index]
            self._heapify_up(parent)
    
    def _heapify_down(self, index):
        largest = index
        left = 2 * index + 1
        right = 2 * index + 2
        
        if left < len(self.heap) and self.heap[left][0] > self.heap[largest][0]:
            largest = left
        if right < len(self.heap) and self.heap[right][0] > self.heap[largest][0]:
            largest = right
        
        if largest != index:
            self.heap[index], self.heap[largest] = self.heap[largest], self.heap[index]
            self._heapify_down(largest)
