class AVLNode:
    def __init__(self, price, product_id):
        self.price = price
        self.product_ids = [product_id]
        self.left = None
        self.right = None
        self.height = 1

class AVLTree:
    def __init__(self):
        self.root = None
    
    def insert(self, price, product_id):
        self.root = self._insert(self.root, price, product_id)
    
    def _insert(self, node, price, product_id):
        if not node:
            return AVLNode(price, product_id)
        
        if price < node.price:
            node.left = self._insert(node.left, price, product_id)
        elif price > node.price:
            node.right = self._insert(node.right, price, product_id)
        else:
            node.product_ids.append(product_id)
            return node
        
        node.height = 1 + max(self._get_height(node.left), self._get_height(node.right))
        balance = self._get_balance(node)
        
        if balance > 1 and price < node.left.price:
            return self._right_rotate(node)
        if balance < -1 and price > node.right.price:
            return self._left_rotate(node)
        if balance > 1 and price > node.left.price:
            node.left = self._left_rotate(node.left)
            return self._right_rotate(node)
        if balance < -1 and price < node.right.price:
            node.right = self._right_rotate(node.right)
            return self._left_rotate(node)
        
        return node
    
    def range_query(self, min_price, max_price):
        results = []
        self._range_query(self.root, min_price, max_price, results)
        return results
    
    def _range_query(self, node, min_price, max_price, results):
        if not node:
            return
        if min_price < node.price:
            self._range_query(node.left, min_price, max_price, results)
        if min_price <= node.price <= max_price:
            results.extend(node.product_ids)
        if max_price > node.price:
            self._range_query(node.right, min_price, max_price, results)
    
    def _get_height(self, node):
        return node.height if node else 0
    
    def _get_balance(self, node):
        return self._get_height(node.left) - self._get_height(node.right) if node else 0
    
    def _left_rotate(self, z):
        y = z.right
        T2 = y.left
        y.left = z
        z.right = T2
        z.height = 1 + max(self._get_height(z.left), self._get_height(z.right))
        y.height = 1 + max(self._get_height(y.left), self._get_height(y.right))
        return y
    
    def _right_rotate(self, z):
        y = z.left
        T3 = y.right
        y.right = z
        z.left = T3
        z.height = 1 + max(self._get_height(z.left), self._get_height(z.right))
        y.height = 1 + max(self._get_height(y.left), self._get_height(y.right))
        return y
