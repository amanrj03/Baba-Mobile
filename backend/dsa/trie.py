class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False
        self.products = []

class Trie:
    def __init__(self):
        self.root = TrieNode()
    
    def insert(self, word, product_id):
        node = self.root
        word = word.lower()
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end = True
        if product_id not in node.products:
            node.products.append(product_id)
    
    def search_prefix(self, prefix, limit=10):
        node = self.root
        prefix = prefix.lower()
        for char in prefix:
            if char not in node.children:
                return []
            node = node.children[char]
        
        results = []
        self._collect_products(node, results, limit)
        return results[:limit]
    
    def _collect_products(self, node, results, limit):
        if len(results) >= limit:
            return
        if node.is_end:
            results.extend(node.products)
        for child in node.children.values():
            self._collect_products(child, results, limit)
