from .trie import Trie
from .multiway_tree import CategoryTree
from .avl import AVLTree
from .heap import MaxHeap
from .graph import RecommendationGraph

class DSAManager:
    def __init__(self):
        self.trie = Trie()
        self.category_tree = CategoryTree()
        self.price_tree = AVLTree()
        self.sales_heap = MaxHeap()
        self.rating_heap = MaxHeap()
        self.recommendation_graph = RecommendationGraph()
    
    def load_products(self, products):
        for product in products:
            self.trie.insert(product.name, product.id)
            self.trie.insert(product.model.brand.name, product.id)
            self.trie.insert(product.model.name, product.id)
            self.price_tree.insert(float(product.final_price), product.id)
            self.sales_heap.insert(product.sales, product.id)
            if product.average_rating:
                self.rating_heap.insert(product.average_rating, product.id)
    
    def autocomplete(self, prefix):
        return self.trie.search_prefix(prefix)
    
    def price_range_search(self, min_price, max_price):
        return self.price_tree.range_query(min_price, max_price)
    
    def get_top_selling(self, n=10):
        return self.sales_heap.get_top(n)
    
    def get_top_rated(self, n=10):
        return self.rating_heap.get_top(n)
    
    def get_recommendations(self, product_id, limit=5):
        return self.recommendation_graph.get_recommendations(product_id, limit)

dsa_manager = DSAManager()
