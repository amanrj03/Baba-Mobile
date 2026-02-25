from collections import defaultdict, deque

class RecommendationGraph:
    def __init__(self):
        self.graph = defaultdict(lambda: defaultdict(int))
    
    def add_edge(self, product1, product2, weight=1):
        self.graph[product1][product2] += weight
        self.graph[product2][product1] += weight
    
    def get_recommendations(self, product_id, limit=5):
        if product_id not in self.graph:
            return []
        
        recommendations = sorted(
            self.graph[product_id].items(),
            key=lambda x: x[1],
            reverse=True
        )
        return [prod_id for prod_id, _ in recommendations[:limit]]
    
    def add_user_interaction(self, user_id, product_ids):
        for i in range(len(product_ids)):
            for j in range(i + 1, len(product_ids)):
                self.add_edge(product_ids[i], product_ids[j])
