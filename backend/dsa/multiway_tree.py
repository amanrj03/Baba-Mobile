class TreeNode:
    def __init__(self, name, node_id=None):
        self.name = name
        self.id = node_id
        self.children = []
        self.parent = None
    
    def add_child(self, child):
        child.parent = self
        self.children.append(child)
    
    def get_path(self):
        path = []
        node = self
        while node:
            path.insert(0, node.name)
            node = node.parent
        return path

class CategoryTree:
    def __init__(self):
        self.root = TreeNode("Electronics")
        self.nodes = {}
    
    def add_category(self, parent_name, category_name, category_id):
        parent = self._find_node(self.root, parent_name)
        if parent:
            node = TreeNode(category_name, category_id)
            parent.add_child(node)
            self.nodes[category_id] = node
    
    def _find_node(self, node, name):
        if node.name == name:
            return node
        for child in node.children:
            result = self._find_node(child, name)
            if result:
                return result
        return None
    
    def get_breadcrumb(self, category_id):
        if category_id in self.nodes:
            return self.nodes[category_id].get_path()
        return []
    
    def get_tree_structure(self):
        return self._serialize(self.root)
    
    def _serialize(self, node):
        return {
            'name': node.name,
            'id': node.id,
            'children': [self._serialize(child) for child in node.children]
        }
